# Research Status

This document tracks research topics relevant to AEGIS, their status, and their relationship to system components.

## Research Categories

- **REQUIRED**: Research required for AEGIS implementation
- **RELEVANT**: Research relevant but not required
- **CONSIDERED**: Being considered for inclusion
- **FUTURE**: Potential future enhancement
- **OUT OF SCOPE**: Explicitly not part of current project
- **UNVERIFIED**: Citations require verification

---

## Research Topics

### Network Security Monitoring

#### Classical IDS Approaches

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Anderson (1980) Threat Monitoring Framework | Detection | Foundation of IDS concepts | Historical context | RELEVANT |
| Denning (1987) Intrusion Detection Model | Detection | Anomaly detection concepts | Statistical baseline methods | RELEVANT |
| Kumar (1995) Classification and Detection | Detection | Signature-based detection methodology | Pattern matching techniques | RELEVANT |

#### Modern IDS Approaches

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Buczak & Guven (2016) ML for IDS | Detection | ML technique survey | Supervised/unsupervised methods | CONSIDERED |
| Vinayakumar et al. (2019) Deep Learning for IDS | Detection | Deep learning applications | CNN/LSTM for IDS | FUTURE |

### Anomaly Detection

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Chandola et al. (2009) Anomaly Detection Survey | Behavioral Analysis | Anomaly detection techniques | Classification of methods | RELEVANT |
| Aggarwal (2017) Outlier Analysis | Behavioral Analysis | Statistical/ML-based detection | High-dimensional data techniques | RELEVANT |

### Behavioral Analysis

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Garg et al. (2020) User Behavior Analytics | Behavioral Analysis | UBA techniques | Feature engineering for user behavior | CONSIDERED |
| Elish et al. (2020) Entity Behavior Analytics | Behavioral Analysis | EBA techniques | Entity-based threat detection | CONSIDERED |
| April et al. (2018) Entity Behavior Analytics | Behavioral Analysis | Graph-based approaches | Real-time analytics | CONSIDERED |

### Threat Intelligence

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Barnum (2012) STIX and TAXII | Threat Intelligence | Threat intelligence sharing | Framework for sharing | RELEVANT |
| Tounsi & Rais (2018) Technical Threat Intelligence | Threat Intelligence | Threat intelligence lifecycle | Collection and analysis techniques | RELEVANT |
| Strom et al. (2018) MITRE ATT&CK | Threat Intelligence | Adversarial behavior modeling | Application in threat detection | RELEVANT |

### Network Forensics

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Sekar & Guang (2019) Packet Capture Technologies | Sensor | High-speed packet capture | Hardware acceleration | RELEVANT |
| Casey (2011) Digital Forensics | Evidence Collection | Evidence collection methodologies | Chain of custody | RELEVANT |

### Automated Response

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Wichers et al. (2015) Automated Incident Response | Response | Automated response frameworks | Playbook-based approaches | RELEVANT |
| Almorsy et al. (2019) Automated Security Response in Cloud | Response | Cloud-specific response | Orchestration frameworks | FUTURE |

### Risk Assessment

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Hubbard (2009) Failure of Risk Management | Risk Assessment | Quantitative risk assessment | Quantitative methods | RELEVANT |
| Jones (2019) Measuring and Managing Information Risk | Risk Assessment | FAIR approach | Risk communication | RELEVANT |

### Network Fingerprinting

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Arackaparambil et al. (2010) Host Fingerprinting | Behavioral Analysis | Passive device fingerprinting | OS fingerprinting techniques | CONSIDERED |
| Mowery & Shacham (2012) Pixel Perfect | Behavioral Analysis | Browser fingerprinting | Canvas-based techniques | OUT OF SCOPE |
| Yen et al. (2013) Host Fingerprinting and Tracking | Behavioral Analysis | Behavioral fingerprinting | Privacy analysis | CONSIDERED |

### Graph-Based Security

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Noel et al. (2005) Minimum-Cost Network Hardening | Correlation | Attack graph methodologies | Network hardening strategies | RELEVANT |
| Jajodia et al. (2011) Topological Analysis of Network Attack Vulnerability | Correlation | Graph-based vulnerability analysis | Attack path identification | RELEVANT |

### Time Series Analysis

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Lakhina et al. (2004) Diagnosing Network-Wide Traffic Anomalies | Behavioral Analysis | PCA-based anomaly detection | Network-wide analysis | RELEVANT |
| Barford et al. (2002) A Signal Analysis of Network Traffic Anomalies | Behavioral Analysis | Signal processing techniques | Wavelet analysis | RELEVANT |

### Privacy-Preserving Security

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Dwork & Roth (2014) The Algorithmic Foundations of Differential Privacy | Security | Privacy-preserving analytics | Privacy vs utility trade-offs | FUTURE |
| McMahan et al. (2017) Communication-Efficient Learning of Deep Networks | ML | Privacy-preserving ML | Distributed training | FUTURE |

### Benchmark Datasets

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Tavallaee et al. (2009) KDD Cup 99 Data Set | Detection | Historical dataset analysis | Limitations and biases | RELEVANT |
| Moustafa & Slay (2017) UNSW-NB15 | Detection | Modern traffic patterns | Evaluation methodologies | RELEVANT |

### Emerging Trends

| Topic | AEGIS Component | Why Needed | Evidence | Status |
| ----- | --------------- | ---------- | -------- | ------ |
| Berman et al. (2019) Artificial Intelligence in Cybersecurity | General | AI applications in cybersecurity | Current state and future directions | FUTURE |
| Cao et al. (2020) Quantum Computing in Cybersecurity | General | Quantum threats to cryptography | Post-quantum cryptography | OUT OF SCOPE |

---

## Citation Verification Status

### Verified Citations

The following citations have been verified as accurate:
- Anderson (1980)
- Denning (1987)
- Kumar (1995)
- Chandola et al. (2009)
- Aggarwal (2017)
- Barnum (2012)
- Tounsi & Rais (2018)
- Strom et al. (2018)
- Casey (2011)
- Hubbard (2009)
- Dwork & Roth (2014)
- McMahan et al. (2017)
- Tavallaee et al. (2009)
- Moustafa & Slay (2017)

### Unverified Citations

The following citations require verification before use in final capstone:
- Buczak & Guven (2016) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Vinayakumar et al. (2019) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Garg et al. (2020) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Elish et al. (2020) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- April et al. (2018) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Sekar & Guang (2019) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Wichers et al. (2015) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Almorsy et al. (2019) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Jones (2019) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Arackaparambil et al. (2010) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Mowery & Shacham (2012) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Yen et al. (2013) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Noel et al. (2005) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Jajodia et al. (2011) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Lakhina et al. (2004) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Barford et al. (2002) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Berman et al. (2019) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE
- Cao et al. (2020) - UNVERIFIED — DO NOT USE IN FINAL CAPSTONE

---

## Research Priorities

### High Priority (Required for Implementation)

1. **Anomaly Detection Techniques** - Behavioral Analysis component
2. **MITRE ATT&CK Integration** - Threat Intelligence component
3. **Attack Graph Analysis** - Correlation component
4. **Quantitative Risk Assessment** - Risk Assessment component

### Medium Priority (Considered for Implementation)

1. **User/Entity Behavior Analytics** - Behavioral Analysis component
2. **Network Fingerprinting** - Behavioral Analysis component
3. **Automated Response Frameworks** - Response component

### Low Priority (Future Consideration)

1. **Deep Learning for IDS** - Detection component
2. **Privacy-Preserving Security** - Security component
3. **Quantum Computing Impact** - General (likely out of scope)

---

## Research Gaps

### Missing Research

The following areas may require additional research:

1. **Real-time Anomaly Detection** - Specific techniques for high-speed networks
2. **Explainable AI for Security** - Methods for explaining ML-based detections
3. **Correlation Algorithm Selection** - Comparative analysis of correlation approaches
4. **Risk Assessment Formulas** - Quantitative risk assessment methodologies
5. **Response Safety** - Research on safe automated response mechanisms

### Outdated Research

The following research may be outdated:

1. **KDD Cup 99 Dataset** - Dataset is from 1999, may not reflect modern traffic
2. **Classical IDS Approaches** - May not reflect modern threat landscape

---

## Next Steps

1. **Verify Citations**: Verify all unverified citations before using in final capstone
2. **Prioritize Research**: Focus on high-priority research topics first
3. **Fill Gaps**: Conduct additional research in identified gap areas
4. **Update Status**: Regularly update research status as decisions are made
5. **Remove Out of Scope**: Remove research topics that are determined to be out of scope

---

## Document Control

**Status**: Active

**Last Updated**: 2024-01-15

**Next Review**: TBD

**Maintained By**: AEGIS Team
