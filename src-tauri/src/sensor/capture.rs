// Packet capture implementation

pub struct PacketCapture {
    interface: String,
    active: bool,
}

impl PacketCapture {
    pub fn new(interface: String) -> Self {
        Self {
            interface,
            active: false,
        }
    }

    pub fn start(&mut self) -> Result<(), String> {
        self.active = true;
        Ok(())
    }

    pub fn stop(&mut self) -> Result<(), String> {
        self.active = false;
        Ok(())
    }
}
