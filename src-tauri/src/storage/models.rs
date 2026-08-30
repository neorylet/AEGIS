// Placeholder for storage models
// TODO: Implement data model structures

pub struct DataModel {
    pub table_name: String,
}

impl Default for DataModel {
    fn default() -> Self {
        Self {
            table_name: String::new(),
        }
    }
}
