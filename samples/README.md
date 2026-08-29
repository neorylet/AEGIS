# Samples

This directory contains sample data for testing and development.

## Structure

- **pcaps/**: Sample packet capture files
- **events/**: Sample security events
- **alerts/**: Sample security alerts
- **test-data/**: General test data

## PCAP Files

### Network Traffic Samples

- `normal_traffic.pcap`: Normal network traffic
- `attack_traffic.pcap`: Traffic with attack patterns
- `malware_traffic.pcap`: Malware communication traffic

### Using PCAP Files

```bash
# Analyze with Wireshark
wireshark pcaps/normal_traffic.pcap

# Analyze with tcpdump
tcpdump -r pcaps/normal_traffic.pcap

# Load into AEGIS
cargo run -- --pcap pcaps/normal_traffic.pcap
```

## Event Samples

### JSON Event Files

- `network_events.json`: Network connection events
- `dns_events.json`: DNS query events
- `authentication_events.json`: Authentication events

### Using Event Samples

```bash
# Load events into database
cargo run -- --load-events events/network_events.json

# Analyze events
cargo run -- --analyze-events events/network_events.json
```

## Alert Samples

### Alert Files

- `malware_alerts.json`: Malware detection alerts
- `brute_force_alerts.json`: Brute force alerts
- `data_exfiltration_alerts.json`: Data exfiltration alerts

### Using Alert Samples

```bash
# Load alerts for testing
cargo run -- --load-alerts alerts/malware_alerts.json

# Test alert correlation
cargo run -- --correlate-alerts alerts/
```

## Test Data

### Synthetic Data

- `devices.csv`: Sample device inventory
- `users.csv`: Sample user data
- `network_topology.json`: Sample network topology

### Generating Test Data

```bash
# Generate synthetic events
python scripts/generate_events.py --count 1000 --output events/test_events.json

# Generate synthetic traffic
python scripts/generate_traffic.py --duration 3600 --output pcaps/test_traffic.pcap
```

## Data Privacy

- Sample data should not contain real sensitive information
- Anonymize IP addresses and hostnames
- Use synthetic data for testing
- Never commit real production data

## Adding Samples

1. Create sample file in appropriate directory
2. Document source and purpose
3. Ensure no sensitive data
4. Update this README
5. Test with AEGIS
