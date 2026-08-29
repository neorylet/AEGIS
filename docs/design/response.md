# Response Design

This document describes the automated response design in AEGIS.

## Overview

The response engine executes automated actions to contain and mitigate security incidents based on detection results and risk assessments.

## Response Philosophy

### Principles

1. **Safety First**: Do no harm, verify before acting
2. **Graduated Response**: Start with least disruptive actions
3. **Human in the Loop**: Require approval for critical actions
4. **Rollback Ready**: Always be able to undo actions
5. **Evidence Preserved**: Collect evidence before response

### Response Tiers

#### Tier 1: Informational
- Log and alert
- No automated action
- Human review required

#### Tier 2: Containment
- Block network access
- Isolate affected systems
- Preserve evidence

#### Tier 3: Mitigation
- Terminate malicious processes
- Quarantine files
- Disable accounts

#### Tier 4: Recovery
- Restore from backups
- Patch vulnerabilities
- Update configurations

## Response Actions

### Network Actions

#### Block IP
```rust
pub async fn block_ip(ip: &str) -> Result<(), String> {
    // Add firewall rule to block IP
    // Log action
    // Verify block
}
```

#### Block Port
```rust
pub async fn block_port(port: u16) -> Result<(), String> {
    // Block specific port
    // Apply to firewall
    // Log action
}
```

#### Block Domain
```rust
pub async fn block_domain(domain: &str) -> Result<(), String> {
    // Add to DNS blocklist
    // Update DNS sinkhole
    // Log action
}
```

### Host Actions

**STATUS**: TBD - endpoint-level response capabilities not yet approved

The following endpoint-level actions are NOT assumed unless an explicit endpoint/host architecture is approved:

#### Isolate Device
```rust
pub async fn isolate_device(device_id: &str) -> Result<(), String> {
    // Remove from network
    // Maintain management access
    // Log action
}
```

#### Kill Process
**STATUS**: NOT APPROVED - requires endpoint agent architecture

#### Quarantine File
**STATUS**: NOT APPROVED - requires endpoint agent architecture

### Account Actions

**STATUS**: TBD - account management capabilities not yet approved

#### Disable Account
```rust
pub async fn disable_account(username: &str) -> Result<(), String> {
    // Disable user account
    // Revoke sessions
    // Log action
}
```

#### Reset Password
```rust
pub async fn reset_password(username: &str) -> Result<(), String> {
    // Reset password
    // Force password change
    // Log action
}
```

## Playbook Engine

### Playbook Structure

```rust
pub struct Playbook {
    pub id: String,
    pub name: String,
    pub description: String,
    pub trigger: PlaybookTrigger,
    pub steps: Vec<PlaybookStep>,
    pub enabled: bool,
}
```

### Playbook Triggers

#### Manual Trigger
```yaml
trigger:
  type: "manual"
```

#### Alert Trigger
```yaml
trigger:
  type: "alert"
  alert_type: "MalwareDetected"
  severity: "High"
```

#### Incident Trigger
```yaml
trigger:
  type: "incident"
  severity: "Critical"
```

### Playbook Steps

```yaml
steps:
  - id: "step1"
    name: "Isolate infected host"
    action: "isolate_device"
    parameters:
      device_id: "{{incident.device_id}}"
    continue_on_failure: false
  
  - id: "step2"
    name: "Block malicious IP"
    action: "block_ip"
    parameters:
      ip: "{{incident.source_ip}}"
    continue_on_failure: true
  
  - id: "step3"
    name: "Collect evidence"
    action: "collect_evidence"
    parameters:
      device_id: "{{incident.device_id}}"
      evidence_types: ["memory", "disk"]
    continue_on_failure: true
```

### Playbook Execution

```rust
pub async fn execute_playbook(&mut self, playbook_id: &str) -> Result<PlaybookExecution, String> {
    // Load playbook
    // Execute steps sequentially
    // Handle failures
    // Record results
}
```

## Response Guardrails

### Approval Requirements

#### Risk-Based Approval
- **Low Risk**: No approval required
- **Medium Risk**: Security team approval
- **High Risk**: Manager approval
- **Critical Risk**: Executive approval

#### Action-Based Approval
- **Informational**: No approval
- **Containment**: Security team approval
- **Mitigation**: Manager approval
- **Destructive**: Executive approval

### Rate Limiting

Prevent response abuse:
- Maximum actions per hour
- Cooling-off periods
- Action quotas

### Verification

#### Pre-Action Verification
- Verify target exists
- Check current state
- Validate permissions

#### Post-Action Verification
- Verify action completed
- Check expected state
- Collect evidence

## Rollback

### Rollback Strategy

Every response action must have a corresponding rollback:

```rust
pub struct RollbackAction {
    pub original_action_id: String,
    pub rollback_type: RollbackType,
    pub parameters: HashMap<String, String>,
    pub executed: bool,
}
```

### Rollback Types

#### Unblock IP
```rust
pub async fn unblock_ip(ip: &str) -> Result<(), String> {
    // Remove firewall rule
    // Verify unblock
    // Log action
}
```

#### Release Device
```rust
pub async fn release_device(device_id: &str) -> Result<(), String> {
    // Restore network access
    // Verify connectivity
    // Log action
}
```

#### Restore File
```rust
pub async fn restore_file(file_path: &str) -> Result<(), String> {
    // Restore from quarantine
    // Verify integrity
    // Log action
}
```

### Automatic Rollback

Trigger conditions:
- Action verification fails
- False positive confirmed
- Time threshold exceeded
- Manual rollback request

## Response Verification

### Verification Methods

#### Network Verification
- Ping target
- Port scan
- Traffic analysis

#### Host Verification
- Process list
- File system
- System logs

#### Service Verification
- Service status
- Application logs
- User reports

### Verification Results

```rust
pub struct VerificationResult {
    pub verified: bool,
    pub confidence: f64,
    pub evidence: Vec<String>,
}
```

## Response Analytics

### Metrics

- Response time
- Action success rate
- Rollback frequency
- False positive rate

### Reporting

- Response effectiveness
- Action frequency
- Approval patterns
- Rollback analysis

## Safety Considerations

### Fail-Safe Design

- Default to no action on failure
- Require explicit confirmation
- Implement timeout protections
- Test in staging first

### Testing

- Test playbooks in non-production
- Validate rollback procedures
- Test edge cases
- Regular drills

### Monitoring

- Monitor response actions
- Alert on failures
- Track rollback usage
- Review response effectiveness
