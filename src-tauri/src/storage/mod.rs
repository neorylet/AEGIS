use sqlx::sqlite::{SqlitePool, SqlitePoolOptions, SqliteConnectOptions};
use sqlx::Row;
use chrono::{DateTime, Utc};
use serde_json;
use crate::events::{EnrichedEvent, SecurityEvent};
use anyhow::Result;
use log::info;
use std::str::FromStr;
use std::path::Path;

pub struct DatabaseManager {
    pool: SqlitePool,
}

impl DatabaseManager {
    pub async fn new(database_url: &str) -> Result<Self, sqlx::Error> {
        info!("Connecting to database: {}", database_url);

        let path_str = database_url.trim_start_matches("sqlite:");
        if let Some(parent) = Path::new(path_str).parent() {
            std::fs::create_dir_all(parent).map_err(sqlx::Error::Io)?;
        }

        let options = SqliteConnectOptions::from_str(database_url)?
            .create_if_missing(true);

        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect_with(options)
            .await?;

        info!("Database connected, initializing tables...");
        Self::initialize_tables(&pool).await?;
        info!("Tables initialized successfully");
        Ok(Self { pool })
    }

    async fn initialize_tables(pool: &SqlitePool) -> Result<(), sqlx::Error> {
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                source TEXT NOT NULL,
                asset_id TEXT,
                event_type TEXT NOT NULL,
                event_data TEXT NOT NULL
            )",
        )
        .execute(pool)
        .await?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS assets (
                id TEXT PRIMARY KEY,
                first_seen TEXT NOT NULL,
                last_seen TEXT NOT NULL
            )",
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    pub async fn insert_event(&self, event: &EnrichedEvent) -> Result<(), anyhow::Error> {
        let event_type = match &event.event {
            SecurityEvent::Process(_) => "process",
            SecurityEvent::Network(_) => "network",
        };

        let event_data = serde_json::to_string(&event.event)?;

        sqlx::query(
            "INSERT INTO events (timestamp, source, asset_id, event_type, event_data)
             VALUES (?1, ?2, ?3, ?4, ?5)",
        )
        .bind(event.timestamp.to_rfc3339())
        .bind(&event.source)
        .bind(event.asset_id.clone().unwrap_or_else(|| "unknown".to_string()))
        .bind(event_type)
        .bind(&event_data)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_recent_events(&self, limit: usize) -> Result<Vec<EnrichedEvent>, anyhow::Error> {
        let rows = sqlx::query(
            "SELECT id, timestamp, source, asset_id, event_type, event_data
             FROM events ORDER BY timestamp DESC LIMIT ?1"
        )
        .bind(limit as i64)
        .fetch_all(&self.pool)
        .await?;

        let mut results = Vec::new();
        for row in rows {
            let id: i64 = row.get(0);
            let timestamp_str: String = row.get(1);
            let timestamp = DateTime::parse_from_rfc3339(&timestamp_str)
                .unwrap()
                .with_timezone(&Utc);
            let source: String = row.get(2);
            let asset_id: String = row.get(3);
            let event_data: String = row.get(5);

            let event: SecurityEvent = serde_json::from_str(&event_data)?;

            results.push(EnrichedEvent {
                id: Some(id),
                timestamp,
                source,
                asset_id: Some(asset_id),
                event,
            });
        }

        Ok(results)
    }

    pub async fn health_check(&self) -> Result<(), String> {
        Ok(())
    }
}