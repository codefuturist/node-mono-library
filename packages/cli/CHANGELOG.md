# @repo/cli

## 0.2.0

### Minor Changes

- c32b7b2: Add binary distribution and multi-platform release support

  ## New Features
  - **Binary Distribution**: Standalone binaries for Linux, macOS, and Windows (x64 + ARM64)
  - **Universal Installer**: `curl -fsSL .../install.sh | bash` for quick installation
  - **Package Manager Support**: Homebrew, Chocolatey, and Snap packages
  - **GitHub Releases**: Automated releases with checksums and changelogs

  ## Installation Methods

  ```bash
  # Quick install (Unix)
  curl -fsSL https://raw.githubusercontent.com/codefuturist/node-mono-library/main/scripts/install.sh | bash

  # Homebrew
  brew tap codefuturist/tap && brew install repo-cli

  # Chocolatey (Windows)
  choco install repo-cli

  # npm
  npm install -g @repo/cli
  ```

  ## Commands Added
  - `pnpm cli:bundle` - Bundle CLI into single file
  - `pnpm cli:install:local` - Install to ~/.local/bin
