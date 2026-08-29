// Incident management

pub struct IncidentManager {
    incidents: Vec<Incident>,
}

pub struct Incident {
    pub id: String,
    pub title: String,
    pub description: String,
    pub severity: IncidentSeverity,
    pub status: IncidentStatus,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub assigned_to: Option<String>,
    pub related_events: Vec<String>,
    pub tags: Vec<String>,
}

pub enum IncidentSeverity {
    Low,
    Medium,
    High,
    Critical,
}

pub enum IncidentStatus {
    Open,
    InProgress,
    Resolved,
    Closed,
}

impl IncidentManager {
    pub fn new() -> Self {
        Self {
            incidents: Vec::new(),
        }
    }

    pub fn create_incident(&mut self, title: String, description: String) -> Incident {
        let incident = Incident {
            id: uuid::Uuid::new_v4().to_string(),
            title,
            description,
            severity: IncidentSeverity::Medium,
            status: IncidentStatus::Open,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
            assigned_to: None,
            related_events: Vec::new(),
            tags: Vec::new(),
        };
        self.incidents.push(incident.clone());
        incident
    }

    pub fn get_incident(&self, id: &str) -> Option<&Incident> {
        self.incidents.iter().find(|i| i.id == id)
    }

    pub fn update_status(&mut self, id: &str, status: IncidentStatus) -> Result<(), String> {
        if let Some(incident) = self.incidents.iter_mut().find(|i| i.id == id) {
            incident.status = status;
            incident.updated_at = chrono::Utc::now();
            Ok(())
        } else {
            Err("Incident not found".to_string())
        }
    }
}
