# Database

This directory contains database schemas, migrations, and seeds for the AEGIS system.

## Structure

- **migrations/**: Database migration files
- **seeds/**: Seed data for development and testing
- **schemas/**: Database schema definitions

## Database Systems

### SQLite (Default)
Used for local and small deployments.

### PostgreSQL (Optional)
Used for distributed and production deployments.

## Migrations

### Running Migrations

```bash
# Using Rust
cd src-tauri
cargo run -- migrate

# Using SQL directly
sqlite3 aegis.db < migrations/001_initial.sql
```

### Migration Files

Migration files should be named with a sequential number:
- `001_initial.sql`
- `002_add_indexes.sql`
- `003_add_events_table.sql`

## Seeds

### Running Seeds

```bash
# Using Rust
cd src-tauri
cargo run -- seed

# Using SQL directly
sqlite3 aegis.db < seeds/sample_data.sql
```

### Seed Files

- `sample_data.sql`: Sample data for development
- `test_data.sql`: Data for testing
- `production_data.sql`: Production seed data (if needed)

## Schema

### Core Tables

- **events**: Security events
- **devices**: Network devices
- **flows**: Network flows
- **alerts**: Security alerts
- **incidents**: Security incidents
- **iocs**: Indicators of compromise
- **threat_intel**: Threat intelligence data

## Backup and Restore

### Backup

```bash
# SQLite
cp aegis.db aegis.db.backup

# PostgreSQL
pg_dump aegis > aegis_backup.sql
```

### Restore

```bash
# SQLite
cp aegis.db.backup aegis.db

# PostgreSQL
psql aegis < aegis_backup.sql
```

## Maintenance

### Vacuum (SQLite)

```bash
sqlite3 aegis.db "VACUUM;"
```

### Reindex (PostgreSQL)

```bash
psql aegis -c "REINDEX DATABASE aegis;"
```
