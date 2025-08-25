#!/bin/bash
set -e

increment_version() {
  local ver=$1
  local major minor patch
  IFS='.' read -r major minor patch <<< "$ver"
  patch=$((patch + 1))
  echo "${major}.${minor}.${patch}"
}

current_version=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "^ahc-backend:" | awk -F: '{print $2}' | sort -V | tail -n 1)

if [ -z "$current_version" ]; then
  current_version="1.2.2"
fi

version=$(increment_version "$current_version")

echo "Using next version: $version"

echo "Building Docker image ahc-backend:${version}..."
docker build -t ahc-backend:"${version}" .

echo "Stopping and removing old container (if exists)..."
if docker ps -a --format '{{.Names}}' | grep -q "^ahc-backend$"; then
  docker stop ahc-backend
  docker rm ahc-backend
fi

echo "Removing old Docker image ahc-backend:${current_version} (if exists)..."
if docker images -q "ahc-backend:${current_version}" > /dev/null; then
  docker rmi "ahc-backend:${current_version}" || echo "Old image may be in use, skipping removal"
fi

echo "Running new container..."
docker run -d --name ahc-backend -p 8000:8000 --env-file .env ahc-backend:"${version}"

sleep 5

if ! docker ps --format '{{.Names}}' | grep -q "^ahc-backend$"; then
  echo "Container failed to start. Last log line:"
  docker logs ahc-backend --tail 1
  exit 1
fi

echo "Saving Docker image to tar file..."
docker save -o "ahc-backend-${version}.tar" ahc-backend:"${version}"

echo "Copying tar file to remote server..."
scp "ahc-backend-${version}.tar" oracle:~/projects

echo "Deploying new Docker image and container on remote server..."
ssh oracle bash -s << EOF
  set -e
  set -o pipefail

  cd ~/projects

  echo "Loading Docker image ahc-backend:${version} from tar..."
  docker load -i "ahc-backend-\${version}.tar"

  echo "Running Alembic migrations on remote..."
  docker run --rm --env-file ahc.env -e PYTHONPATH=/app -w /app ahc-backend:"\${version}" \
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
  if docker ps -a --format '{{.Names}}' | grep -q '^ahc-backend\$'; then
    docker stop ahc-backend
    docker rm ahc-backend
  fi

  echo "Removing old Docker image with previous version if exists..."
  if [ -n "\$(docker images -q "ahc-backend:\${current_version}")" ]; then
    docker rmi "ahc-backend:\${current_version}" || echo "Old image may be in use, skipping removal"
  fi

  echo "Running new container with version \${version}..."
  docker run -d --name ahc-backend -p 8000:8000 --env-file ahc.env ahc-backend:"\${version}"

  echo "Remote deployment done."
EOF

echo "Done."