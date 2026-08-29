# Development Setup

**STATUS**: RECONCILED - Development setup instructions for local development

This document provides instructions for setting up a development environment for AEGIS.

**Note**: This document describes development setup. Production deployment requirements are TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending deployment decisions.

---

## Prerequisites

### System Requirements

**STATUS**: Development requirements for local development

- **Operating System**: Windows 10+, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 20GB free space
- **CPU**: 4 cores minimum, 8 cores recommended

**Note**: Production system requirements are TBD.

### Software Requirements

#### Required

- **Rust**: 1.70 or higher
- **Node.js**: 18 or higher
- **Python**: 3.10 or higher (for ML components)
- **Git**: Latest stable version

#### Optional (but recommended)

- **Docker**: Latest version (STATUS: TBD for production)
- **Docker Compose**: Latest version (STATUS: TBD for production)
- **PostgreSQL**: 14+ (STATUS: TBD - production database not yet selected)
- **Redis**: Latest version (STATUS: TBD - caching not yet approved)

## Installation

### Install Rust

#### Windows
```powershell
# Download and run rustup-init.exe from https://rustup.rs/
# Or use winget
winget install Rustlang.Rustup
```

#### macOS
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Linux
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Install Node.js

#### Windows
```powershell
# Download from https://nodejs.org/
# Or use winget
winget install OpenJS.NodeJS
```

#### macOS
```bash
brew install node
```

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install Python

#### Windows
```powershell
# Download from https://python.org/
# Or use winget
winget install Python.Python.3.10
```

#### macOS
```bash
brew install python@3.10
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3.10 python3-pip
```

### Install Additional Dependencies

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libpcap-dev \
    sqlite3 \
    libsqlite3-dev
```

#### macOS
```bash
brew install openssl libpcap sqlite3
```

#### Windows
```powershell
# Install Visual Studio Build Tools
# Download from https://visualstudio.microsoft.com/downloads/
# Or use winget
winget install Microsoft.VisualStudio.2022.BuildTools
```

## Clone Repository

```bash
git clone https://github.com/your-org/AEGIS.git
cd AEGIS
```

## Backend Setup (Rust/Tauri)

### Install Rust Dependencies

```bash
cd src-tauri
cargo install
```

### Install Tauri CLI

```bash
cargo install tauri-cli
```

### Configure Environment

Create `.env` file in `src-tauri/`:

```env
# Database
DATABASE_URL=sqlite:aegis.db

# API Keys (STATUS: OPTIONAL - not mandatory per canonical spec)
# External threat intelligence providers are NOT mandatory
# Only configure if approved for your deployment
VIRUSTOTAL_API_KEY=your_api_key_here
ABUSEIPDB_API_KEY=your_api_key_here
MISP_URL=https://your-misp-instance.com
MISP_API_KEY=your_api_key_here

# Notification Webhooks (optional)
SLACK_WEBHOOK=https://hooks.slack.com/services/...
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
```

## Frontend Setup (React)

### Install Node Dependencies

```bash
cd frontend
npm install
```

### Configure Environment

Create `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## ML Setup (Python)

### Create Virtual Environment

```bash
cd ml
python3.10 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Create requirements.txt

**STATUS**: ML dependencies not yet approved - these are for development only

```text
numpy>=1.21.0
pandas>=1.3.0
scikit-learn>=1.0.0
# tensorflow>=2.8.0  # STATUS: TBD - deep learning not currently approved
# torch>=1.11.0  # STATUS: TBD - deep learning not currently approved
jupyter>=1.0.0
matplotlib>=3.5.0
seaborn>=0.11.0
```

## Database Setup

### SQLite (Default)

SQLite is used by default and requires no additional setup.

### PostgreSQL (Optional)

**STATUS**: TBD - production database technology not yet selected

PostgreSQL is optional for development. Production database selection is TBD. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending database decisions.

## Development Tools

### Install VS Code Extensions

- **Rust Analyzer**: Rust language support
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **GitLens**: Git integration
- **Docker**: Docker support
- **Python**: Python support

### Install Git Hooks (Optional)

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

## Running the Application

### Development Mode

```bash
# From project root
npm run tauri dev
```

This will:
- Start the Tauri backend
- Start the React frontend
- Enable hot reloading

### Backend Only

```bash
cd src-tauri
cargo run
```

### Frontend Only

```bash
cd frontend
npm run dev
```

## Testing

### Run Rust Tests

```bash
cd src-tauri
cargo test
```

### Run JavaScript Tests

```bash
cd frontend
npm test
```

### Run All Tests

```bash
npm run test
```

## Building

### Build for Development

```bash
npm run tauri build
```

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Build Tauri application
cd ../src-tauri
cargo build --release
```

## Troubleshooting

### Rust Issues

**Rust not found**
```bash
# Ensure Rust is in PATH
source $HOME/.cargo/env  # Linux/macOS
# Or restart your terminal
```

**Build errors**
```bash
# Clean and rebuild
cargo clean
cargo build
```

### Node.js Issues

**Module not found**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues

**Packet capture requires admin privileges**
```bash
# Linux/macOS: Use sudo
sudo npm run tauri dev

# Windows: Run as Administrator
```

### Database Issues

**Database locked**
```bash
# Stop all running instances
# Delete lock file if needed
rm aegis.db-shm aegis.db-wal
```

## IDE Configuration

### VS Code

Create `.vscode/settings.json`:

```json
{
    "rust-analyzer.cargo.features": "all",
    "rust-analyzer.checkOnSave.command": "clippy",
    "editor.formatOnSave": true,
    "eslint.autoFixOnSave": true,
    "typescript.tsdk": "frontend/node_modules/typescript/lib"
}
```

### JetBrains CLion/IntelliJ

Install Rust plugin and configure:
- Rust toolchain location
- Cargo location
- Project structure

## Next Steps

1. Review the [Architecture Documentation](../architecture/overview.md)
2. Read the [Design Documentation](../design/event-model.md)
3. Explore the [Code Structure](../architecture/components.md)
4. Start with [Hello World](../development/build.md)

## Additional Resources

- [Rust Documentation](https://doc.rust-lang.org/)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
