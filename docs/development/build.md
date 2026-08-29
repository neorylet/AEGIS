# Build Instructions

**STATUS**: RECONCILED - Build instructions for local development

This document provides detailed instructions for building the AEGIS system.

**Note**: This document describes development builds. Production deployment builds are TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending deployment decisions.

---

## Build Overview

AEGIS consists of multiple components that need to be built:

1. **Backend**: Rust/Tauri application (ACCEPTED)
2. **Frontend**: React application (ACCEPTED)
3. **ML Components**: Python models (STATUS: TBD - ML not yet approved)

## Prerequisites

Ensure you have completed the [Development Setup](setup.md).

## Building the Backend

### Development Build

```bash
cd src-tauri
cargo build
```

### Release Build

```bash
cd src-tauri
cargo build --release
```

The release build will be optimized and placed in `target/release/`.

### Build Options

```bash
# Build with specific features
cargo build --features "feature1,feature2"

# Build for different targets
cargo build --target x86_64-unknown-linux-gnu
cargo build --target x86_64-pc-windows-msvc
cargo build --target x86_64-apple-darwin

# Build with verbose output
cargo build --verbose
```

## Building the Frontend

### Development Build

```bash
cd frontend
npm run build
```

### Production Build

```bash
cd frontend
npm run build:prod
```

The production build will be optimized and placed in `frontend/dist/`.

### Build Options

```bash
# Analyze bundle size
npm run build:analyze

# Build with specific environment
npm run build -- --mode production
```

## Building the Complete Application

### Using Tauri CLI

```bash
# Development build
npm run tauri build

# Release build
npm run tauri build --release
```

This will:
1. Build the frontend
2. Bundle the frontend with the backend
3. Create platform-specific installers

### Build Artifacts

After building, you'll find:

**Windows**
- `src-tauri/target/release/bundle/msi/` - MSI installer
- `src-tauri/target/release/bundle/nsis/` - NSIS installer
- `src-tauri/target/release/aegis.exe` - Executable

**macOS**
- `src-tauri/target/release/bundle/dmg/` - DMG installer
- `src-tauri/target/release/bundle/macos/` - App bundle

**Linux**
- `src-tauri/target/release/bundle/appimage/` - AppImage
- `src-tauri/target/release/bundle/deb/` - DEB package
- `src-tauri/target/release/aegis` - Executable

## Building ML Components

**STATUS**: TBD - ML components not yet approved

### Training Models

```bash
cd ml
source venv/bin/activate  # On Windows: venv\Scripts\activate
python train.py --model-type anomaly --data-path data/
```

**Note**: Specific ML models to train are TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending ML decisions.

### Exporting Models

```bash
python export_model.py --model-path models/anomaly.pkl --output-path src-tauri/src/ml/models/
```

## Docker Build

**STATUS**: TBD - Docker deployment not yet approved

### Build Docker Image

```bash
docker build -t aegis:latest .
```

**Note**: Docker deployment is TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending deployment decisions.

### Build with BuildKit

```bash
DOCKER_BUILDKIT=1 docker build -t aegis:latest .
```

### Multi-Platform Build

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t aegis:latest .
```

## Cross-Compilation

**STATUS**: TBD - OS support not yet determined

### Cross-Compile Rust

```bash
# Install cross-compilation tools
rustup target add x86_64-unknown-linux-musl
rustup target add x86_64-pc-windows-msvc
rustup target add x86_64-apple-darwin

# Cross-compile
cargo build --target x86_64-unknown-linux-musl --release
```

**Note**: Target platforms are TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending OS support decisions.

### Cross-Compile Tauri

Tauri cross-compilation requires additional setup. See the [Tauri documentation](https://tauri.app/v1/guides/building/cross-compilation).

## Build Optimization

### Rust Optimization

**Profile-Guided Optimization (PGO)**
```bash
# Build with profiling
cargo build --release

# Run profiling
cargo run --release --bin aegis

# Build with PGO
cargo build --release --profile pgo
```

**Link-Time Optimization (LTO)**
```bash
# Enable LTO in Cargo.toml
[profile.release]
lto = true
```

### Frontend Optimization

**Code Splitting**
```javascript
// Configure in vite.config.js
build: {
    rollupOptions: {
        output: {
            manualChunks: {
                vendor: ['react', 'react-dom'],
            }
        }
    }
}
```

**Tree Shaking**
```javascript
// Already enabled in production build
npm run build:prod
```

## Build Troubleshooting

### Rust Build Errors

**Out of Memory**
```bash
# Limit parallel jobs
cargo build --jobs 2
```

**Linker Errors**
```bash
# Use system linker
cargo build --release -Z linker=lld
```

### Frontend Build Errors

**Memory Issues**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tauri Build Errors

**WebView Issues**
```bash
# Ensure WebView2 is installed on Windows
# Or use system WebView on Linux
```

**Certificate Issues**
```bash
# Disable code signing for development
# In src-tauri/tauri.conf.json
"tauri": {
    "bundle": {
        "windows": {
            "webviewInstallMode": {
                "type": "embedBootstrapper"
            }
        }
    }
}
```

## CI/CD Integration

**STATUS**: TBD - CI/CD not yet established

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: npm run tauri build
```

**Note**: CI/CD configuration is TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending deployment decisions.

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build

build:
  stage: build
  script:
    - rustc --version
    - node --version
    - cd frontend && npm install
    - npm run tauri build
  artifacts:
    paths:
      - src-tauri/target/release/bundle/
```

## Build Verification

### Smoke Tests

After building, run smoke tests:

```bash
# Test executable
./src-tauri/target/release/aegis --version

# Test installer
# Install and run basic functionality tests
```

### Integration Tests

```bash
# Run integration tests
cargo test --release --test '*'
```

## Build Performance

### Build Times

Typical build times (on modern hardware):

- **Backend (Debug)**: 2-5 minutes
- **Backend (Release)**: 5-15 minutes
- **Frontend (Dev)**: 30-60 seconds
- **Frontend (Prod)**: 1-3 minutes
- **Complete Application**: 10-20 minutes

### Caching

Use cargo caching to speed up builds:

```bash
# Use sccache for distributed caching
cargo install sccache
export RUSTC_WRAPPER=sccache
```

## Release Process

### Version Bumping

1. Update version in `Cargo.toml`
2. Update version in `package.json`
3. Update CHANGELOG.md
4. Commit changes

### Tagging

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Publishing

```bash
# Build release
npm run tauri build --release

# Upload artifacts to release
gh release create v1.0.0 src-tauri/target/release/bundle/
```

## Additional Resources

- [Rust Build Documentation](https://doc.rust-lang.org/cargo/guide/building.html)
- [Tauri Build Documentation](https://tauri.app/v1/guides/building/)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Docker Build Documentation](https://docs.docker.com/engine/reference/builder/)
