// Incident management module

pub mod incident;
pub mod timeline;
pub mod severity;

use incident::IncidentManager;
use timeline::TimelineBuilder;
use severity::SeverityCalculator;
