// Event correlation module

pub mod correlator;
pub mod evidence;
pub mod graph;

use correlator::EventCorrelator;
use evidence::EvidenceCollector;
use graph::CorrelationGraph;
