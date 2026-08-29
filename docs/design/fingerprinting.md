# Fingerprinting Design

This document describes the network fingerprinting approach in AEGIS.

## Overview

Network fingerprinting creates unique identifiers for network entities based on their observable characteristics. These fingerprints enable:

- Baseline establishment
- Anomaly detection
- Device identification
- Behavioral profiling

## Fingerprint Types

### Network Fingerprint
Characteristics of network traffic patterns:
- Protocol distribution
- Port usage patterns
- Temporal patterns
- Bandwidth characteristics

### Device Fingerprint
Characteristics of individual devices:
- MAC address
- IP address
- OS fingerprint
- Open ports
- Running services

### User Fingerprint
Characteristics of user behavior:
- Login patterns
- Access patterns
- Time-of-day patterns
- Location patterns

## Feature Extraction

### Packet Features

```rust
pub struct PacketFeatures {
    pub size: usize,
    pub protocol: String,
    pub flags: Vec<String>,
    pub payload_size: usize,
    pub inter_arrival_time: Duration,
}
```

### Flow Features

```rust
pub struct FlowFeatures {
    pub duration: Duration,
    pub packet_count: usize,
    pub byte_count: u64,
    pub packet_size_variance: f64,
    pub inter_arrival_times: Vec<Duration>,
    pub protocol: String,
}
```

### Temporal Features

```rust
pub struct TemporalFeatures {
    pub frequency: f64,
    pub periodicity: f64,
    pub time_of_day_pattern: Vec<u32>,
    pub day_of_week_pattern: Vec<u32>,
}
```

## Baseline Creation

### Baseline Structure

```rust
pub struct NetworkBaseline {
    pub id: String,
    pub network: String,
    pub created_at: DateTime<Utc>,
    pub device_count: usize,
    pub traffic_patterns: TrafficPattern,
}

pub struct TrafficPattern {
    pub typical_protocols: Vec<String>,
    pub typical_ports: Vec<u16>,
    pub bandwidth_usage: (f64, f64),
    pub connection_frequency: f64,
}
```

### Baseline Creation Process

1. **Data Collection**
   - Collect network traffic over baseline period
   - Typical baseline period: 7-30 days

2. **Feature Extraction**
   - Extract features from collected data
   - Calculate statistical measures

3. **Pattern Identification**
   - Identify typical patterns
   - Establish normal ranges

4. **Baseline Storage**
   - Store baseline in database
   - Version control for tracking changes

## Anomaly Detection

### Anomaly Scoring

```rust
pub struct AnomalyScore {
    pub score: f64,
    pub is_anomalous: bool,
    pub contributing_features: Vec<String>,
}
```

### Detection Methods

#### Statistical Anomaly Detection
- Z-score based detection
- Percentile-based detection
- Moving average deviation

#### ML-based Anomaly Detection
- Isolation Forest
- One-Class SVM
- Autoencoder reconstruction error

#### Behavioral Anomaly Detection
- Profile deviation
- Pattern mismatch
- Sequence anomaly

### Anomaly Thresholds

#### Low Anomaly (0.0 - 0.3)
- Minor deviations from baseline
- May indicate configuration changes
- Informational logging

#### Medium Anomaly (0.3 - 0.7)
- Significant deviations
- Requires investigation
- Alert generation

#### High Anomaly (0.7 - 1.0)
- Major deviations
- Potential security incident
- Immediate attention

## Device Identification

### OS Fingerprinting

Techniques:
- TTL analysis
- Window size analysis
- TCP flag combinations
- HTTP user-agent analysis

### Service Fingerprinting

Techniques:
- Port scanning
- Service banner grabbing
- Protocol analysis
- Version detection

### Device Type Classification

Categories:
- Server
- Workstation
- Network Device
- IoT Device
- Mobile Device

## Behavioral Profiling

### Profile Structure

```rust
pub struct BehavioralProfile {
    pub entity_id: String,
    pub normal_behavior: BehaviorPattern,
    pub last_updated: DateTime<Utc>,
}
```

### Profile Learning

#### Initial Learning
- Cold start period (7-14 days)
- Collect baseline behavior
- Establish initial profile

#### Continuous Learning
- Update profile continuously
- Adapt to legitimate changes
- Detect profile drift

#### Profile Validation
- Validate profile accuracy
- Remove outdated patterns
- Handle concept drift

## Fingerprint Updates

### Update Triggers

- Scheduled updates (daily/weekly)
- Significant network changes
- Manual update requests
- Profile drift detection

### Update Process

1. Collect recent data
2. Extract new features
3. Compare to existing fingerprint
4. Calculate change significance
5. Update if significant change detected

## Performance Considerations

### Computational Requirements

- Feature extraction: CPU intensive
- Baseline calculation: Memory intensive
- Anomaly detection: Real-time requirements

### Optimization Strategies

- Incremental baseline updates
- Cached feature calculations
- Parallel processing
- Sampling for large datasets

## Privacy Considerations

### Data Minimization
- Collect only necessary features
- Anonymize sensitive data
- Aggregate when possible

### Retention Policies
- Retain fingerprints for defined period
- Secure deletion of old fingerprints
- Audit fingerprint access

### User Consent
- Obtain consent for behavioral profiling
- Provide opt-out mechanisms
- Transparent data usage
