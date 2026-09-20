import { ClinicalDispatch, OutbreakMetric } from './types';

export const EPIDEMIC_WATCH_BANNER = {
  level: 'GLOBAL EPIDEMIC WATCH LEVEL 2',
  pathogen: 'Avian Influenza A(H5N1) Clade 2.3.4.4b Spillover Monitoring',
  advisory: 'WHO/CDC Advisory #094-Rev4',
  tag: 'HIGH CLINICAL VIGILANCE',
  pdfLink: '#',
};

export const CLINICAL_METRICS: OutbreakMetric[] = [
  {
    title: 'EPIDEMIC OUTBREAK ALERTS',
    count: 14,
    badge: '+2 escalated (48h)',
    badgeType: 'danger',
    subtitle: 'Active PHEIC / Grade 3 humanitarian health alerts monitored in real-time.',
  },
  {
    title: 'CRITICAL DRUG & DEVICE RECALLS',
    count: 3,
    badge: 'Class I Severity (FDA/EMA)',
    badgeType: 'danger',
    subtitle: 'Immediate hospital pharmacy and crash cart quarantine action mandates.',
  },
  {
    title: 'TRAUMA PROTOCOLS',
    count: 19,
    subtitle: 'Lancet / NEJM',
  },
  {
    title: 'CLINICAL TRIALS',
    count: 142,
    subtitle: 'Phase II/III Verified',
  },
];

export const CLINICAL_DISPATCHES: ClinicalDispatch[] = [
  {
    id: 'disp-01',
    category: 'CRITICAL OUTBREAK',
    source: 'WHO Geneva • Field Dispatch',
    timestampAgo: '18m ago',
    verificationBadge: 'Verified GOARN',
    title: 'WHO Issues Updated Infection Prevention & Clinical Management Protocol for Marburg Virus in Equatorial Guinea',
    summary:
      'Following 8 newly laboratory-confirmed transmissions across Kie-Ntem and Litoral provinces, the WHO Health Emergencies Programme has upgraded triage PPE directives to full viral hemorrhagic fever isolation level. Emergency wards are instructed on differential diagnosis against severe malaria and dengue shock syndrome.',
    emergencyTakeaways: [
      'Suspect patients presenting with sudden onset high fever, severe malaise, and rapid gastrointestinal hemorrhage.',
      'Initiate strict barrier nursing with double gloving, N95/FFP3 respiratory seal, and fluid-resistant impervious gowns.',
      'Absolute contraindication: Avoid intramuscular injections and NSAIDs due to platelet coagulopathy risk.',
    ],
    icdCode: 'ICD-11: 1D61.0',
    advisoryCode: 'WHO Bulletin #MVD-2026-08',
    actionButtonText: 'View Full Advisory',
    actionButtonType: 'primary',
  },
  {
    id: 'disp-02',
    category: 'BREAKTHROUGH THERAPEUTIC',
    source: 'FDA Newsroom / NEJM',
    timestampAgo: '1h ago',
    verificationBadge: 'Fast-Track 505(b)(2)',
    title: 'FDA Grants Fast-Track Approval for Nalmefene-Derivatized Dual Antidote for Synthetic Fentanyl & Nitazene Overdoses',
    summary:
      'The therapeutic demonstrates an 11-hour mu-opioid receptor dissociation half-life, explicitly eliminating the fatal "renarcotization" window commonly seen with ultra-potent illicit synthetic opioids where standard naloxone rapidly clears within 60 minutes.',
    paramedicDosing: {
      dose: '3.0 mg / 0.1 mL intranasal auto-actuator; repeat at 4 mins if SpO2 < 90% or RR < 8/min.',
      reboundProfile: '0.4% post-resuscitation renarcotization rate vs 14.8% baseline control cohort.',
    },
    actionButtonText: 'EMT Dosage Guideline',
    actionButtonType: 'primary',
  },
  {
    id: 'disp-03',
    category: 'PEER REVIEWED CLINICAL TRIAL',
    source: 'The Lancet Global Health',
    timestampAgo: '3h ago',
    verificationBadge: 'Multi-Center RCT',
    title: 'Pre-Hospital Low-Titer O+ Whole Blood Transfusions Reduce 30-Day Exsanguination Mortality by 34% in Severe Trauma',
    summary:
      'Data from 2,840 civilian trauma activations across 14 helicopter EMS services confirm that cold-stored low-titer O-positive whole blood administration during initial transport significantly outperforms conventional 1:1:1 component therapy in preventing trauma-induced coagulopathy (TIC).',
    recommendation:
      'Trauma Directorate Recommendation: Immediate adoption of rapid isothermal 4°C tactical coolers on all paramedic fly-cars and urban rescue units.',
    icdCode: 'DOI: 10.1016/S0140-6736(25)00412-X',
    actionButtonText: 'Read Clinical Study',
    actionButtonType: 'outline',
  },
  {
    id: 'disp-04',
    category: 'CLASS I SAFETY RECALL',
    source: 'EMA / Health Canada / MHRA',
    timestampAgo: '4h ago',
    verificationBadge: 'Immediate Quarantine',
    title: 'Immediate Quarantine: Contaminated 0.9% Pediatric Saline Inhalation Vials (Batch #NL-9942 & #NL-9948)',
    summary:
      'Hospital pharmacies, NICUs, and respiratory therapy departments must inspect and impound all stock of 5mL unit-dose nebulizer vials manufactured by Apex Pharma due to confirmed presence of Burkholderia cepacia complex.',
    emergencyTakeaways: [
      'NDC: 68462-105-05 | Affected Expiry: 11/2026 | Distributed: 18 European & NA Hospital Systems',
    ],
    actionButtonText: 'Print Pharmacy Checklist',
    actionButtonType: 'danger',
  },
];

export const TRUST_MATRIX = [
  { name: 'WHO Global Outbreak Hub', score: '100% Trust Index' },
  { name: 'CDC Epidemic Intelligence (EIS)', score: '100% Trust Index' },
  { name: 'PubMed / Cochrane Systematic', score: 'Grade A Evidence' },
  { name: 'Reuters Medical Newsdesk', score: 'Journalistic Wire' },
];

export const TRENDING_VECTORS = [
  '#H5N1AvianSpillover',
  '#GLP1CardioTrials',
  '#MarburgIsolation',
  '#PreHospitalWholeBlood',
  '#SyntheticOpioidAntidotes',
  '#PediatricRecalls',
];
