#!/bin/bash
set -e

project_name=ahc-backend
# version=1.2.6
current_version=1.3.1

increment_version() {
  local ver=$1
  local major minor patch
  IFS='.' read -r major minor patch <<< "$ver"
  patch=$((patch + 1))
  echo "${major}.${minor}.${patch}"
}

# current_version=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "^${project_name}:" | awk -F: '{print $2}' | sort -V | tail -n 1)

version=$(increment_version "$current_version")

echo "Using next version: $version"

echo "Building Docker image ${project_name}:${version}..."
docker build -t ${project_name}:"${version}" .

echo "Stopping and removing old container (if exists)..."
if docker ps -a --format '{{.Names}}' | grep -q "^${project_name}$"; then
  docker stop ${project_name}
  docker rm ${project_name}
fi

echo "Removing old Docker image ${project_name}:${current_version} (if exists)..."
if docker images -q "${project_name}:${current_version}" > /dev/null; then
  docker rmi "${project_name}:${current_version}" || echo "Old image may be in use, skipping removal"
fi

echo "Running new container..."
docker run -d --name ${project_name} -p 8000:8000 --env-file .env ${project_name}:"${version}"

sleep 5

if ! docker ps --format '{{.Names}}' | grep -q "^${project_name}$"; then
  echo "Container failed to start. Last log line:"
  docker logs ${project_name} --tail 1
  exit 1
fi

echo "Saving Docker image to tar file..."
docker save ${project_name}:"${version}" | pigz -9 > "${project_name}-${version}.tar.gz"

echo "Copying tar file to remote server..."
scp "${project_name}-${version}.tar.gz" oracle:~/projects

echo "Deploying new Docker image and container on remote server..."
ssh oracle bash -s << EOF
  set -e
  set -o pipefail

  cd ~/projects

  echo "Loading Docker image ${project_name}:${version} from tar..."
  docker load -i "${project_name}-${version}.tar.gz"

  echo "Running Alembic migrations on remote..."
  docker run --rm --env-file ahc.env -e PYTHONPATH=/app -w /app ${project_name}:"${version}" \
    bash -lc '
      set -e
      echo "DB revision before:" && (alembic current || true)
      if ! alembic current >/dev/null 2>&1; then
        echo "No alembic_version table detected; stamping HEAD..."
        alembic stamp head
      fi
      echo "Applying migrations to HEAD..."
      alembic upgrade head
      echo "DB revision after:" && alembic current
    '

  echo "Stopping and removing old container (if exists)..."
  if docker ps -a --format '{{.Names}}' | grep -q '^${project_name}\$'; then
    docker stop ${project_name}
    docker rm ${project_name}
  fi

  echo "Removing old Docker image with previous version if exists..."
  if [ -n "\$(docker images -q "${project_name}:${current_version}")" ]; then
    docker rmi "${project_name}:${current_version}" || echo "Old image may be in use, skipping removal"
  fi

  echo "Running new container with version ${version}..."
  docker run -d --name ${project_name} -p 8000:8000 --env-file ahc.env ${project_name}:"${version}"

  echo "Remote deployment done."

  echo "removing previous container with version ${current_version}..."
  docker image rm ${project_name}:${current_version}

EOF

echo "Done."