# Event Model

This document describes the event model used in AEGIS.

## Event Structure

### Base Event

All events in AEGIS follow a common structure:

```rust
pub struct Event {
    pub id: String,
    pub timestamp: DateTime<Utc>,
    pub event_type: EventType,
    pub source: EventSource,
    pub severity: EventSeverity,
    pub data: EventData,
}
```

### Event Fields

- **id**: Unique identifier (UUID)
- **timestamp**: Event timestamp in UTC
- **event_type**: Type of event (see below)
- **source**: Source of the event (IP, hostname, etc.)
- **severity**: Severity level (Info, Low, Medium, High, Critical)
- **data**: Event-specific data (raw and parsed)

## Event Types

### Network Events

#### NetworkConnection
```json
{
  "event_type": "NetworkConnection",
  "source_ip": "192.168.1.100",
  "destination_ip": "10.0.0.1",
  "source_port": 12345,
  "destination_port": 443,
  "protocol": "TCP",
  "bytes_sent": 1024,
  "bytes_received": 2048,
  "duration": 60
}
```

#### DnsQuery
```json
{
  "event_type": "DnsQuery",
  "query": "example.com",
  "query_type": "A",
  "response_code": "NOERROR",
  "response": ["93.184.216.34"],
  "dns_server": "8.8.8.8"
}
```

#### HttpRequest
```json
{
  "event_type": "HttpRequest",
  "method": "GET",
  "url": "https://example.com/api/data",
  "user_agent": "Mozilla/5.0...",
  "response_code": 200,
  "response_size": 1024
}
```

### System Events

#### SystemLogin
```json
{
  "event_type": "SystemLogin",
  "username": "admin",
  "source_ip": "192.168.1.100",
  "login_method": "ssh",
  "success": true
}
```

#### FileAccess
```json
{
  "event_type": "FileAccess",
  "file_path": "/etc/passwd",
  "operation": "read",
  "user": "root",
  "success": true
}
```

#### ProcessExecution
```json
{
  "event_type": "ProcessExecution",
  "process_name": "nc",
  "command_line": "nc -l 4444",
  "user": "www-data",
  "pid": 12345
}
```

## Event Severity Levels

### Info
- Normal system operations
- Informational events
- No security implications

### Low
- Minor security events
- Potential misconfigurations
- Low-risk activities

### Medium
- Moderate security events
- Suspicious activities
- Requires investigation

### High
- Significant security events
- Clear indicators of compromise
- Immediate attention required

### Critical
- Severe security events
- Active attacks
- Emergency response required

## Event Normalization

### Timestamp Normalization
All timestamps normalized to UTC ISO 8601 format:
```
2024-01-15T10:30:00Z
```

### IP Address Normalization
All IP addresses normalized to IPv4 or IPv6 format:
```
192.168.1.100
2001:db8::1
```

### Field Name Normalization
Common field names standardized:
- `source_ip` / `src_ip` → `source_ip`
- `destination_ip` / `dst_ip` → `destination_ip`
- `user_name` / `username` → `username`

## Event Enrichment

### GeoIP Enrichment
Add geographical information:
```json
{
  "source_ip": "192.168.1.100",
  "source_geo": {
    "country": "US",
    "city": "San Francisco",
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

### Device Enrichment
Add device information:
```json
{
  "source_ip": "192.168.1.100",
  "source_device": {
    "hostname": "workstation-001",
    "device_type": "Workstation",
    "os": "Windows 11",
    "owner": "user@example.com"
  }
}
```

### Threat Intel Enrichment
Add threat intelligence:
```json
{
  "destination_ip": "10.0.0.1",
  "threat_intel": {
    "malicious": true,
    "confidence": 0.95,
    "threat_types": ["C2", "Malware"],
    "first_seen": "2024-01-01T00:00:00Z"
  }
}
```

## Event Lifecycle

### 1. Generation
Event created by sensor or log source

### 2. Normalization
Event normalized to standard format

### 3. Enrichment
Event enriched with context

### 4. Detection
Event processed by detection engines

### 5. Correlation
Event correlated with other events

### 6. Storage
Event stored in database

### 7. Retention
Event retained based on policy

## Event Querying

### Simple Query
```sql
SELECT * FROM events
WHERE event_type = 'NetworkConnection'
  AND timestamp > '2024-01-01T00:00:00Z'
```

### Complex Query
```sql
SELECT * FROM events
WHERE event_type = 'NetworkConnection'
  AND destination_port IN (22, 23, 3389)
  AND source_geo.country != 'US'
```

### Aggregation
```sql
SELECT source_ip, COUNT(*) as count
FROM events
WHERE event_type = 'NetworkConnection'
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY source_ip
HAVING count > 100
```
