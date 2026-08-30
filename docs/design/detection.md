# Detection Design

**STATUS**: RECONCILED - Detection design reflects PLANNED architecture, not current implementation

**IMPORTANT**: This document describes the PLANNED detection engine. No detection logic is currently implemented. See [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md) for actual implementation status.

---

This document describes the detection engine design in AEGIS.

## Detection Overview

AEGIS uses a multi-modal detection approach combining multiple techniques:

1. **Rule-based Detection**: Predefined rules and signatures
2. **Statistical Detection**: Statistical anomaly detection
3. **Behavioral Detection**: Behavioral profiling and analysis
4. **ML-based Detection**: Machine learning models

## Rule-based Detection

### Rule Structure

```rust
pub struct DetectionRule {
    pub id: String,
    pub name: String,
    pub description: String,
    pub conditions: RuleCondition,
    pub severity: EventSeverity,
}
```

### Rule Conditions

#### Simple Condition
```yaml
condition:
  field: "destination_port"
  operator: "equals"
  value: 22
```

#### Compound Condition
```yaml
condition:
  operator: "AND"
  rules:
    - field: "destination_port"
      operator: "in"
      value: [22, 23, 3389]
    - field: "source_geo.country"
      operator: "not_equals"
      value: "US"
```

### Rule Examples

#### SSH Brute Force Detection
```yaml
id: "ssh-brute-force-001"
name: "SSH Brute Force Attempt"
description: "Multiple SSH login failures from same IP"
condition:
  operator: "AND"
  rules:
    - field: "event_type"
      operator: "equals"
      value: "SystemLogin"
    - field: "login_method"
      operator: "equals"
      value: "ssh"
    - field: "success"
      operator: "equals"
      value: false
  time_window: "5 minutes"
  threshold: 10
severity: "High"
```

#### Data Exfiltration Detection
```yaml
id: "data-exfiltration-001"
name: "Potential Data Exfiltration"
description: "Large volume of data to external destination"
condition:
  operator: "AND"
  rules:
    - field: "event_type"
      operator: "equals"
      value: "NetworkConnection"
    - field: "bytes_sent"
      operator: "greater_than"
      value: 104857600  # 100MB
    - field: "destination_geo.country"
      operator: "not_equals"
      value: "US"
severity: "Critical"
```

## Statistical Detection

### Baseline Calculation

```rust
pub struct StatisticalBaseline {
    pub mean: f64,
    pub std_dev: f64,
    pub percentile_95: f64,
    pub percentile_99: f64,
}
```

### Anomaly Detection

Using Z-score for anomaly detection:

```rust
fn z_score(value: f64, baseline: &StatisticalBaseline) -> f64 {
    (value - baseline.mean) / baseline.std_dev
}

fn is_anomaly(z_score: f64, threshold: f64) -> bool {
    z_score.abs() > threshold
}
```

### Statistical Metrics

#### Traffic Volume
- Mean: 1 Mbps
- Std Dev: 0.2 Mbps
- Threshold: 3σ (0.6 Mbps)

#### Connection Count
- Mean: 100 connections/min
- Std Dev: 20 connections/min
- Threshold: 3σ (60 connections/min)

## Behavioral Detection

### Behavioral Profile

```rust
pub struct BehavioralProfile {
    pub entity_id: String,
    pub normal_behavior: BehaviorPattern,
    pub last_updated: DateTime<Utc>,
}

pub struct BehaviorPattern {
    pub typical_connections: Vec<String>,
    pub typical_ports: Vec<u16>,
    pub typical_times: Vec<DateTime<Utc>>,
    pub data_volume_range: (u64, u64),
}
```

### Behavioral Analysis

#### Profile Learning
- Collect historical behavior data
- Identify patterns and baselines
- Update profiles continuously

#### Anomaly Detection
- Compare current behavior to profile
- Calculate deviation scores
- Flag significant deviations

### Behavioral Examples

#### User Behavior
- Typical login times: 9 AM - 6 PM
- Typical locations: Office, Home
- Typical access patterns: Specific applications

#### Device Behavior
- Typical connections: Internal servers, cloud services
- Typical protocols: HTTPS, SSH
- Typical bandwidth: 10-50 Mbps

## ML-based Detection

### Feature Extraction

```rust
pub struct MLFeatureExtractor;

impl MLFeatureExtractor {
    pub fn extract_features(&self, event: &Event) -> Vec<f64> {
        vec![
            // Temporal features
            event.timestamp.hour() as f64 / 24.0,
            event.timestamp.minute() as f64 / 60.0,
            
            // Network features
            self.extract_port_features(event),
            self.extract_protocol_features(event),
            
            // Behavioral features
            self.extract_behavioral_features(event),
        ]
    }
}
```

### Model Types

#### Anomaly Detection
- Isolation Forest
- One-Class SVM
- Autoencoder

#### Classification
- Random Forest
- Gradient Boosting
- Neural Networks

### Model Training

```python
# Training pipeline
features = extract_features(training_data)
model = train_model(features, labels)
evaluate_model(model, test_data)
deploy_model(model)
```

## Detection Pipeline

### 1. Event Ingestion
- Receive normalized events
- Validate event structure

### 2. Rule Evaluation
- Evaluate rule-based detection
- Generate rule matches

### 3. Statistical Analysis
- Compare to statistical baselines
- Calculate anomaly scores

### 4. Behavioral Analysis
- Compare to behavioral profiles
- Calculate behavioral deviations

### 5. ML Inference
- Extract ML features
- Run ML models
- Generate predictions

### 6. Result Aggregation
- Aggregate detection results
- Calculate overall confidence
- Generate alerts

## Alert Generation

### Alert Structure

```rust
pub struct Alert {
    pub id: String,
    pub title: String,
    pub description: String,
    pub severity: EventSeverity,
    pub detection_method: DetectionMethod,
    pub confidence: f64,
    pub related_events: Vec<String>,
    pub iocs: Vec<String>,
    pub mitre_techniques: Vec<String>,
    pub created_at: DateTime<Utc>,
}
```

### Alert Prioritization

Alerts prioritized based on:
- Severity level
- Detection confidence
- Asset criticality
- Threat intelligence

## Performance Considerations

### Throughput
- Target: >10,000 events/second
- Parallel rule evaluation
- Cached statistical baselines

### Latency
- Target: <100ms detection latency
- Optimized data structures
- Minimal feature extraction overhead

### Resource Usage
- Memory: Proportional to rule count and profile count
- CPU: Proportional to event rate and ML model complexity
