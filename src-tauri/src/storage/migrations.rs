// Placeholder for database migrations
// TODO: Implement migration structures

pub struct Migration {
    pub version: i32,
    pub name: String,
}

impl Default for Migration {
    fn default() -> Self {
        Self {
            version: 0,
            name: String::new(),
        }
    }
}
