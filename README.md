# AEGIS

## Active Defense & Granular Intelligence System

AEGIS is a **desktop cybersecurity application** designed to collect, analyze, correlate, and contextualize network and security observations.

Its purpose is to transform raw security telemetry into **granular, evidence-driven security intelligence** that can support detection, investigation, risk assessment, incident analysis, and controlled defensive action.

AEGIS is built around the principle:

> **Collect → Understand → Correlate → Assess → Explain → Defend**

AEGIS is currently under active development. Some components are conceptual or skeletal and should not be interpreted as fully implemented capabilities.

---

## System Overview

AEGIS is designed as a modular desktop security platform centered around an evidence-driven analytical pipeline.

At a high level:

```text
Network / Security Telemetry
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
       Correlation
            ↓
    Risk Assessment
            ↓
 Security Finding / Incident
            ↓
       Explanation
            ↓
 Policy / Authorization
            ↓
   Controlled Response
```

Threat intelligence may be used to enrich observations and provide additional context throughout the analytical process.

Machine learning may also be used where it provides a justified analytical benefit. ML is **not a requirement for the definition of AEGIS** and is not assumed to be the primary detection mechanism.

---

## Core Capabilities

The following represent the intended capability areas of AEGIS. Implementation status may vary by component.

* **Network & Security Telemetry Collection**
  Collect relevant network or security observations from approved sources.

* **Event Normalization**
  Convert heterogeneous observations into a consistent internal event representation.

* **Entity & Asset Context**
  Maintain contextual information about devices, hosts, addresses, services, and other observed entities.

* **Behavioral Analysis**
  Establish behavioral baselines and identify meaningful deviations from expected activity.

* **Multi-Modal Detection**
  Support multiple detection approaches, potentially including deterministic rules, signatures, heuristics, statistical analysis, behavioral analysis, anomaly detection, and ML-assisted techniques.

* **Threat Intelligence Enrichment**
  Enrich observations with relevant external or internally maintained intelligence when appropriate.

* **Event Correlation**
  Identify relationships between observations using factors such as time, entities, indicators, behavior, and potential attack sequences.

* **Contextual Risk Assessment**
  Assess the significance of accumulated evidence using contextual factors rather than treating detection severity as equivalent to overall risk.

* **Incident Construction & Management**
  Organize related evidence, detections, entities, timelines, and analyst information into security incidents.

* **Explainable Findings**
  Provide analysts with the evidence and reasoning behind detections, correlations, and risk assessments.

* **Threat Hunting**
  Support analyst-driven investigation of telemetry, entities, detections, and historical activity.

* **Controlled Defensive Response**
  Provide a framework for authorized response actions subject to policy, authorization, safety controls, auditing, and verification.

These capabilities are being developed incrementally and are **not all currently implemented**.

---

## Architecture

AEGIS is currently designed as a **desktop Tauri application**.

### Frontend

* React
* TypeScript
* Desktop user interface delivered through Tauri

### Native / Backend Layer

* Rust
* Tauri
* Security telemetry processing
* Event processing
* Detection and analytical components
* Application services and system integration

### Storage

Local persistence is currently being evaluated and developed according to AEGIS requirements.

SQLite may be used for local deployments where appropriate. Production storage architecture remains subject to architectural decisions.

### Machine Learning

Python may be used for specific ML or analytical components where justified.

ML is an **optional analytical mechanism**, not the foundation of the entire AEGIS architecture.

---

## Architectural Principles

AEGIS follows several core principles:

### Evidence Over Assumptions

Individual observations should not automatically be treated as confirmed security incidents.

AEGIS should build findings from observable evidence and supporting context.

### Detection ≠ Incident

A detection represents suspicious or potentially significant activity.

An incident represents a broader security situation requiring investigation, tracking, or response.

Not every detection should automatically become an incident.

### Detection ≠ Risk

Detection severity is not equivalent to overall risk.

Risk should consider contextual factors such as:

* Detection severity
* Detection confidence
* Behavioral deviation
* Threat intelligence
* Entity or asset criticality
* Related observations
* Temporal relationships
* Accumulated evidence

### Correlation ≠ Detection

Detection asks:

> **"Is this observation or behavior suspicious?"**

Correlation asks:

> **"Are these observations related to the same security activity?"**

Risk assessment then considers the accumulated evidence.

### ML ≠ Ground Truth

Machine learning output, where used, should be treated as an analytical signal or evidence source rather than unquestionable truth.

---

## Current Development Status

AEGIS is currently in active architectural and implementation development.

Some major subsystem structures may exist as skeletons or placeholders while their final implementation is being designed.

Current development priorities include:

* Establishing the telemetry collection architecture
* Defining the event model
* Developing the detection pipeline
* Designing behavioral analysis
* Establishing correlation mechanisms
* Defining contextual risk assessment
* Developing incident management
* Establishing explainability mechanisms
* Determining appropriate threat intelligence integrations
* Defining controlled response capabilities
* Establishing testing and evaluation methodology

Refer to the canonical specification and project documentation for the authoritative implementation status of individual components.

---

## Project Structure

The repository is organized around modular AEGIS subsystems.

```text
AEGIS/
├── src-tauri/
│   └── src/
│       ├── sensor/
│       ├── discovery/
│       ├── events/
│       ├── detection/
│       ├── fingerprint/
│       ├── intelligence/
│       ├── correlation/
│       ├── incidents/
│       ├── risk/
│       ├── explanation/
│       ├── policy/
│       ├── response/
│       ├── playbooks/
│       ├── ml/
│       ├── forecasting/
│       ├── hunting/
│       ├── integrations/
│       ├── storage/
│       ├── config/
│       └── commands/
│
├── frontend/
│
├── docs/
│   ├── architecture/
│   ├── design/
│   ├── development/
│   ├── research/
│   ├── security/
│   └── decisions/
│
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

**Note:** The presence of a directory does not necessarily indicate that the corresponding subsystem is fully implemented.

The actual repository structure is authoritative for implementation.

---

## Development

### Prerequisites

The exact development requirements should follow the versions specified by the current project configuration.

At minimum, AEGIS currently uses technologies from the following ecosystem:

* Rust
* Tauri
* Node.js
* npm
* React
* TypeScript

Python is only required where the current implementation includes Python-based analytical or ML components.

Do not assume a specific version unless it is established by the repository configuration.

### Getting Started

Follow the project-specific development documentation for the current setup and build process.

```text
docs/development/setup.md
```

The development setup should be kept synchronized with the actual repository and dependency configuration.

---

## Documentation

The `docs/` directory contains the project's technical, architectural, research, and development documentation.

Important documentation includes:

* **Canonical Specification** — authoritative definition of AEGIS scope and intent
* **Architecture Documentation** — system architecture and component relationships
* **Design Documentation** — detailed subsystem and data-flow design
* **Research Documentation** — research supporting AEGIS design decisions
* **Security Documentation** — security architecture, threats, and controls
* **Development Documentation** — development environment and implementation guidance
* **Architecture Decision Records (ADRs)** — significant architectural decisions and their rationale

Documentation must distinguish between:

```text
Implemented
Partially Implemented
Skeleton / Placeholder
Planned
Experimental
Research
TBD
Future
Out of Scope
Unverified
```

Documentation must not present planned or conceptual functionality as implemented functionality.

---

## Research & Academic Foundation

AEGIS development is supported by research into areas relevant to its architecture and security objectives.

Research may include topics such as:

* Intrusion detection
* Network security monitoring
* Behavioral analysis
* Anomaly detection
* Event correlation
* Threat intelligence
* Network forensics
* Risk assessment
* Explainable security analytics
* Security automation

Research topics are retained based on their relevance to actual AEGIS requirements and architectural decisions.

Technologies or methodologies appearing in research should **not** automatically be interpreted as AEGIS features.

Research citations should be verified before being used as formal academic references.

---

## Scope Boundaries

AEGIS is **not currently defined as**:

* A generic SIEM replacement
* An EDR/XDR platform
* A cloud-native platform
* A Kubernetes system
* A distributed enterprise platform
* An AI-first cybersecurity system
* A universal threat-intelligence aggregator
* A compliance-management platform

Endpoint-level actions such as arbitrary process termination, file quarantine, or operating-system manipulation are not assumed unless an explicit endpoint architecture and corresponding requirements are established.

---

## Roadmap

The AEGIS roadmap is intentionally requirements-driven.

Future development may include:

* Expanded telemetry collection
* More advanced behavioral analysis
* Additional detection mechanisms
* Improved correlation
* Threat intelligence integrations
* Advanced investigation and hunting
* Controlled response automation
* Additional analytical and ML capabilities
* Improved visualization and explainability

Specific roadmap items should only become committed requirements after they are evaluated and documented.

---

## Contributing

Contributions should remain consistent with the AEGIS canonical specification, architecture, requirements, and security boundaries.

Before introducing a substantial architectural or functional change, consult the relevant documentation and Architecture Decision Records.

See:

```text
CONTRIBUTING.md
```

for contribution guidelines.

---

## License

See the `LICENSE` file for the project's current licensing terms.

---

## Security

Security-related issues and vulnerabilities should be handled according to the project's documented security disclosure process.

Do not assume that a dedicated security email address, vulnerability-management process, or disclosure infrastructure exists unless it has been explicitly configured for the project.

---

## Project Status

**AEGIS — Active Defense & Granular Intelligence System**

**Status:** Active Development

The architecture and implementation are evolving. The **AEGIS Canonical Specification** is the authoritative source for system intent, while the repository itself is authoritative for current implementation status.
