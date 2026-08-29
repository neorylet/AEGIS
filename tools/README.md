# Tools

This directory contains utility tools for AEGIS development and testing.

## Structure

- **packet-generator/**: Network packet generation tool
- **traffic-simulator/**: Network traffic simulation tool
- **dataset-tools/**: Dataset management tools

## Packet Generator

### Overview

Generate custom network packets for testing.

### Usage

```bash
cd tools/packet-generator
cargo run -- --help
```

### Examples

```bash
# Generate ICMP packets
cargo run -- --protocol icmp --count 100 --output test.pcap

# Generate TCP packets
cargo run -- --protocol tcp --source 192.168.1.1 --destination 10.0.0.1 --port 443

# Generate attack traffic
cargo run -- --attack-type syn-flood --target 10.0.0.1 --duration 60
```

## Traffic Simulator

### Overview

Simulate realistic network traffic patterns.

### Usage

```bash
cd tools/traffic-simulator
cargo run -- --help
```

### Examples

```bash
# Simulate normal traffic
cargo run -- --profile normal --duration 3600 --output traffic.pcap

# Simulate attack traffic
cargo run -- --profile attack --attack-type data-exfiltration --duration 300

# Simulate specific user behavior
cargo run -- --user-profile user1 --duration 86400
```

## Dataset Tools

### Overview

Manage and process datasets for ML training.

### Usage

```bash
cd tools/dataset-tools
python main.py --help
```

### Examples

```bash
# Process raw dataset
python main.py --process --input raw_data.csv --output processed_data.csv

# Split dataset
python main.py --split --input data.csv --train 0.8 --test 0.2 --val 0.0

# Generate features
python main.py --features --input data.csv --output features.csv
```

## Building Tools

### Build All Tools

```bash
cd tools
cargo build --release
```

### Build Specific Tool

```bash
cd tools/packet-generator
cargo build --release
```

## Using Tools

### Integration with AEGIS

```bash
# Generate test traffic
cd tools/packet-generator
cargo run -- --protocol tcp --count 1000 --output test.pcap

# Load into AEGIS
cd ../../
cargo run -- --pcap tools/packet-generator/test.pcap
```

## Adding New Tools

1. Create directory in `tools/`
2. Implement tool functionality
3. Add documentation
4. Add to this README
5. Test thoroughly

## Tool Dependencies

### Rust Tools

- Add dependencies to `Cargo.toml`
- Use common libraries (pnet, etherparse, etc.)

### Python Tools

- Add dependencies to `requirements.txt`
- Use common libraries (scapy, pandas, etc.)
