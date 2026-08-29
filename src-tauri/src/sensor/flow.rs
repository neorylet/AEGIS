// Flow management for tracking network connections

pub struct FlowManager {
    flows: Vec<NetworkFlow>,
}

pub struct NetworkFlow {
    pub source_ip: String,
    pub destination_ip: String,
    pub source_port: u16,
    pub destination_port: u16,
    pub protocol: String,
    pub bytes_sent: u64,
    pub bytes_received: u64,
}

impl FlowManager {
    pub fn new() -> Self {
        Self {
            flows: Vec::new(),
        }
    }

    pub fn add_flow(&mut self, flow: NetworkFlow) {
        self.flows.push(flow);
    }

    pub fn get_flows(&self) -> &[NetworkFlow] {
        &self.flows
    }
}
