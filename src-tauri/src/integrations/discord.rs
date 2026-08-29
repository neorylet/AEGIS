// Discord integration

pub struct DiscordClient {
    webhook_url: String,
}

impl DiscordClient {
    pub fn new(webhook_url: String) -> Self {
        Self { webhook_url }
    }

    pub async fn send_alert(&self, message: &str) -> Result<(), String> {
        // TODO: Implement alert sending
        Ok(())
    }

    pub async fn send_incident_update(&self, incident: &crate::incidents::incident::Incident) -> Result<(), String> {
        // TODO: Implement incident update sending
        Ok(())
    }

    pub async fn send_embed(&self, title: &str, description: &str, fields: Vec<(String, String)>) -> Result<(), String> {
        // TODO: Implement embed sending
        Ok(())
    }
}
