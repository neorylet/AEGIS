# Tests

This directory contains test suites for the AEGIS system.

## Structure

- **unit/**: Unit tests for individual components
- **integration/**: Integration tests for component interactions
- **system/**: System tests for complete workflows
- **detection/**: Detection engine tests
- **performance/**: Performance and load tests
- **security/**: Security vulnerability tests

## Running Tests

### All Tests

```bash
# Rust tests
cd src-tauri
cargo test

# Frontend tests
cd frontend
npm test

# E2E tests
cd frontend
npx playwright test
```

### Specific Test Suites

```bash
# Unit tests only
cargo test --lib

# Integration tests only
cargo test --test '*'

# Detection tests
cargo test detection

# Performance tests
cargo test --bench
```

## Test Coverage

### Generate Coverage Report

```bash
# Rust coverage
cargo tarpaulin --out Html

# Frontend coverage
cd frontend
npm test -- --coverage
```

## Test Data

Place test data in appropriate test directories:
- `tests/data/`: General test data
- `tests/pcaps/`: Packet capture files
- `tests/events/`: Sample events

## Continuous Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Scheduled runs

## Adding Tests

### Rust Unit Tests

Add tests in the same file as the code:
```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_function() {
        assert_eq!(function(), expected);
    }
}
```

### Frontend Tests

Add tests in `__tests__` directories:
```typescript
// component/__tests__/Component.test.tsx
describe('Component', () => {
  it('renders correctly', () => {
    // test implementation
  });
});
```
