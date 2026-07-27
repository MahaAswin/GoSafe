export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  steps: string[];
}

export interface ImageAnalysisMock {
  key: 'accident' | 'fire' | 'flood' | 'road' | 'suspicious' | 'medical';
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  action: string;
}

export const MOCK_FIRST_AID: FirstAidGuide[] = [
  {
    id: '1',
    title: 'Cardiopulmonary Resuscitation (CPR)',
    icon: 'heart-flash',
    steps: [
      'Confirm the patient is unconscious and not breathing.',
      'Call emergency services immediately or ask someone else to call.',
      'Place heel of one hand in the center of the chest, other hand on top.',
      'Push hard and fast: 100-120 compressions per minute at 2 inches depth.',
      'Perform 30 compressions followed by 2 rescue breaths. Repeat until help arrives.',
    ],
  },
  {
    id: '2',
    title: 'Severe Burns Management',
    icon: 'fire',
    steps: [
      'Stop the burning process: Put out flames, remove hot materials.',
      'Cool the burn: Hold under cool running tap water for 10-20 minutes. Do not use ice.',
      'Remove jewelry or tight clothing before swelling starts.',
      'Cover loosely with clean plastic wrap or sterile non-stick bandage.',
      'Do not pop any blisters or apply butter/ointments.',
    ],
  },
  {
    id: '3',
    title: 'Fracture / Bone Break',
    icon: 'bone',
    steps: [
      'Keep the injured area completely still. Do not try to realign the bone.',
      'Stop any bleeding by applying direct pressure with sterile pad.',
      'Apply splints above and below the fractured joint if trained.',
      'Apply ice pack wrapped in towel to reduce local swelling.',
      'Elevate the limb if possible and check for signs of shock.',
    ],
  },
  {
    id: '4',
    title: 'Severe Bleeding Control',
    icon: 'water-redox',
    steps: [
      'Apply direct pressure to the wound with sterile gauze or clean cloth.',
      'Maintain pressure until bleeding stops or help arrives.',
      'Elevate the wound above heart level if possible.',
      'If blood seeps through, place another dressing on top; do not remove the original.',
    ],
  },
  {
    id: '5',
    title: 'Snake Bite Treatment',
    icon: 'snake',
    steps: [
      'Remain calm and move out of the snake strike radius.',
      'Keep the bitten limb still and position it below heart level.',
      'Remove rings, bracelets, or tight clothing immediately.',
      'Clean wound with water; do not cut the bite or attempt to suck venom.',
      'Note snake appearance and write down bite timestamp.',
    ],
  },
];

export const MOCK_IMAGE_ANALYSIS: ImageAnalysisMock[] = [
  {
    key: 'accident',
    title: 'Road Accident Photo',
    category: 'Road Collision / Accident',
    severity: 'HIGH',
    action: 'AI Scan reveals vehicular crash. Recommended Action: Dispatch local police patrol and call emergency ambulance services.',
  },
  {
    key: 'fire',
    title: 'Electrical Transformer Fire Photo',
    category: 'Fire Hazard',
    severity: 'CRITICAL',
    action: 'AI Scan reveals active building fire. Recommended Action: Alert fire dispatch immediately and evacuate within a 50m radius.',
  },
  {
    key: 'flood',
    title: 'Mayur Vihar Sub-tunnel Flood Photo',
    category: 'Waterlogging / Flood Risk',
    severity: 'HIGH',
    action: 'AI Scan reveals 1.5ft water log inside sub-tunnel. Recommended Action: Do not drive. Avoid low elevation underpasses.',
  },
  {
    key: 'suspicious',
    title: 'Abandoned Backpack Photo',
    category: 'Suspicious Object / Threat',
    severity: 'MEDIUM',
    action: 'AI Scan reveals unattended package in crowded terminal. Recommended Action: Do not touch. Inform nearest metro security staff.',
  },
];

export const MOCK_QUICK_ACTIONS = [
  { label: 'Report Incident', action: 'report', icon: 'alert-decagram' },
  { label: 'Find Safe Route', action: 'route', icon: 'map-marker-path' },
  { label: 'First Aid Guides', action: 'first_aid', icon: 'medical-bag' },
  { label: 'Nearest Police Line', action: 'police', icon: 'police-badge' },
];
