# Scripts

This directory contains utility scripts for development, testing, and deployment.

## Structure

- **setup/**: System setup scripts
- **development/**: Development helper scripts
- **testing/**: Test automation scripts
- **deployment/**: Deployment scripts

## Setup Scripts

### Linux/macOS

```bash
# Install dependencies
./setup/install-dependencies.sh

# Initialize database
./setup/init-database.sh

# Configure environment
./setup/configure.sh
```

### Windows

```powershell
# Install dependencies
.\setup\install-dependencies.ps1

# Initialize database
.\setup\init-database.ps1

# Configure environment
.\setup\configure.ps1
```

## Development Scripts

### Build Scripts

```bash
# Quick build
./development/build.sh

# Full build
./development/build-full.sh

# Clean build
./development/clean-build.sh
```

### Development Server

```bash
# Start development server
./development/dev-server.sh

# Start with hot reload
./development/dev-server-hot.sh
```

## Testing Scripts

### Run All Tests

```bash
# Run all tests
./testing/run-all-tests.sh

# Run with coverage
./testing/run-with-coverage.sh
```

### Specific Tests

```bash
# Unit tests
./testing/run-unit-tests.sh

# Integration tests
./testing/run-integration-tests.sh

# E2E tests
./testing/run-e2e-tests.sh
```

## Deployment Scripts

### Build for Production

```bash
# Build release
./deployment/build-release.sh

# Build Docker image
./deployment/build-docker.sh
```

### Deploy

```bash
# Deploy to server
./deployment/deploy.sh

# Deploy with Docker
./deployment/deploy-docker.sh
```

## Utility Scripts

### Database Management

```bash
# Backup database
./scripts/backup-database.sh

# Restore database
./scripts/restore-database.sh

# Migrate database
./scripts/migrate-database.sh
```

### Log Management

```bash
# Rotate logs
./scripts/rotate-logs.sh

# Archive logs
./scripts/archive-logs.sh
```

## Script Permissions

Make scripts executable on Linux/macOS:
```bash
chmod +x scripts/**/*.sh
```

## Adding Scripts

1. Create script in appropriate directory
2. Make executable (Linux/macOS)
3. Add documentation header
4. Test script thoroughly
5. Update this README
