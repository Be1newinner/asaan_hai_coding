#!/usr/bin/env bash
set -euo pipefail

version="1.2.8"
project_name="ahc-backend"

# Ensure required tools exist
need() { command -v "$1" >/dev/null 2>&1 || return 1; }

echo "Checking prerequisites..."
if ! need gh; then
  echo "GitHub CLI (gh) not found. Installing for Ubuntu..."
  sudo apt update -y
  sudo apt install -y curl ca-certificates gnupg
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
    sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
  sudo apt update -y
  sudo apt install -y gh
  echo "gh installed. Authenticating..."
  gh auth status || gh auth login
fi

if ! need sha256sum; then
  echo "sha256sum not found. Installing coreutils..."
  sudo apt update -y && sudo apt install -y coreutils
fi

tar_gz="${project_name}-${version}.tar.gz"
sha_file="${tar_gz}.sha256"

if [[ ! -f "${tar_gz}" ]]; then
  echo "ERROR: ${tar_gz} not found in current directory."
  echo "Make sure to create it first, e.g.: docker save ${project_name}:${version} | gzip > ${tar_gz}"
  exit 1
fi

echo "IMAGE CHECKSUM:"
sha256sum "${tar_gz}" | tee "${sha_file}"

# Ensure the Git tag/release exists (create if missing)
if ! gh release view "${version}" >/dev/null 2>&1; then
  echo "Release ${version} not found. Creating release..."
  # Ensure tag exists remotely; if not, create and push
  if ! git rev-parse -q --verify "refs/tags/${version}" >/dev/null; then
    git tag "${version}"
    git push origin "${version}"
  fi
  gh release create "${version}" --title "${version}" --generate-notes
fi

echo "Releasing to GitHub..."
# Note: no trailing period after --clobber
gh release upload "${version}" "${tar_gz}" "${sha_file}" --clobber

echo "Release Success!"

# Verify or download assets
# gh release list # Listing releases
# gh release view ${version} --web or gh release view ${version} # Show release info

# gh release download v1.2.6 -p "${project_name}-${version}.tar.gz*" # Scripted download