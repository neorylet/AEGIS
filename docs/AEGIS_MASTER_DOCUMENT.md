# AEGIS Master Document

This is the master document and primary entry point for the AEGIS project.

It provides the high-level definition, current scope, module structure, and navigation to the detailed AEGIS documentation.

> **Important:** This document describes the intended architecture and organization of AEGIS. The existence of a module, directory, or documentation file does not mean that the corresponding functionality has already been implemented.

---

## 1. System Overview

**AEGIS (Advanced Enterprise-grade Guardian & Intrusion System)** is a cybersecurity monitoring and analysis system focused on collecting security-relevant telemetry, identifying suspicious activity, analyzing behavioral patterns, correlating evidence, assessing risk, and supporting incident investigation and response.

The central AEGIS workflow is:

```text
Telemetry / Network Activity
            ↓
       Collection
            ↓
    Event Normalization
            ↓
    Entity / Asset Context
            ↓
    Behavioral Analysis
            ↓
         Detection
            ↓
   Threat Intelligence
            ↓
       Correlation
            ↓
     Risk Assessment
            ↓
       Incidents
            ↓
     Explanation
            ↓
   Policy / Response
```

This workflow represents the conceptual architecture of AEGIS. Individual implementation details remain subject to the project's architecture and design decisions.

---

## 2. Core Capabilities

AEGIS is organized around the following capabilities:

* **Network / Security Monitoring** — Collection and analysis of relevant security telemetry.
* **Event Processing** — Normalization and management of security events.
* **Behavioral Analysis** — Establishment of behavioral baselines and identification of deviations.
* **Threat Detection** — Detection using appropriate rules, signatures, heuristics, statistical methods, and/or machine-learning-assisted techniques.
* **Threat Intelligence** — Enrichment of observations with relevant intelligence and indicators.
* **Event Correlation** — Connecting related observations and evidence.
* **Risk Assessment** — Contextual evaluation of security risk.
* **Incident Management** — Organization of detections and related evidence into investigable incidents.
* **Explanation** — Providing understandable reasoning and supporting evidence for analytical results.
* **Policy / Response** — Controlled handling of approved security response actions.
* **Device / Entity Context** — Maintaining contextual information about observed entities.
* **Investigation / Hunting** — Supporting analyst-driven investigation of historical and current activity.

Capabilities such as advanced machine learning, forecasting, automated response, extensive forensic collection, and external integrations should only be considered active project requirements when explicitly approved and documented.

---

# 3. Architecture

AEGIS is organized as a modular application architecture.

The project is divided into functional modules with clear responsibilities and interfaces.

The exact deployment model, process boundaries, communication mechanisms, database architecture, and scalability strategy are documented separately and must not be inferred solely from the existence of these modules.

### Current Technology Direction

The current project structure contains:

* **Backend:** Rust / Tauri
* **Frontend:** React
* **Persistence:** SQLite is the current documented direction
* **Machine Learning:** Python components may be used where required

These technologies should not be treated as justification for additional architectural assumptions.

For example, AEGIS should not automatically be considered a distributed microservices system merely because it contains independent modules.

---

# 4. Module Structure

The following directories establish the intended AEGIS module structure.

Some modules may initially contain only placeholders.

Implementation status must be documented separately.

### Core Modules

1. **Sensor**
   `src-tauri/src/sensor/`
   Responsible for collecting relevant network/security telemetry.

2. **Discovery**
   `src-tauri/src/discovery/`
   Responsible for discovering and maintaining contextual information about observed entities.

3. **Events**
   `src-tauri/src/events/`
   Responsible for event representation, validation, normalization, and processing.

4. **Detection**
   `src-tauri/src/detection/`
   Responsible for identifying suspicious activity using approved detection mechanisms.

5. **Fingerprint**
   `src-tauri/src/fingerprint/`
   Responsible for behavioral profiling, baselines, fingerprinting, and behavioral deviation analysis.

6. **Intelligence**
   `src-tauri/src/intelligence/`
   Responsible for threat-intelligence enrichment and indicator management.

7. **Correlation**
   `src-tauri/src/correlation/`
   Responsible for relating multiple observations and evidence.

8. **Incidents**
   `src-tauri/src/incidents/`
   Responsible for incident construction, tracking, evidence, and timelines.

9. **Risk**
   `src-tauri/src/risk/`
   Responsible for contextual risk assessment.

10. **Explanation**
    `src-tauri/src/explanation/`
    Responsible for presenting understandable reasoning and supporting evidence for system decisions.

11. **Policy**
    `src-tauri/src/policy/`
    Responsible for security policies, authorization rules, and response-control logic.

12. **Response**
    `src-tauri/src/response/`
    Responsible for executing approved response actions.

13. **Playbooks**
    `src-tauri/src/playbooks/`
    Responsible for defining and managing structured response workflows.

14. **ML**
    `src-tauri/src/ml/`
    Responsible for machine-learning functionality that is explicitly selected for AEGIS.

15. **Forecasting**
    `src-tauri/src/forecasting/`
    Reserved for approved predictive or trend-analysis functionality.

16. **Hunting**
    `src-tauri/src/hunting/`
    Responsible for analyst-driven threat investigation and historical activity analysis.

17. **Integrations**
    `src-tauri/src/integrations/`
    Responsible for approved external services, intelligence sources, and other integrations.

18. **Storage**
    `src-tauri/src/storage/`
    Responsible for persistence and data-access logic.

19. **Config**
    `src-tauri/src/config/`
    Responsible for application configuration.

20. **Commands**
    `src-tauri/src/commands/`
    Responsible for application commands and Tauri-facing interfaces.

---

# 5. Module Status

Every module should eventually have an explicit implementation status.

Use the following statuses:

| Status         | Meaning                                                         |
| -------------- | --------------------------------------------------------------- |
| `IMPLEMENTED`  | Functionality currently exists and works.                       |
| `PLANNED`      | Approved for implementation but not completed.                  |
| `EXPERIMENTAL` | Currently being investigated or prototyped.                     |
| `RESEARCH`     | Being studied before an implementation decision.                |
| `FUTURE`       | Potential later functionality.                                  |
| `TBD`          | Architectural or implementation decision has not yet been made. |
| `OUT OF SCOPE` | Explicitly excluded from the current project.                   |

**A directory existing in the repository does not automatically mean the module is implemented.**

---

# 6. Scope Control

AEGIS documentation must distinguish between:

* What AEGIS currently does
* What AEGIS is approved to do
* What is being researched
* What is planned
* What is experimental
* What is future work
* What is explicitly outside the project's scope

Do not introduce technologies, algorithms, deployment models, performance targets, integrations, or capabilities merely because they are common in cybersecurity systems.

If a decision has not been made, mark it as `TBD`.

---

# 7. Architectural Documentation

Detailed architectural decisions belong in:

`docs/architecture/`

Relevant documents may include:

* Architecture Overview
* Component Architecture
* Data Flow
* Trust Boundaries
* Deployment Architecture
* Data Model
* Architecture Decision Records

Major architectural decisions should be recorded rather than silently assumed.

---

# 8. Research Documentation

Research supporting AEGIS belongs in:

`docs/research/`

Research should be connected to actual AEGIS requirements.

The research documentation should answer:

1. What is being researched?
2. Why is it relevant to AEGIS?
3. Which subsystem does it support?
4. What design decision could it influence?
5. Is it required, optional, experimental, future, or out of scope?

Generic cybersecurity research should not automatically be treated as an AEGIS requirement.

Academic references must be verified before being used as authoritative capstone references.

---

# 9. Development Documentation

Development documentation belongs in:

`docs/development/`

This should eventually contain:

* Environment setup
* Build instructions
* Development workflow
* Coding conventions
* Testing procedures
* Debugging information
* Contribution guidelines

Implementation documentation should reflect the actual codebase rather than planned functionality.

---

# 10. Security Documentation

Security-related architecture and controls belong in:

`docs/security/`

This may eventually cover:

* Trust boundaries
* Authentication
* Authorization
* Data protection
* Input validation
* Secure communication
* Auditability
* Response safety
* External integration security

Do not claim that a security control is implemented unless it actually exists.

---

# 11. Testing Documentation

Testing documentation should eventually describe how AEGIS functionality is validated.

Testing should cover, where applicable:

* Unit testing
* Integration testing
* Detection testing
* Behavioral-analysis testing
* Correlation testing
* Risk assessment testing
* Response testing
* Performance benchmarking
* Security testing

Performance claims should be based on measurements rather than assumed targets.

---

# 12. Deployment

The final deployment architecture has not necessarily been established.

Do not assume that AEGIS supports:

* Multiple operating systems
* Cloud deployment
* Distributed deployment
* Kubernetes
* Horizontal scaling
* High-speed enterprise networking
* Multiple database systems

unless these are explicitly approved and documented.

The project's actual deployment target should be established through the architecture documentation.

---

# 13. Documentation Index

### Architecture

`docs/architecture/`

Contains the architectural definition and major system-design documents.

### Design

`docs/design/`

Contains detailed subsystem and implementation design.

### Security

`docs/security/`

Contains security architecture, controls, and security-related design.

### Research

`docs/research/`

Contains literature reviews, technical research, methodology, and research status.

### Development

`docs/development/`

Contains development, build, testing, and contribution documentation.

### Decisions

`docs/decisions/ADR/`

Contains Architecture Decision Records documenting significant technical decisions.

---

# 14. Canonical Documentation Rule

When documentation conflicts:

1. The AEGIS Canonical Specification takes precedence.
2. Approved Architecture Decision Records take precedence over assumptions.
3. Actual implementation takes precedence when documenting implemented functionality.
4. Unresolved decisions must be marked `TBD`.
5. Speculative ideas must be classified rather than presented as requirements.

No document should silently expand the AEGIS scope.

---

# 15. Current Project State

AEGIS is currently in an architecture and development-definition stage.

The repository structure may contain modules and documentation placeholders that are not yet implemented.

This is intentional.

The purpose of establishing the structure early is to provide a stable navigation framework for future development without requiring every subsystem to be implemented immediately.

---

## Getting Started

See:

`docs/development/setup.md`

for development setup instructions.

---

## Contributing

See:

`CONTRIBUTING.md`

for contribution and development guidelines.
