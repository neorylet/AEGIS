# Debugging Guide

**STATUS**: RECONCILED - Debugging techniques for development

This document provides debugging techniques and tools for the AEGIS system.

## Debugging the Backend (Rust)

### Using Rust Debugger

#### VS Code

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug AEGIS",
            "cargo": {
                "args": [
                    "build",
                    "--package=aegis"
                ],
                "filter": {
                    "name": "aegis",
                    "kind": "bin"
                }
            },
            "args": [],
            "cwd": "${workspaceFolder}/src-tauri"
        }
    ]
}
```

#### GDB

```bash
cd src-tauri
cargo build
gdb target/debug/aegis
```

Common GDB commands:
- `break main` - Set breakpoint at main
- `run` - Start program
- `next` - Step over
- `step` - Step into
- `print variable` - Print variable value
- `continue` - Continue execution
- `quit` - Exit GDB

#### LLDB (macOS)

```bash
cd src-tauri
cargo build
lldb target/debug/aegis
```

### Logging

#### Environment Variables

```bash
# Set log level
RUST_LOG=debug cargo run

# Set log level for specific module
RUST_LOG=aegis::sensor=debug cargo run

# Enable backtraces
RUST_BACKTRACE=1 cargo run
```

#### Structured Logging

```rust
use log::{info, debug, error};

fn main() {
    env_logger::init();
    
    info!("Starting AEGIS");
    debug!("Debug information");
    error!("Error occurred: {}", error);
}
```

### Common Rust Debugging Issues

#### Borrow Checker Errors

```rust
// Error: value borrowed after move
let data = vec![1, 2, 3];
let first = data[0];
let second = data; // Error: data was moved

// Solution: Clone if needed
let second = data.clone();
```

#### Panic Debugging

```bash
# Get full backtrace
RUST_BACKTRACE=full cargo run

# Analyze panic location
cargo run 2>&1 | grep "panicked"
```

#### Memory Issues

```bash
# Use valgrind on Linux
cargo build
valgrind --leak-check=full target/debug/aegis

# Use heap profiling
cargo install heaptrack
heaptrack target/debug/aegis
```

## Debugging the Frontend (React)

### Browser DevTools

#### Chrome DevTools

1. Open DevTools (F12)
2. Use **Console** for logging
3. Use **Network** for API debugging
4. Use **Sources** for breakpoints
5. Use **Performance** for profiling

#### React DevTools

Install React DevTools extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Debug Frontend",
            "url": "http://localhost:5173",
            "webRoot": "${workspaceFolder}/frontend/src"
        }
    ]
}
```

### Console Logging

```javascript
console.log('Debug message');
console.error('Error:', error);
console.warn('Warning:', warning);
console.table(data);
console.trace('Stack trace');
```

### Network Debugging

```javascript
// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    console.log('Fetch:', args);
    const response = await originalFetch(...args);
    console.log('Response:', response);
    return response;
};
```

## Debugging Tauri

### Tauri DevTools

```bash
# Enable devtools in development
npm run tauri dev
```

Press `F12` or `Ctrl+Shift+I` to open DevTools.

### Webview Debugging

```rust
// In src-tauri/src/main.rs
#[cfg(debug_assertions)]
{
    window.open_devtools();
}
```

### IPC Communication Debugging

```rust
// Log IPC messages
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        {
            let cmd = cmd.clone();
            println!("IPC Command: {:?}", cmd);
            cmd
        }
    ])
```

## Debugging Database Issues

### SQLite Debugging

```bash
# Open database
sqlite3 aegis.db

# List tables
.tables

# Query table
SELECT * FROM events LIMIT 10;

# Check database integrity
PRAGMA integrity_check;
```

### PostgreSQL Debugging

```bash
# Connect to database
psql -U aegis_user -d aegis

# List tables
\dt

# Query table
SELECT * FROM events LIMIT 10;

# Check connections
SELECT * FROM pg_stat_activity;
```

## Debugging Network Issues

### Packet Capture Debugging

```rust
// Enable packet capture logging
RUST_LOG=debug cargo run
```

### Network Interface Debugging

```bash
# List network interfaces
ip link show  # Linux
ifconfig      # macOS
ipconfig      # Windows

# Test packet capture
tcpdump -i eth0 -n  # Linux
tcpdump -i en0 -n   # macOS
```

## Debugging ML Components

### Python Debugging

```bash
# Use pdb
python -m pdb train.py

# Use ipython
ipython
%debug
```

### Jupyter Debugging

```python
# In Jupyter notebook
from IPython.core.debugger import set_trace
set_trace()
```

### Model Debugging

```python
# Print model predictions
print(f"Predictions: {predictions}")
print(f"Probabilities: {probabilities}")

# Visualize features
import matplotlib.pyplot as plt
plt.hist(features)
plt.show()
```

## Performance Debugging

### Rust Performance

```bash
# Use flamegraph
cargo install flamegraph
cargo flamegraph

# Use perf (Linux)
perf record -g target/release/aegis
perf report
```

### Frontend Performance

```javascript
// Measure performance
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Profile with Chrome DevTools
// Performance tab -> Record
```

## Common Issues and Solutions

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Lock

```bash
# Remove lock files
rm aegis.db-shm aegis.db-wal

# Check for open connections
lsof aegis.db
```

### Memory Leaks

```rust
// Use heaptrack
cargo install heaptrack
heaptrack target/release/aegis

# Analyze with heaptrack_gui
heaptrack_gui heaptrack.aegis.*
```

### Slow Build

```bash
# Use cargo check for faster builds
cargo check

# Use sccache for caching
cargo install sccache
export RUSTC_WRAPPER=sccache
```

## Remote Debugging

### VS Code Remote SSH

1. Install Remote SSH extension
2. Configure SSH host
3. Connect to remote
4. Debug as usual

### Tauri Remote Debugging

```rust
// Enable remote debugging
window.open_devtools();
```

## Logging Best Practices

### Structured Logging

```rust
use log::{info, warn, error};

info!("User {} logged in from {}", user_id, ip);
warn!("Failed login attempt for {}", username);
error!("Database connection failed: {}", error);
```

### Log Levels

- **ERROR**: Errors that need immediate attention
- **WARN**: Warning messages
- **INFO**: Informational messages
- **DEBUG**: Debug information
- **TRACE**: Very detailed trace information

### Log Rotation

```rust
// Use tracing-appender for log rotation
use tracing_appender::rolling;

let file_appender = rolling::daily("/var/log/aegis", "aegis.log");
let (non_blocking, _guard) = tracing_appender::non_blocking(file_appender);
```

## Debugging Tools

### Recommended Tools

**Rust**
- rust-analyzer (VS Code extension)
- GDB/LLDB (debuggers)
- valgrind (memory debugging)
- flamegraph (performance profiling)

**Frontend**
- React DevTools
- Chrome DevTools
- Redux DevTools (if using Redux)

**General**
- Wireshark (network debugging)
- Postman (API debugging)
- Docker (container debugging)

## Additional Resources

- [Rust Debugging Documentation](https://doc.rust-lang.org/book/ch09-01-unrecoverable-errors-with-panic.html)
- [React Debugging Documentation](https://react.dev/learn/debugging)
- [Tauri Debugging Documentation](https://tauri.app/v1/guides/debugging/)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
