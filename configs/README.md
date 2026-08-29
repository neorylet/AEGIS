# Configurations

This directory contains configuration files for different environments.

## Structure

- **development/**: Development environment configurations
- **testing/**: Testing environment configurations
- **production/**: Production environment configurations

## Configuration Files

### Development

- `config.yaml`: Main development configuration
- `database.yaml`: Database configuration
- `logging.yaml`: Logging configuration

### Testing

- `config.yaml`: Testing configuration
- `database.yaml`: Test database configuration
- `mock-services.yaml`: Mock service configurations

### Production

- `config.yaml`: Production configuration
- `database.yaml`: Production database configuration
- `security.yaml`: Security settings
- `performance.yaml`: Performance tuning

## Using Configurations

### Load Configuration

```rust
use config::{Config, File};

let settings = Config::builder()
    .add_source(File::with_name("configs/development/config"))
    .build()?;
```

### Environment Variables

Override configuration with environment variables:
```bash
export AEGIS_DATABASE_URL=postgresql://...
export AEGIS_LOG_LEVEL=debug
```

## Configuration Schema

### Network Configuration

```yaml
network:
  interface: eth0
  promiscuous_mode: false
  buffer_size: 65536
```

### Detection Configuration

```yaml
detection:
  enable_ml: true
  enable_signatures: true
  enable_behavioral: true
  anomaly_threshold: 0.7
```

### Storage Configuration

```yaml
storage:
  database_path: aegis.db
  retention_days: 90
  max_size_gb: 100
```

## Security Notes

- Never commit production secrets
- Use environment variables for sensitive data
- Use secret management for production
- Encrypt sensitive configuration values
