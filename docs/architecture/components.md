# Components

This document provides detailed descriptions of AEGIS components.

## Sensor Component

### Purpose
Capture and analyze network traffic in real-time.

### Sub-components
- **Packet Capture**: Raw packet capture using libpcap
- **Protocol Decoder**: Decode network protocols (Ethernet, IP, TCP, UDP, etc.)
- **Flow Manager**: Track network flows and connections
- **Interface Manager**: Manage network interfaces

### Key Features
- High-performance packet capture
- Support for common network protocols
- Flow-based analysis
- Configurable buffer sizes

## Discovery Component

### Purpose
Discover and fingerprint network devices.

### Sub-components
- **Device Discovery**: Scan network for devices
- **ARP Scanner**: ARP-based device discovery
- **Device Fingerprinter**: Identify device types and OS

### Key Features
- Automated network scanning
- OS fingerprinting
- Device type identification
- Historical tracking

## Events Component

### Purpose
Process and normalize security events.

### Sub-components
- **Event Model**: Define event structure and types
- **Event Normalizer**: Standardize event formats
- **Event Pipeline**: Process events through stages

### Key Features
- Unified event model
- Multi-source event normalization
- Real-time event processing
- Extensible pipeline

## Detection Component

### Purpose
Detect threats using multiple techniques.

### Sub-components
- **Rule Engine**: Rule-based detection
- **Statistical Analyzer**: Statistical anomaly detection
- **Behavioral Detector**: Behavioral analysis
- **Signature Matcher**: Signature-based detection

### Key Features
- Multi-modal detection
- Configurable rules
- Statistical baselines
- Behavioral profiling

## Fingerprint Component

### Purpose
Create and maintain network fingerprints.

### Sub-components
- **Baseline Manager**: Manage network baselines
- **Feature Extractor**: Extract features from traffic
- **Anomaly Detector**: Detect fingerprint anomalies

### Key Features
- Baseline creation
- Feature extraction
- Anomaly detection
- Continuous learning

## Intelligence Component

### Purpose
Integrate external threat intelligence.

### Sub-components
- **Threat Intel Manager**: Manage threat intel sources
- **Reputation Service**: Check IP/domain reputation
- **IOC Manager**: Manage indicators of compromise
- **MITRE Mapper**: Map to MITRE ATT&CK

### Key Features
- Multiple intel sources
- Reputation scoring
- IOC matching
- MITRE ATT&CK integration

## Correlation Component

### Purpose
Correlate events and collect evidence.

### Sub-components
- **Event Correlator**: Correlate related events
- **Evidence Collector**: Collect forensic evidence
- **Correlation Graph**: Build relationship graphs

### Key Features
- Event correlation
- Evidence collection
- Relationship mapping
- Graph visualization

## Incidents Component

### Purpose
Manage security incidents.

### Sub-components
- **Incident Manager**: Create and manage incidents
- **Timeline Builder**: Build incident timelines
- **Severity Calculator**: Calculate incident severity

### Key Features
- Incident lifecycle management
- Timeline visualization
- Severity scoring
- Assignment and tracking

## Risk Component

### Purpose
Assess and score security risks.

### Sub-components
- **Anomaly Score Calculator**: Calculate anomaly scores
- **Threat Score Calculator**: Calculate threat scores
- **Asset Criticality Manager**: Manage asset criticality
- **Risk Assessment Engine**: Overall risk assessment

### Key Features
- Multi-factor risk scoring
- Asset criticality
- Trend analysis
- Risk reporting

## Response Component

### Purpose
Execute automated response actions.

### Sub-components
- **Response Executor**: Execute response actions
- **Firewall Manager**: Manage firewall rules
- **Isolation Manager**: Isolate compromised devices
- **Response Verifier**: Verify response effectiveness
- **Rollback Manager**: Rollback failed responses

### Key Features
- Automated response execution
- Firewall integration
- Device isolation
- Response verification
- Rollback capabilities

## Playbooks Component

### Purpose
Define and execute response playbooks.

### Sub-components
- **Playbook Engine**: Execute playbooks
- **Playbook Definitions**: Define playbook workflows
- **Playbook Actions**: Define individual actions

### Key Features
- Playbook definition language
- Automated execution
- Conditional logic
- Error handling

## ML Component

### Purpose
Machine learning for anomaly detection.

### Sub-components
- **ML Inference Engine**: Run ML models
- **ML Feature Extractor**: Extract ML features
- **ML Models**: Trained model storage
- **Model Version Manager**: Manage model versions

### Key Features
- Model inference
- Feature extraction
- Model versioning
- Performance tracking

## Forecasting Component

### Purpose
Forecast security trends.

### Sub-components
- **Trend Analyzer**: Analyze historical trends
- **Forecast Engine**: Generate forecasts

### Key Features
- Trend analysis
- Seasonality detection
- Time series forecasting
- Confidence intervals

## Hunting Component

### Purpose
Threat hunting capabilities.

### Sub-components
- **Hunting Query Parser**: Parse hunting queries
- **Hunting Query Engine**: Execute hunting queries
- **Hunting Query Validator**: Validate queries

### Key Features
- Query language
- Historical search
- Pattern matching
- Cost estimation

## Integrations Component

### Purpose
Integrate with external services.

### Sub-components
- **VirusTotal**: VirusTotal API integration
- **AbuseIPDB**: AbuseIPDB API integration
- **MISP**: MISP integration
- **Slack**: Slack notification integration
- **Discord**: Discord notification integration

### Key Features
- API integrations
- Alert notifications
- Threat intel enrichment
- Incident reporting
