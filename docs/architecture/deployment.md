# Deployment Guide

This document describes deployment strategies and configurations for AEGIS.

## Prerequisites

### System Requirements

**STATUS**: TO BE DETERMINED

System requirements have not yet been finalized. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending deployment decisions.

### Software Dependencies

- Rust 1.70+
- Node.js 18+
- Python 3.10+ (for ML components, if used)
- libpcap (Linux/macOS) or WinPcap (Windows) (STATUS: TBD - capture technology not selected)

## Deployment Modes

**STATUS**: TO BE DETERMINED

Deployment model has not yet been finalized. See [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md) for pending decisions.

### Development Mode

For local development and testing:

```bash
# Clone repository
git clone https://github.com/your-org/AEGIS.git
cd AEGIS

# Install backend dependencies
cd src-tauri
cargo install

# Install frontend dependencies
cd ../frontend
npm install

# Run in development mode
npm run tauri dev
```

### Production Mode

**STATUS**: TBD - Production deployment strategy not yet determined

## Configuration

### Network Configuration

Configure network interfaces and capture settings:

```toml
[network]
interface = "eth0"
promiscuous = true
buffer_size = 65536
```

### Database Configuration

Configure database settings:

```toml
[database]
path = "/data/aegis.db"
retention_days = 90
max_size_gb = 100
```

### Integration Configuration

Configure external integrations:

```toml
[integrations.virustotal]
api_key = "your-api-key"

[integrations.slack]
webhook_url = "https://hooks.slack.com/services/..."
```

## Monitoring

### Health Checks

Monitor system health:

```bash
# Check service status
systemctl status aegis

# Check logs
journalctl -u aegis -f
```

### Metrics

AEGIS exposes metrics for monitoring:

- Packet capture rate
- Event processing rate
- Detection latency
- Resource utilization

## Scaling

**STATUS**: TO BE DETERMINED

Scalability requirements have not yet been finalized. See [OPEN_QUESTIONS.md](../OPEN_QUESTIONS.md) for pending scalability decisions.

### Horizontal Scaling

**STATUS**: TBD - horizontal scaling not yet determined

### Vertical Scaling

Increase resources for single instance:

- Increase CPU cores
- Add more RAM
- Use faster storage (NVMe SSD)

## Backup and Recovery

### Database Backup

```bash
# Backup database
cp /data/aegis.db /backup/aegis.db.$(date +%Y%m%d)

# Automated backup
0 2 * * * cp /data/aegis.db /backup/aegis.db.$(date +\%Y\%m\%d)
```

### Configuration Backup

```bash
# Backup configuration
tar -czf /backup/config-$(date +%Y%m%d).tar.gz /opt/aegis/config/
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure proper permissions for network capture
2. **High CPU Usage**: Reduce buffer size or disable ML features
3. **Disk Full**: Implement data retention policies
4. **Memory Leaks**: Restart service and monitor resources

### Log Analysis

Check logs for issues:

```bash
# View recent logs
tail -f /var/log/aegis/aegis.log

# Search for errors
grep ERROR /var/log/aegis/aegis.log
```
