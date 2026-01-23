#!/bin/bash
# repo-cli installer
# Usage: curl -fsSL https://raw.githubusercontent.com/codefuturist/node-mono-library/main/scripts/install.sh | bash

set -euo pipefail

# Configuration
REPO="codefuturist/node-mono-library"
CLI_NAME="repo-cli"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS="linux" ;;
        Darwin*)    OS="macos" ;;
        CYGWIN*|MINGW*|MSYS*) OS="win" ;;
        *)          error "Unsupported operating system: $(uname -s)" ;;
    esac
}

# Detect architecture
detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64)   ARCH="x64" ;;
        arm64|aarch64)  ARCH="arm64" ;;
        *)              error "Unsupported architecture: $(uname -m)" ;;
    esac
}

# Get latest version from GitHub
get_latest_version() {
    info "Fetching latest version..."
    
    # Get tags matching @repo/cli@*
    LATEST=$(curl -fsSL "https://api.github.com/repos/${REPO}/tags" | \
        grep -o '"name": "@repo/cli@[^"]*"' | \
        head -1 | \
        sed 's/.*@repo\/cli@\([^"]*\).*/\1/')
    
    if [ -z "$LATEST" ]; then
        error "Could not determine latest version"
    fi
    
    VERSION="$LATEST"
    info "Latest version: $VERSION"
}

# Download binary
download_binary() {
    local target="${OS}-${ARCH}"
    local extension=""
    [ "$OS" = "win" ] && extension=".exe"
    
    local binary_name="${CLI_NAME}-${target}${extension}"
    local download_url="https://github.com/${REPO}/releases/download/@repo%2Fcli@${VERSION}/${binary_name}"
    
    info "Downloading ${CLI_NAME} v${VERSION} for ${target}..."
    
    # Create temp directory
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT
    
    # Download binary
    if ! curl -fsSL "$download_url" -o "$TMP_DIR/$binary_name"; then
        error "Failed to download binary from: $download_url"
    fi
    
    # Download checksums
    local checksum_url="https://github.com/${REPO}/releases/download/@repo%2Fcli@${VERSION}/checksums-sha256.txt"
    if curl -fsSL "$checksum_url" -o "$TMP_DIR/checksums-sha256.txt" 2>/dev/null; then
        info "Verifying checksum..."
        cd "$TMP_DIR"
        if command -v sha256sum &> /dev/null; then
            sha256sum -c checksums-sha256.txt --ignore-missing
        elif command -v shasum &> /dev/null; then
            shasum -a 256 -c checksums-sha256.txt --ignore-missing
        else
            warn "Could not verify checksum (sha256sum/shasum not found)"
        fi
        cd - > /dev/null
    fi
    
    BINARY_PATH="$TMP_DIR/$binary_name"
}

# Install binary
install_binary() {
    info "Installing to ${INSTALL_DIR}..."
    
    # Create install directory
    mkdir -p "$INSTALL_DIR"
    
    # Copy binary
    local dest="${INSTALL_DIR}/${CLI_NAME}"
    [ "$OS" = "win" ] && dest="${dest}.exe"
    
    cp "$BINARY_PATH" "$dest"
    chmod +x "$dest"
    
    success "Installed ${CLI_NAME} to ${dest}"
}

# Check PATH
check_path() {
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        warn "${INSTALL_DIR} is not in your PATH"
        echo ""
        echo "Add it to your shell profile:"
        echo ""
        
        case "$SHELL" in
            */zsh)
                echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.zshrc"
                echo "  source ~/.zshrc"
                ;;
            */bash)
                echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc"
                echo "  source ~/.bashrc"
                ;;
            */fish)
                echo "  fish_add_path ~/.local/bin"
                ;;
            *)
                echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
                ;;
        esac
        echo ""
    fi
}

# Verify installation
verify_install() {
    local bin_path="${INSTALL_DIR}/${CLI_NAME}"
    [ "$OS" = "win" ] && bin_path="${bin_path}.exe"
    
    if [ -x "$bin_path" ]; then
        local installed_version
        installed_version=$("$bin_path" --version 2>/dev/null || echo "unknown")
        success "Installation complete! Version: ${installed_version}"
        echo ""
        echo "Run '${CLI_NAME} --help' to get started."
    else
        error "Installation verification failed"
    fi
}

# Main
main() {
    echo ""
    echo "╭─────────────────────────────────────╮"
    echo "│     ${CLI_NAME} installer           │"
    echo "╰─────────────────────────────────────╯"
    echo ""
    
    detect_os
    detect_arch
    get_latest_version
    download_binary
    install_binary
    check_path
    verify_install
}

main "$@"
