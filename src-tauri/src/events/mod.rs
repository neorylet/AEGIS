// Event processing module

pub mod event;
pub mod normalizer;
pub mod pipeline;

use event::Event;
use normalizer::EventNormalizer;
use pipeline::EventPipeline;
