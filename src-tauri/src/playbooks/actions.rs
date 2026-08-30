// Placeholder for playbook actions
// TODO: Implement playbook action structures

pub struct PlaybookAction {
    pub id: String,
    pub action_type: String,
}

impl Default for PlaybookAction {
    fn default() -> Self {
        Self {
            id: String::new(),
            action_type: String::new(),
        }
    }
}
