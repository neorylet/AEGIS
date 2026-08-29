# Open Questions

This document records architectural questions that cannot currently be answered from the project information.

These questions require human decision-making before implementation can proceed.

---

## Deployment Questions

### DQ-001: What is the primary deployment environment?

**Context**: AEGIS needs to be deployed in a specific environment. The choice affects architecture, scalability, and infrastructure requirements.

**Options**:
- On-premises single-node deployment
- On-premises distributed deployment
- Cloud deployment (AWS, Azure, GCP)
- Hybrid deployment
- Desktop application (local deployment)

**Impact**: High - affects entire system architecture

**Related ADR**: ADR-001, ADR-002, ADR-003

---

### DQ-002: Which operating systems must be supported?

**Context**: OS support affects development, testing, and deployment complexity.

**Options**:
- Linux only
- Windows only
- macOS only
- Cross-platform (Linux, Windows, macOS)

**Impact**: High - affects development and testing effort

**Related ADR**: ADR-002

---

### DQ-003: Should AEGIS be containerized?

**Context**: Containerization affects deployment complexity and portability.

**Options**:
- No containerization
- Docker containers
- Kubernetes orchestration
- Other containerization

**Impact**: Medium - affects deployment strategy

**Related ADR**: ADR-003

---

## Storage Questions

### SQ-001: What is the production database technology?

**Context**: Database choice affects performance, scalability, and feature capabilities.

**Current State**: SQLite specified for local/small deployments. PostgreSQL mentioned as optional.

**Options**:
- SQLite
- PostgreSQL
- MySQL
- Time-series database (InfluxDB, TimescaleDB)
- NoSQL database (MongoDB, Cassandra)
- Multi-database approach

**Impact**: High - affects storage architecture and performance

**Related ADR**: ADR-004

---

### SQ-002: What are the data retention policies?

**Context**: Retention policy affects storage costs and compliance requirements.

**Options**:
- Fixed retention periods (e.g., 30 days, 90 days)
- Tiered retention (hot/warm/cold)
- Compliance-driven retention
- Unlimited retention

**Impact**: Medium - affects storage costs and compliance

**Related ADR**: ADR-005

---

### SQ-003: What is the backup strategy?

**Context**: Backup strategy affects data protection and recovery capabilities.

**Options**:
- Full backups only
- Incremental backups
- Differential backups
- Continuous backup
- Point-in-time recovery

**Impact**: High - affects data protection

**Related ADR**: ADR-006

---

## Detection Questions

### DTQ-001: Which detection algorithms will be implemented?

**Context**: Detection algorithm selection affects detection capability and resource requirements.

**Options**:
- Rule-based detection only
- Signature-based detection only
- Statistical anomaly detection only
- Behavioral analysis only
- ML-based detection only
- Multi-modal approach (combination)

**Impact**: High - affects core detection capability

**Related ADR**: ADR-007

---

### DTQ-002: Which ML techniques will be used, if any?

**Context**: ML technique selection affects detection capability, complexity, and resource requirements.

**Options**:
- No ML
- Statistical methods only
- Classical ML (Random Forest, SVM)
- Deep learning (Neural Networks)
- Anomaly detection (Isolation Forest, One-Class SVM)
- Time series models (ARIMA, LSTM)

**Impact**: High - affects detection capability and complexity

**Related ADR**: ADR-008

---

### DTQ-003: What are the sources for detection signatures?

**Context**: Signature source affects detection coverage and maintenance burden.

**Options**:
- Custom signatures only
- Community signatures (Snort, Suricata)
- Commercial signature feeds
- Hybrid approach

**Impact**: Medium - affects detection coverage and maintenance

**Related ADR**: ADR-009

---

### DTQ-004: What is the rule language for detection rules?

**Context**: Rule language affects rule authoring complexity and interoperability.

**Options**:
- Custom rule language
- YAML-based rules
- Sigma rule format
- Snort/Suricata rules
- YARA rules

**Impact**: Medium - affects rule authoring and interoperability

**Related ADR**: ADR-010

---

## Response Questions

### RSQ-001: Will AEGIS have endpoint-level response capabilities?

**Context**: Endpoint-level response requires endpoint agent architecture and has significant security implications.

**Options**:
- No endpoint-level response
- Process termination
- File quarantine
- Registry modification
- Full EDR capabilities

**Impact**: High - affects system architecture and security model

**Related ADR**: ADR-011

---

### RSQ-002: What are the network-level response capabilities?

**Context**: Network-level response requires network infrastructure integration.

**Options**:
- No network-level response
- IP blocking
- Port blocking
- Domain blocking
- Traffic shaping
- Full firewall integration

**Impact**: High - affects network integration requirements

**Related ADR**: ADR-012

---

### RSQ-003: What are the approval workflow requirements for response actions?

**Context**: Approval workflow affects response speed and safety.

**Options**:
- No approval required
- Risk-based approval
- Action-based approval
- Human approval for all actions
- Multi-level approval

**Impact**: High - affects response safety and user experience

**Related ADR**: ADR-013

---

### RSQ-004: What are the rollback mechanisms for response actions?

**Context**: Rollback mechanisms affect response safety and complexity.

**Options**:
- No rollback
- Manual rollback only
- Automatic rollback on failure
- Automatic rollback after timeout
- Full rollback history

**Impact**: High - affects response safety

**Related ADR**: ADR-014

---

## Intelligence Questions

### IQ-001: Which threat intelligence providers will be integrated, if any?

**Context**: Threat intelligence provider selection affects detection enrichment and cost.

**Options**:
- No external threat intelligence
- VirusTotal only
- AbuseIPDB only
- MISP only
- Multiple providers
- Custom threat intelligence only

**Impact**: Medium - affects detection enrichment and cost

**Related ADR**: ADR-015

---

### IQ-002: What are the sources for indicators of compromise?

**Context**: IOC source selection affects detection coverage and maintenance burden.

**Options**:
- Custom IOCs only
- Community IOC feeds
- Commercial IOC feeds
- Hybrid approach

**Impact**: Medium - affects detection coverage and maintenance

**Related ADR**: ADR-016

---

### IQ-003: How will MITRE ATT&CK framework be integrated?

**Context**: ATT&CK integration approach affects threat intelligence and reporting capabilities.

**Options**:
- No ATT&CK integration
- Technique mapping only
- Full ATT&CK integration
- Custom ATT&CK-like framework

**Impact**: Medium - affects threat intelligence and reporting

**Related ADR**: ADR-017

---

## Performance Questions

### PFQ-001: What are the throughput performance targets?

**Context**: Throughput targets affect architecture and resource requirements.

**Options**:
- No specific target
- 1 Gbps
- 10 Gbps
- 40 Gbps
- 100 Gbps

**Impact**: High - affects architecture and resource requirements

**Related ADR**: ADR-018

---

### PFQ-002: What are the latency performance targets?

**Context**: Latency targets affect architecture and resource requirements.

**Options**:
- No specific target
- < 1 second
- < 100 ms
- < 10 ms
- Real-time (< 1 ms)

**Impact**: High - affects architecture and resource requirements

**Related ADR**: ADR-019

---

### PFQ-003: What are the scalability requirements?

**Context**: Scalability requirements affect architecture and infrastructure.

**Options**:
- Single-node only
- Vertical scaling only
- Horizontal scaling
- Auto-scaling
- No scaling requirements

**Impact**: High - affects architecture and infrastructure

**Related ADR**: ADR-020

---

## Security Questions

### SEQ-001: What are the authentication mechanisms?

**Context**: Authentication mechanism selection affects security and user experience.

**Options**:
- Username/password only
- MFA required
- Certificate-based authentication
- SSO integration
- No authentication (local only)

**Impact**: High - affects security and user experience

**Related ADR**: ADR-021

---

### SEQ-002: What is the authorization model?

**Context**: Authorization model selection affects security and flexibility.

**Options**:
- No authorization (admin only)
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Hybrid RBAC/ABAC
- Custom authorization

**Impact**: High - affects security and flexibility

**Related ADR**: ADR-022

---

### SEQ-003: What are the encryption requirements?

**Context**: Encryption requirements affect security and performance.

**Options**:
- No encryption
- TLS for communications only
- Encryption at rest
- Full encryption (in transit and at rest)
- Hardware security module (HSM)

**Impact**: High - affects security and performance

**Related ADR**: ADR-023

---

### SEQ-004: What are the audit logging requirements?

**Context**: Audit logging requirements affect security, compliance, and storage.

**Options**:
- No audit logging
- Basic logging
- Comprehensive audit logging
- Immutable audit logging
- Compliance-focused logging

**Impact**: High - affects security, compliance, and storage

**Related ADR**: ADR-024

---

## Forecasting Questions

### FCQ-001: Is forecasting a required core component?

**Context**: Forecasting is an analytical extension, not fundamental to AEGIS purpose.

**Options**:
- Remove forecasting (out of scope)
- Keep as optional feature
- Make core component
- Postpone to future version

**Impact**: Medium - affects scope and development effort

**Related ADR**: ADR-028

---

## Telemetry Questions

### TQ-001: What telemetry sources are required?

**Context**: Telemetry sources affect collection architecture and detection capabilities.

**Options**:
- Network traffic only
- System logs only
- Application logs only
- Multiple sources
- Custom telemetry sources

**Impact**: High - affects collection architecture

---

### TQ-002: What packet capture technology will be used?

**Context**: Packet capture technology affects performance and platform support.

**Options**:
- libpcap
- WinPcap
- Npcap
- eBPF
- DPDK
- Custom implementation

**Impact**: High - affects performance and platform support

---

## Integration Questions

### INQ-001: Which external systems must AEGIS integrate with?

**Context**: External integrations affect development effort and maintenance burden.

**Options**:
- SIEM integration
- SOAR integration
- Ticketing system integration
- No external integrations
- Custom integrations

**Impact**: Medium - affects development effort

---

## User Interface Questions

### UIQ-001: What is the primary user interface paradigm?

**Context**: UI paradigm affects user experience and development effort.

**Options**:
- Desktop application (Tauri)
- Web application
- Command-line interface
- API-only
- Hybrid approach

**Impact**: Medium - affects user experience and development

---

## Compliance Questions

### CPQ-001: What compliance requirements must be met?

**Context**: Compliance requirements affect security controls and documentation.

**Options**:
- No specific compliance requirements
- GDPR
- HIPAA
- PCI DSS
- SOC 2
- Multiple compliance frameworks

**Impact**: High - affects security controls and documentation

---

## Summary

### Total Questions: 24

### High Impact: 18
- Deployment: 3
- Storage: 2
- Detection: 3
- Response: 4
- Performance: 3
- Security: 4
- Telemetry: 1

### Medium Impact: 6
- Storage: 1
- Detection: 1
- Intelligence: 3
- Forecasting: 1

### Low Impact: 0

---

## Next Steps

1. **Prioritize Questions**: Prioritize high-impact questions for decision-making
2. **Schedule Reviews**: Schedule decision review meetings for each question
3. **Document Decisions**: Record decisions in ARCHITECTURE_DECISIONS.md
4. **Update Specification**: Update AEGIS_CANONICAL_SPECIFICATION.md with decisions
5. **Remove Answered Questions**: Remove questions from this document once answered

---

## Document Control

**Status**: Active

**Last Updated**: 2024-01-15

**Next Review**: TBD

**Maintained By**: AEGIS Team
