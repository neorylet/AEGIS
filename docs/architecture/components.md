# Components

**STATUS**: RECONCILED - Component descriptions reflect PLANNED architecture, not current implementation

**IMPORTANT**: This document describes the PLANNED component architecture. All components currently exist as skeleton code only. No functional capabilities are implemented. See [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md) for actual implementation status.

---

This document provides detailed descriptions of AEGIS components.

## Sensor Component

### Purpose
Capture and analyze network traffic in real-time.

### Implementation Status
**SKELETON** - Module exists with struct definitions only. No actual packet capture implemented.

### Sub-components
- **Packet Capture**: Raw packet capture (STATUS: TBD - capture technology not selected)
- **Protocol Decoder**: Decode network protocols (STATUS: TBD)
- **Flow Manager**: Track network flows and connections (STATUS: TBD)
- **Interface Manager**: Manage network interfaces (STATUS: TBD)

### Key Features
- High-performance packet capture
- Support for common network protocols
- Flow-based analysis
- Configurable buffer sizes

## Discovery Component

### Purpose
Discover and fingerprint network devices.

### Implementation Status
**SKELETON** - Module exists with struct definitions only. No actual discovery implemented.

### Sub-components
- **Device Discovery**: Scan network for devices (STATUS: TBD)
- **ARP Scanner**: ARP-based device discovery (STATUS: TBD)
- **Device Fingerprinter**: Identify device types and OS (STATUS: TBD)

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

### Implementation Status
**SKELETON** - Integration modules exist with TODO comments only. No actual API calls implemented.

**Note**: External threat intelligence providers are NOT mandatory. These are optional integrations.

### Sub-components
- **Threat Intel Manager**: Manage threat intel sources (STATUS: TBD)
- **Reputation Service**: Check IP/domain reputation (STATUS: TBD)
- **IOC Manager**: Manage indicators of compromise (STATUS: TBD)
- **MITRE Mapper**: Map to MITRE ATT&CK (STATUS: TBD - ATT&CK integration not approved)

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

### Implementation Status
**SKELETON** - Module exists with struct definitions only. No response actions implemented.

**Note**: Endpoint-level response capabilities (process killing, file quarantine) are NOT assumed unless explicit endpoint architecture is approved.

### Sub-components
- **Response Executor**: Execute response actions (STATUS: TBD)
- **Firewall Manager**: Manage firewall rules (STATUS: TBD - requires platform-specific implementation)
- **Isolation Manager**: Isolate compromised devices (STATUS: TBD - requires platform-specific implementation)
- **Response Verifier**: Verify response effectiveness (STATUS: TBD)
- **Rollback Manager**: Rollback failed responses (STATUS: TBD)

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

### Implementation Status
**OPTIONAL - SKELETON** - ML is an optional feature flag. No ML models implemented.

**Note**: ML is NOT the definition of AEGIS. ML output should be treated as evidence or signal within the broader analytical pipeline.

### Sub-components
- **ML Inference Engine**: Run ML models (STATUS: TBD - specific models not selected)
- **ML Feature Extractor**: Extract ML features (STATUS: TBD)
- **ML Models**: Trained model storage (STATUS: TBD)
- **Model Version Manager**: Manage model versions (STATUS: TBD)

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

### Implementation Status
**SKELETON** - All integration clients are skeleton implementations with TODO comments. No actual API calls implemented.

**Note**: These integrations are OPTIONAL. External threat intelligence providers are NOT mandatory.

### Sub-components
- **VirusTotal**: VirusTotal API integration (STATUS: SKELETON - TODO only)
- **AbuseIPDB**: AbuseIPDB API integration (STATUS: SKELETON - TODO only)
- **MISP**: MISP integration (STATUS: SKELETON - TODO only)
- **Slack**: Slack notification integration (STATUS: SKELETON - TODO only)
- **Discord**: Discord notification integration (STATUS: SKELETON - TODO only)

### Key Features
- API integrations
- Alert notifications
- Threat intel enrichment
- Incident reporting
