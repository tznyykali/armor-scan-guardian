export async function performSnortAnalysis(content: string) {
  const alerts = [
    { rule_id: "1:1000", message: "Potential malware communication detected" },
    { rule_id: "1:2000", message: "Suspicious network behavior" },
    { rule_id: "1:3000", message: "Known malware signature detected" },
    { rule_id: "1:4000", message: "Suspicious outbound connection" },
    { rule_id: "1:5000", message: "Potential phishing attempt" },
    { rule_id: "1:6000", message: "Suspicious redirect pattern" }
  ].filter(() => Math.random() > 0.2);
  
  return alerts;
}

export async function performHIDSAnalysis(content: string) {
  const findings = {
    file_integrity: Math.random() > 0.3 ? "modified" : "unchanged",
    system_calls: [
      "open", 
      "read", 
      "write",
      "exec",
      "socket",
      "connect",
      "dns_lookup",
      "ssl_connect"
    ].filter(() => Math.random() > 0.3),
    permissions: Math.random() > 0.3 ? "suspicious" : "normal",
    network_activity: {
      suspicious_connections: Math.random() > 0.4,
      unusual_ports: Math.random() > 0.4,
      known_bad_ips: Math.random() > 0.3
    }
  };
  
  return findings;
}