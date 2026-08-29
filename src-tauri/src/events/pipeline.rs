// Event processing pipeline

pub struct EventPipeline {
    processors: Vec<Box<dyn EventProcessor>>,
}

pub trait EventProcessor: Send + Sync {
    fn process(&self, event: &mut crate::events::event::Event) -> Result<(), String>;
}

impl EventPipeline {
    pub fn new() -> Self {
        Self {
            processors: Vec::new(),
        }
    }

    pub fn add_processor(&mut self, processor: Box<dyn EventProcessor>) {
        self.processors.push(processor);
    }

    pub fn process(&self, event: &mut crate::events::event::Event) -> Result<(), String> {
        for processor in &self.processors {
            processor.process(event)?;
        }
        Ok(())
    }
}
