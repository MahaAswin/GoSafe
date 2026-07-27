export interface EmergencyContact {
  id: string;
  name: string;
  relation: 'Family' | 'Friend' | 'Guardian' | 'Office' | 'Doctor';
  phone: string;
  initials: string;
  bgColor: string;
}

export interface EmergencyOption {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name
  color: string;
  tips: string[];
}

export interface NearbyResponder {
  id: string;
  name: string;
  type: 'Police' | 'Hospital' | 'Fire Station';
  distance: string;
  eta: string;
  icon: string;
}

export interface SosHistoryItem {
  id: string;
  time: string;
  type: 'Resolved' | 'False Alarm' | 'Cancelled';
  detail: string;
  color: string;
}

export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Sarah Connor', relation: 'Family', phone: '+1 555-0199', initials: 'SC', bgColor: '#FFEBEE' },
  { id: '2', name: 'John Doe', relation: 'Friend', phone: '+1 555-0188', initials: 'JD', bgColor: '#E1F5FE' },
  { id: '3', name: 'Uncle Bob', relation: 'Guardian', phone: '+1 555-0177', initials: 'UB', bgColor: '#E8F5E9' },
  { id: '4', name: 'Office Helpline', relation: 'Office', phone: '+1 555-0155', initials: 'OH', bgColor: '#FFF3E0' },
  { id: '5', name: 'Dr. House', relation: 'Doctor', phone: '+1 555-0100', initials: 'DH', bgColor: '#E0F2F1' },
];

export const MOCK_EMERGENCY_OPTIONS: EmergencyOption[] = [
  {
    id: 'MEDICAL',
    name: 'Medical Emergency',
    icon: 'ambulance',
    color: '#00897B',
    tips: [
      'Call local ambulance dispatch immediately.',
      'Do not move the patient unless there is immediate danger (e.g. fire).',
      'Keep patient warm and check if they are breathing.',
    ],
  },
  {
    id: 'CRIME',
    name: 'Crime / Threat',
    icon: 'shield-alert',
    color: '#D32F2F',
    tips: [
      'Find a safe, populated, and well-lit area.',
      'Do not attempt to confront the offender.',
      'Note physical details or direction of escape.',
    ],
  },
  {
    id: 'ACCIDENT',
    name: 'Road Accident',
    icon: 'car-emergency',
    color: '#E53935',
    tips: [
      'Turn on your vehicle hazards and place emergency triangles.',
      'Check for personal or peer injuries.',
      'Call police patrol and keep traffic flow visible.',
    ],
  },
  {
    id: 'FIRE',
    name: 'Fire / Smoke',
    icon: 'fire',
    color: '#F4511E',
    tips: [
      'Stay close to the floor to avoid inhaling heavy smoke.',
      'Feel doors before opening; do not open if they are warm.',
      'Evacuate immediately; do not return for valuables.',
    ],
  },
  {
    id: 'FLOOD',
    name: 'Flood / Water log',
    icon: 'water',
    color: '#1E88E5',
    tips: [
      'Never drive or walk through moving water.',
      'Move to higher ground immediately.',
      'Avoid touch with loose electrical power lines.',
    ],
  },
  {
    id: 'WOMEN_SAFETY',
    name: 'Women Safety',
    icon: 'gender-female',
    color: '#8E24AA',
    tips: [
      'Move to a secure location (e.g. store, metro, police booth).',
      'Trigger quick audio evidence capturing.',
      'Share live tracking link immediately to guardians.',
    ],
  },
  {
    id: 'CHILD_SAFETY',
    name: 'Child Safety',
    icon: 'account-child-outline',
    color: '#039BE5',
    tips: [
      'Alert nearby safety mesh volunteers instantly.',
      'Broadcasting child details to local community watch.',
    ],
  },
  {
    id: 'SENIOR_CITIZEN',
    name: 'Senior Citizen Aid',
    icon: 'human-cane',
    color: '#5E35B1',
    tips: [
      'Stay calm. Responders will guide you over phone.',
      'Sit or lie down if feeling dizzy or faint.',
    ],
  },
  {
    id: 'ANIMAL_ATTACK',
    name: 'Animal Attack',
    icon: 'paw',
    color: '#8D6E63',
    tips: [
      'Avoid direct eye contact with the animal.',
      'Back away slowly; do not turn and run.',
    ],
  },
  {
    id: 'OTHER',
    name: 'Other Danger',
    icon: 'dots-horizontal',
    color: '#00ACC1',
    tips: [
      'Assess threats calmly.',
      'Stay connected; keep your phone battery active.',
    ],
  },
];

export const MOCK_NEARBY_RESPONDERS: NearbyResponder[] = [
  { id: '1', name: 'Sector 4 Police Station', type: 'Police', distance: '600m away', eta: '4 min', icon: 'police-badge' },
  { id: '2', name: 'Metro General Hospital', type: 'Hospital', distance: '1.2km away', eta: '7 min', icon: 'hospital-building' },
  { id: '3', name: 'City Fire Station HQ', type: 'Fire Station', distance: '2.4km away', eta: '10 min', icon: 'fire-truck' },
];

export const MOCK_SOS_HISTORY: SosHistoryItem[] = [
  { id: '1', time: 'Yesterday, 8:45 PM', type: 'Resolved', detail: 'Medical Emergency alert. Ambulance dispatched.', color: '#2E7D32' },
  { id: '2', time: '3 days ago, 11:20 AM', type: 'Cancelled', detail: 'Accident trigger. User revoked alert within 10 seconds.', color: '#757575' },
  { id: '3', time: '1 week ago, 9:15 PM', type: 'False Alarm', detail: 'Accidental trigger during device lock.', color: '#FB8C00' },
];
