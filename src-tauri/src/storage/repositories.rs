// Placeholder for storage repositories
// TODO: Implement repository structures

pub struct Repository {
    pub name: String,
}

impl Default for Repository {
    fn default() -> Self {
        Self {
            name: String::new(),
        }
    }
}
