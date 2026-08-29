// Evidence collection for incidents

pub struct EvidenceCollector {
    evidence: Vec<Evidence>,
}

pub struct Evidence {
    pub id: String,
    pub evidence_type: EvidenceType,
    pub source: String,
    pub data: serde_json::Value,
    pub collected_at: chrono::DateTime<chrono::Utc>,
    pub hash: String,
}

pub enum EvidenceType {
    NetworkPacket,
    LogEntry,
    SystemState,
    MemoryDump,
    FileArtifact,
    Screenshot,
    Other(String),
}

impl EvidenceCollector {
    pub fn new() -> Self {
        Self {
            evidence: Vec::new(),
        }
    }

    pub fn collect(&mut self, evidence_type: EvidenceType, source: String, data: serde_json::Value) {
        let evidence = Evidence {
            id: uuid::Uuid::new_v4().to_string(),
            evidence_type,
            source,
            data,
            collected_at: chrono::Utc::now(),
            hash: String::new(), // TODO: Calculate hash
        };
        self.evidence.push(evidence);
    }

    pub fn get_evidence(&self, incident_id: &str) -> Vec<&Evidence> {
        // TODO: Filter evidence by incident
        vec![]
    }

    pub fn export_evidence(&self, format: ExportFormat) -> Result<String, String> {
        // TODO: Implement evidence export
        Err("Not implemented".to_string())
    }
}

pub enum ExportFormat {
    Json,
    Csv,
    Pdf,
    Zip,
}
