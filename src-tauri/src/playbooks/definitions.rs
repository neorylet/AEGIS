// Placeholder for playbook definitions
// TODO: Implement playbook definition structures

pub struct PlaybookDefinition {
    pub id: String,
    pub name: String,
    pub description: String,
}

impl Default for PlaybookDefinition {
    fn default() -> Self {
        Self {
            id: String::new(),
            name: String::new(),
            description: String::new(),
        }
    }
}
