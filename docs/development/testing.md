# Testing Guide

**STATUS**: RECONCILED - Testing strategies for development

This document provides testing strategies and procedures for the AEGIS system.

## Testing Overview

AEGIS uses a multi-layered testing approach:

1. **Unit Tests**: Test individual functions and modules
2. **Integration Tests**: Test component interactions
3. **System Tests**: Test the complete system
4. **End-to-End Tests**: Test user workflows
5. **Performance Tests**: Test system performance
6. **Security Tests**: Test security vulnerabilities

## Rust Testing

### Unit Tests

#### Writing Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_packet_capture() {
        let capture = PacketCapture::new("eth0".to_string());
        assert_eq!(capture.interface, "eth0");
    }

    #[test]
    fn test_event_creation() {
        let event = Event {
            id: "test".to_string(),
            timestamp: chrono::Utc::now(),
            event_type: EventType::NetworkConnection,
            source: EventSource::default(),
            severity: EventSeverity::Info,
            data: EventData::default(),
        };
        assert_eq!(event.id, "test");
    }
}
```

#### Running Unit Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_packet_capture

# Run tests in specific module
cargo test sensor::tests

# Run tests with output
cargo test -- --nocapture

# Run tests with specific filter
cargo test -- --test-threads=1
```

### Integration Tests

#### Writing Integration Tests

Create `src-tauri/tests/integration_test.rs`:

```rust
use aegis_lib::*;

#[test]
fn test_sensor_integration() {
    let sensor = PacketCapture::new("eth0".to_string());
    sensor.start().unwrap();
    
    // Test sensor functionality
    assert!(sensor.active);
    
    sensor.stop().unwrap();
}
```

#### Running Integration Tests

```bash
# Run integration tests
cargo test --test integration_test

# Run all tests (unit + integration)
cargo test
```

### Documentation Tests

```rust
/// Creates a new packet capture instance.
///
/// # Examples
///
/// ```
/// let capture = PacketCapture::new("eth0".to_string());
/// assert_eq!(capture.interface, "eth0");
/// ```
pub fn new(interface: String) -> Self {
    Self { interface, active: false }
}
```

Run documentation tests:
```bash
cargo test --doc
```

## Frontend Testing

### Unit Tests (Jest)

#### Writing Unit Tests

```typescript
// components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('renders dashboard title', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

#### Running Unit Tests

```bash
cd frontend
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Component Tests

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react';
import DeviceList from '../DeviceList';

describe('DeviceList', () => {
  it('displays devices', async () => {
    render(<DeviceList />);
    
    await waitFor(() => {
      expect(screen.getByText('Device 1')).toBeInTheDocument();
    });
  });

  it('handles device selection', () => {
    render(<DeviceList />);
    fireEvent.click(screen.getByText('Device 1'));
    expect(screen.getByText('Selected: Device 1')).toBeInTheDocument();
  });
});
```

### Integration Tests (React Testing Library)

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App Integration', () => {
  it('navigates to dashboard', async () => {
    renderApp();
    
    fireEvent.click(screen.getByText('Dashboard'));
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing (Playwright)

### Setup

```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

### Writing E2E Tests

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('device list displays', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.click('text=Devices');
  
  await expect(page.locator('.device-item')).toHaveCount(3);
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run headed mode
npx playwright test --headed

# Run specific test
npx playwright test dashboard.spec.ts
```

## Performance Testing

### Load Testing (k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('http://localhost:3000/api/devices');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

Run load test:
```bash
k6 run load-test.js
```

### Rust Performance Tests

```rust
#[bench]
fn benchmark_packet_processing(b: &mut test::Bencher) {
    let packets = create_test_packets(1000);
    
    b.iter(|| {
        process_packets(&packets);
    });
}
```

Run benchmarks:
```bash
cargo test --release --bench
```

## Security Testing

### Static Analysis (Rust)

```bash
# Install cargo-audit
cargo install cargo-audit

# Check for vulnerabilities
cargo audit

# Use clippy for linting
cargo clippy
```

### Static Analysis (JavaScript)

```bash
# Run ESLint
npm run lint

# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### Dependency Scanning

```bash
# Use Snyk
npm install -g snyk
snyk test

# Use Dependabot (GitHub)
# Configure in .github/dependabot.yml
```

## Test Coverage

### Rust Coverage

```bash
# Install tarpaulin
cargo install cargo-tarpaulin

# Generate coverage report
cargo tarpaulin --out Html
```

### Frontend Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Test Data Management

### Fixtures

```rust
// tests/fixtures.rs
pub fn create_test_event() -> Event {
    Event {
        id: "test-1".to_string(),
        timestamp: chrono::Utc::now(),
        event_type: EventType::NetworkConnection,
        source: EventSource {
            ip_address: "192.168.1.1".to_string(),
            port: Some(12345),
            hostname: Some("test-host".to_string()),
        },
        severity: EventSeverity::Medium,
        data: EventData::default(),
    }
}
```

### Test Database

```bash
# Use test database
export DATABASE_URL=sqlite:test.db

# Run tests with test database
cargo test
```

## Continuous Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Run Rust tests
        run: cargo test --verbose
      
      - name: Run frontend tests
        run: cd frontend && npm test
      
      - name: Run E2E tests
        run: cd frontend && npx playwright test
```

## Test Best Practices

### General Principles

1. **Test Behavior, Not Implementation**: Test what the code does, not how it does it
2. **Independent Tests**: Each test should be independent
3. **Fast Tests**: Unit tests should be fast
4. **Clear Names**: Use descriptive test names
5. **One Assertion Per Test**: Prefer multiple small tests over one large test

### Rust Best Practices

```rust
// Good: Clear and focused
#[test]
fn test_packet_capture_starts() {
    let mut capture = PacketCapture::new("eth0".to_string());
    capture.start().unwrap();
    assert!(capture.active);
}

// Bad: Multiple assertions
#[test]
fn test_packet_capture() {
    let capture = PacketCapture::new("eth0".to_string());
    assert_eq!(capture.interface, "eth0");
    capture.start().unwrap();
    assert!(capture.active);
    capture.stop().unwrap();
    assert!(!capture.active);
}
```

### Frontend Best Practices

```typescript
// Good: Test user behavior
it('user can add device', () => {
  render(<DeviceForm />);
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Device 1' } });
  fireEvent.click(screen.getByText('Add'));
  expect(screen.getByText('Device 1')).toBeInTheDocument();
});

// Bad: Test implementation details
it('calls addDevice function', () => {
  const addDevice = jest.fn();
  render(<DeviceForm addDevice={addDevice} />);
  fireEvent.click(screen.getByText('Add'));
  expect(addDevice).toHaveBeenCalled();
});
```

## Debugging Tests

### Rust Test Debugging

```bash
# Run single test with output
cargo test test_packet_capture -- --nocapture

# Print test output
print! = "Debug info: {:?}", value;
```

### Frontend Test Debugging

```typescript
// Debug with screen.debug()
screen.debug();

// Log element
console.log(screen.getByText('Dashboard'));
```

## Test Organization

### Directory Structure

```
src-tauri/
├── src/
│   ├── sensor/
│   │   ├── mod.rs
│   │   └── tests/
│   │       └── sensor_test.rs
│   └── tests/
│       └── integration_test.rs

frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   └── __tests__/
│   │       └── Dashboard.test.tsx
├── e2e/
│   └── dashboard.spec.ts
└── tests/
    └── setup.ts
```

## Additional Resources

- [Rust Testing Documentation](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
