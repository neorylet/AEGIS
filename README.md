# AEGIS


Active Defense & Granular Intelligence System

AEGIS is a comprehensive network security monitoring and threat detection system designed for enterprise environments. It provides real-time network traffic analysis, behavioral anomaly detection, and automated incident response capabilities.

## Features

- **Real-time Network Monitoring**: Capture and analyze network traffic with high-performance packet processing
- **Behavioral Anomaly Detection**: ML-powered detection of unusual network behavior patterns
- **Threat Intelligence Integration**: Automated enrichment with VirusTotal, AbuseIPDB, MISP, and more
- **Incident Response Playbooks**: Automated response workflows for common threat scenarios
- **Risk Scoring**: Comprehensive risk assessment based on threat intelligence and asset criticality
- **Attack Chain Visualization**: MITRE ATT&CK framework integration for threat tracking
- **Device Discovery**: Automated network device discovery and fingerprinting
- **Forensic Evidence Collection**: Comprehensive evidence gathering for incident investigation

## Architecture

AEGIS is built with a modern, microservices-oriented architecture:

- **Backend**: Rust-based Tauri application for high-performance network processing
- **Frontend**: React-based web interface for visualization and management
- **Database**: SQLite with migration support for local deployments
- **ML Pipeline**: Python-based machine learning for anomaly detection

## Quick Start

### Prerequisites

- Rust 1.70 or higher
- Node.js 18 or higher
- Python 3.10 or higher (for ML components)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/AEGIS.git
cd AEGIS

# Install backend dependencies
cd src-tauri
cargo install

# Install frontend dependencies
cd ../frontend
npm install

# Run the application
npm run tauri dev
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Architecture Overview](docs/architecture/overview.md)
- [Development Setup](docs/development/setup.md)
- [API Documentation](docs/api/README.md)
- [Security Considerations](docs/security/threat-model.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security vulnerabilities, please email security@aegis-project.org rather than using the issue tracker.
