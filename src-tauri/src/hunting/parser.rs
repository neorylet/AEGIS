// Hunting query parser

pub struct HuntingQueryParser;

impl HuntingQueryParser {
    pub fn parse(&self, query: &str) -> Result<HuntingQuery, String> {
        // TODO: Implement query parsing
        Ok(HuntingQuery {
            filters: Vec::new(),
            time_range: None,
            limit: 100,
        })
    }

    pub fn validate_syntax(&self, query: &str) -> Result<(), String> {
        // TODO: Implement syntax validation
        Ok(())
    }
}

pub struct HuntingQuery {
    pub filters: Vec<QueryFilter>,
    pub time_range: Option<(chrono::DateTime<chrono::Utc>, chrono::DateTime<chrono::Utc>)>,
    pub limit: usize,
}

pub struct QueryFilter {
    pub field: String,
    pub operator: FilterOperator,
    pub value: String,
}

pub enum FilterOperator {
    Equals,
    NotEquals,
    Contains,
    NotContains,
    GreaterThan,
    LessThan,
    Regex,
}
