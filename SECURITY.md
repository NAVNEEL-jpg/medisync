# 🛡️ MediSync Security & Privacy Policy

Healthcare systems manage sensitive Protected Health Information (PHI) and Personally Identifiable Information (PII). MediSync is designed around the principles of **Privacy by Design**, **Zero Trust Architecture**, and the **Principle of Least Privilege**.

---

## 1. Compliance Alignment

MediSync’s data models and access patterns are architectured to align with:
* **Digital Personal Data Protection Act (DPDP Act, 2023 - India)**
* **Ayushman Bharat Digital Mission (ABDM) Data Privacy Framework**
* **HL7 FHIR v4.3 Security & Audit Guidelines**
* **ISO 27799: Health Informatics — Information Security Management in Health**

---

## 2. Threat Model & Mitigations

### 2.1 Threat: Uncontrolled Access to Emergency Medical Records
* **Risk**: Malicious actors scanning a patient's emergency QR to extract comprehensive medical history.
* **Mitigation**: 
  - The unauthenticated Emergency HUD exposes **only life-critical emergency triage data**: Blood Group, Severe Allergies (Anaphylaxis risks), Major Implants (Pacemaker MRI risks), DNR/Organ Donor status, and Emergency Contact numbers.
  - Granular diagnostic records, clinical doctor notes, complete prescription histories, and psychiatric data are strictly protected and require verified clinical login.

### 2.2 Threat: Unauthorized Doctor Impersonation
* **Risk**: Unverified accounts accessing deep patient vaults.
* **Mitigation**: 
  - Clinician registration requires a valid Medical Council of India (MCI) or National Medical Commission (NMC) registration number.
  - Every access attempt is appended to an immutable access audit log (`AccessAuditLog`) recording timestamp, facility name, and accessor license.

### 2.3 Threat: Data Tampering in Transit & at Rest
* **Risk**: Interception or unauthorized modification of vital signs or prescription data.
* **Mitigation**:
  - All communication is enforced over **TLS 1.3** with strict HSTS headers.
  - Cloud database persistence utilizes **AES-256 field-level encryption** at rest.

---

## 3. Role-Based Access Control (RBAC)

| Data Category | Citizen (Self) | Emergency Doctor | Paramedic | Nominee / Kin | Public Scan (QR) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Emergency Vitals & Blood Group** | Full | Full | Read-Only | Read-Only | Read-Only |
| **Severe Allergies & Anaphylaxis Alerts** | Full | Full | Read-Only | Read-Only | Read-Only |
| **Surgical Implants & MRI Safety** | Full | Full | Read-Only | Read-Only | Read-Only |
| **Emergency Contacts & Nominees** | Full | Read-Only | Read-Only | Read-Only | Read-Only |
| **Full Prescription History** | Full | Full (Read/Write) | Restricted | Restricted | ❌ No Access |
| **Detailed Lab Diagnostics & Reports**| Full | Full (Read/Write) | Restricted | Restricted | ❌ No Access |
| **Financial / Card Referral Ledger** | Full | Read-Only | ❌ No Access | ❌ No Access | ❌ No Access |

---

## 4. Responsible Vulnerability Disclosure

If you identify a security vulnerability or privacy flaw within MediSync, please report it responsibly:

1. **Email**: Send detailed vulnerability reports to `security@medisync.health` (or open an issue marked `[SECURITY]` in this repository).
2. **Details to Include**:
   - Description of the vulnerability and attack vector.
   - Proof of Concept (PoC) or reproduction steps.
   - Potential impact on PHI or emergency services.
3. **Response Time**: The maintainers commit to acknowledging security reports within **24 hours** and providing remediation timelines within **72 hours**.
4. **Public Disclosure**: We kindly request that you do not publicly disclose vulnerabilities until our team has deployed a verified security patch.
