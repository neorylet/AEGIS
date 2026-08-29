// Detection engine module

pub mod rules;
pub mod statistics;
pub mod behavioral;
pub mod signatures;

use rules::RuleEngine;
use statistics::StatisticalAnalyzer;
use behavioral::BehavioralDetector;
use signatures::SignatureMatcher;
