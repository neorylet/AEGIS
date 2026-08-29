# Correlation Design

This document describes the event correlation strategies in AEGIS.

## Overview

Event correlation connects related security events to identify attack patterns, build attack chains, and provide comprehensive incident context.

## Correlation Types

### Temporal Correlation
Events correlated based on time proximity:
- Events within time window
- Sequential event patterns
- Time-based attack patterns

### Spatial Correlation
Events correlated based on network relationships:
- Same source/destination
- Network proximity
- Geographic proximity

### Causal Correlation
Events correlated based on cause-effect relationships:
- Attack chain progression
- Lateral movement patterns
- Command and control communications

### Behavioral Correlation
Events correlated based on behavioral patterns:
- Similar attack techniques
- Repeated patterns
- Campaign attribution

## Correlation Rules

### Rule Structure

```rust
pub struct CorrelationRule {
    pub id: String,
    pub name: String,
    pub time_window: Duration,
    pub event_filter: EventFilter,
    pub correlation_logic: CorrelationLogic,
}
```

### Rule Examples

#### Attack Chain Correlation
```yaml
id: "attack-chain-001"
name: "Lateral Movement Attack Chain"
time_window: "1 hour"
event_filter:
  event_types: ["SystemLogin", "FileAccess", "ProcessExecution"]
correlation_logic:
  type: "sequence"
  sequence:
    - event_type: "SystemLogin"
      source_geo.country: "external"
    - event_type: "FileAccess"
      file_path: "*/sensitive/*"
    - event_type: "ProcessExecution"
      process_name: "powershell"
```

#### Brute Force Correlation
```yaml
id: "brute-force-001"
name: "Brute Force Attack"
time_window: "5 minutes"
event_filter:
  event_type: "SystemLogin"
correlation_logic:
  type: "threshold"
  event_type: "SystemLogin"
  threshold: 10
  group_by: ["source_ip"]
```

## Correlation Graph

### Graph Structure

```rust
pub struct CorrelationGraph {
    nodes: HashMap<String, GraphNode>,
    edges: Vec<GraphEdge>,
}

pub struct GraphNode {
    pub id: String,
    pub node_type: NodeType,
    pub properties: HashMap<String, String>,
}

pub struct GraphEdge {
    pub source: String,
    pub target: String,
    pub edge_type: String,
    pub weight: f64,
}
```

### Node Types

- **Event**: Individual security event
- **Device**: Network device or host
- **IPAddress**: IP address
- **Domain**: Domain name
- **User**: User account
- **Process**: Running process
- **File**: File or artifact

### Edge Types

- **ConnectedTo**: Network connection
- **LoggedInAs**: User login
- **Executed**: Process execution
- **Accessed**: File access
- **CommunicatedWith**: Communication
- **ResolvedTo**: DNS resolution

### Graph Analysis

#### Path Finding
Find paths between entities:
```rust
pub fn find_path(&self, from: &str, to: &str) -> Option<Vec<String>> {
    // BFS/DFS implementation
}
```

#### Connected Components
Identify related event groups:
```rust
pub fn get_connected_components(&self) -> Vec<Vec<String>> {
    // Connected components algorithm
}
```

#### Centrality Analysis
Identify important nodes:
- Degree centrality
- Betweenness centrality
- Closeness centrality

## Attack Chain Reconstruction

### MITRE ATT&CK Mapping

Map events to MITRE ATT&CK techniques:

```rust
pub fn map_to_mitre(event: &Event) -> Option<&MitreTechnique> {
    // Event to technique mapping
}
```

### Attack Chain Stages

1. **Initial Access**
   - Phishing
   - Exploit public-facing application
   - External remote services

2. **Execution**
   - Command-line interface
   - PowerShell
   - User execution

3. **Persistence**
   - Account manipulation
   - Scheduled job
   - Boot or logon autostart

4. **Privilege Escalation**
   - Exploitation for privilege escalation
   - Access token manipulation
   - Bypass UAC

5. **Defense Evasion**
   - Obfuscated files or information
   - Indicator removal
   - Masquerading

6. **Credential Access**
   - Credential dumping
   - Brute force
   - Input capture

7. **Discovery**
   - System information discovery
   - Network service discovery
   - Remote system discovery

8. **Lateral Movement**
   - Remote services
   - Remote file copy
   - SMB/Windows admin shares

9. **Collection**
   - Data from local system
   - Data from network shared drive
   - Data from information repositories

10. **Command and Control**
    - Application layer protocol
    - Data encoding
    - Encrypted channel

11. **Exfiltration**
    - Exfiltration over web
    - Exfiltration over C2 channel
    - Exfiltration over other network medium

## Evidence Collection

### Evidence Types

```rust
pub enum EvidenceType {
    NetworkPacket,
    LogEntry,
    SystemState,
    MemoryDump,
    FileArtifact,
    Screenshot,
}
```

### Collection Strategy

#### Automatic Collection
- Collect evidence for high-severity events
- Preserve network packets
- Capture system state

#### Manual Collection
- On-demand evidence collection
- Forensic acquisition
- Deep packet inspection

### Evidence Chain of Custody

- Timestamp evidence collection
- Hash evidence for integrity
- Document collection process
- Maintain audit trail

## Correlation Performance

### Scalability

- Graph partitioning for large graphs
- Incremental graph updates
- Distributed graph processing

### Real-time Requirements

- Sub-second correlation for critical events
- Batch correlation for historical analysis
- Prioritized correlation based on severity

## False Positive Reduction

### Confidence Scoring

Calculate correlation confidence:
- Rule match strength
- Temporal proximity
- Pattern similarity
- Historical accuracy

### Feedback Loop

- User feedback on correlations
- Automatic rule tuning
- Machine learning refinement
