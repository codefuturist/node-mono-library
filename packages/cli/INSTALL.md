# Installing repo-cli

Multiple installation methods are available depending on your platform and preferences.

## Quick Install (Recommended)

### Unix (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/codefuturist/node-mono-library/main/scripts/install.sh | bash
```

This will:
1. Detect your OS and architecture
2. Download the latest binary
3. Verify the checksum
4. Install to `~/.local/bin`

### Windows (PowerShell)

```powershell
# Using Chocolatey
choco install repo-cli

# Or download manually from GitHub Releases
```

---

## Package Managers

### Homebrew (macOS / Linux)

```bash
# Add tap (first time only)
brew tap codefuturist/tap

# Install
brew install repo-cli

# Upgrade
brew upgrade repo-cli
```

### Chocolatey (Windows)

```powershell
# Install
choco install repo-cli

# Upgrade
choco upgrade repo-cli
```

### Snap (Linux)

```bash
# Install
sudo snap install repo-cli

# Upgrade
sudo snap refresh repo-cli
```

### npm (requires Node.js)

```bash
# Global install
npm install -g @repo/cli

# Or use npx (no install)
npx @repo/cli --help
```

---

## Manual Installation

### Download Binary

1. Go to [GitHub Releases](https://github.com/codefuturist/node-mono-library/releases)
2. Download the binary for your platform:
   - `repo-cli-linux-x64` - Linux (x86_64)
   - `repo-cli-linux-arm64` - Linux (ARM64)
   - `repo-cli-macos-x64` - macOS (Intel)
   - `repo-cli-macos-arm64` - macOS (Apple Silicon)
   - `repo-cli-win-x64.exe` - Windows

3. Verify the checksum (optional but recommended):
   ```bash
   # Download checksums
   curl -fsSL https://github.com/codefuturist/node-mono-library/releases/latest/download/checksums-sha256.txt
   
   # Verify (Linux/macOS)
   sha256sum -c checksums-sha256.txt --ignore-missing
   ```

4. Make executable and move to PATH:
   ```bash
   chmod +x repo-cli-*
   sudo mv repo-cli-* /usr/local/bin/repo-cli
   ```

### Build from Source

```bash
# Clone repository
git clone https://github.com/codefuturist/node-mono-library.git
cd node-mono-library

# Install dependencies
pnpm install

# Build CLI
pnpm build --filter=@repo/cli

# Link globally
cd packages/cli
pnpm link --global

# Or install to ~/.local/bin
pnpm install:local
```

---

## Verify Installation

```bash
repo-cli --version
repo-cli --help
```

---

## Uninstall

### Homebrew
```bash
brew uninstall repo-cli
brew untap codefuturist/tap
```

### Chocolatey
```powershell
choco uninstall repo-cli
```

### Snap
```bash
sudo snap remove repo-cli
```

### npm
```bash
npm uninstall -g @repo/cli
```

### Manual
```bash
rm ~/.local/bin/repo-cli
# or
sudo rm /usr/local/bin/repo-cli
```

---

## Troubleshooting

### "command not found" after installation

Ensure the install directory is in your PATH:

```bash
# Check current PATH
echo $PATH

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$HOME/.local/bin:$PATH"
```

### Permission denied on macOS

macOS may block unsigned binaries. Allow it in System Preferences → Security & Privacy, or run:

```bash
xattr -d com.apple.quarantine ~/.local/bin/repo-cli
```

### Checksum verification fails

Re-download the binary - the file may be corrupted:

```bash
# Remove and reinstall
rm ~/.local/bin/repo-cli
curl -fsSL https://raw.githubusercontent.com/codefuturist/node-mono-library/main/scripts/install.sh | bash
```

---

## Platform Support

| Platform | Architecture | Status |
|----------|-------------|--------|
| Linux | x64 (AMD/Intel) | ✅ Supported |
| Linux | ARM64 | ✅ Supported |
| macOS | x64 (Intel) | ✅ Supported |
| macOS | ARM64 (Apple Silicon) | ✅ Supported |
| Windows | x64 | ✅ Supported |
| Windows | ARM64 | ⚠️ Use x64 with emulation |

---

## Getting Help

- [Documentation](https://github.com/codefuturist/node-mono-library/tree/main/packages/cli)
- [Issues](https://github.com/codefuturist/node-mono-library/issues)
- [Discussions](https://github.com/codefuturist/node-mono-library/discussions)
