export interface TrustedMember {
  id: string;
  name: string;
  distance: string;
  trustScore: number;
  isVerified: boolean;
  status: 'AVAILABLE' | 'BUSY' | 'EMERGENCY_ONLY' | 'INVISIBLE';
  occupation: string;
  role: 'Resident' | 'Student' | 'Volunteer' | 'Doctor' | 'Security Guard' | 'Apartment Committee';
  avatar: string; // MaterialCommunityIcons name for placeholder
  initials: string;
  bgColor: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  membersCount: number;
  icon: string; // MaterialCommunityIcons name
  status: 'JOINED' | 'NOT_JOINED';
}

export interface SafetyVolunteer {
  id: string;
  name: string;
  badge: string; // e.g. "Doctor", "NCC", "Civil Defence"
  distance: string;
  icon: string;
  color: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: string;
  color: string;
}

export const MOCK_TRUSTED_MEMBERS: TrustedMember[] = [
  {
    id: '1',
    name: 'Dr. Priya Nair',
    distance: '120m away',
    trustScore: 99,
    isVerified: true,
    status: 'AVAILABLE',
    occupation: 'Cardiologist • Resident',
    role: 'Doctor',
    avatar: 'doctor',
    initials: 'PN',
    bgColor: '#E0F2F1',
  },
  {
    id: '2',
    name: 'Rohan Deshmukh',
    distance: '250m away',
    trustScore: 97,
    isVerified: true,
    status: 'AVAILABLE',
    occupation: 'Apartment Secretary',
    role: 'Apartment Committee',
    avatar: 'account-tie',
    initials: 'RD',
    bgColor: '#E8F5E9',
  },
  {
    id: '3',
    name: 'Aisha Khan',
    distance: '310m away',
    trustScore: 95,
    isVerified: true,
    status: 'AVAILABLE',
    occupation: 'Red Cross Volunteer',
    role: 'Volunteer',
    avatar: 'hand-heart',
    initials: 'AK',
    bgColor: '#FFF3E0',
  },
  {
    id: '4',
    name: 'Sgt. Vikram Singh',
    distance: '480m away',
    trustScore: 98,
    isVerified: true,
    status: 'EMERGENCY_ONLY',
    occupation: 'Ex-Serviceman • Guard',
    role: 'Security Guard',
    avatar: 'shield-account',
    initials: 'VS',
    bgColor: '#FFEBEE',
  },
  {
    id: '5',
    name: 'Amit Sharma',
    distance: '750m away',
    trustScore: 92,
    isVerified: false,
    status: 'AVAILABLE',
    occupation: 'Engineering Student',
    role: 'Student',
    avatar: 'school',
    initials: 'AS',
    bgColor: '#E1F5FE',
  },
  {
    id: '6',
    name: 'Elena Rostova',
    distance: '900m away',
    trustScore: 94,
    isVerified: true,
    status: 'BUSY',
    occupation: 'Professional Resident',
    role: 'Resident',
    avatar: 'account',
    initials: 'ER',
    bgColor: '#F3E5F5',
  },
];

export const MOCK_COMMUNITY_GROUPS: CommunityGroup[] = [
  { id: '1', name: 'Apartment Community', membersCount: 142, icon: 'office-building', status: 'JOINED' },
  { id: '2', name: 'Street Watch Sector 4', membersCount: 88, icon: 'eye-outline', status: 'JOINED' },
  { id: '3', name: 'Women\'s Safety Grid', membersCount: 215, icon: 'shield-check-outline', status: 'NOT_JOINED' },
  { id: '4', name: 'College Hostel Net', membersCount: 64, icon: 'school-outline', status: 'NOT_JOINED' },
  { id: '5', name: 'Senior Citizens Circle', membersCount: 45, icon: 'account-heart-outline', status: 'NOT_JOINED' },
];

export const MOCK_SAFETY_VOLUNTEERS: SafetyVolunteer[] = [
  { id: '1', name: 'Dr. Priya Nair', badge: 'Doctor', distance: '120m', icon: 'doctor', color: '#00897B' },
  { id: '2', name: 'Rahul Varma', badge: 'NCC Cadet', distance: '400m', icon: 'shield-outline', color: '#039BE5' },
  { id: '3', name: 'Inspector Suresh (Retd.)', badge: 'Police Volunteer', distance: '600m', icon: 'police-badge', color: '#0D47A1' },
  { id: '4', name: 'Megha Sen', badge: 'NSS Volunteer', distance: '750m', icon: 'hand-heart', color: '#8E24AA' },
  { id: '5', name: 'Karan Malhotra', badge: 'Civil Defence Force', distance: '1.1km', icon: 'fire-truck', color: '#E65100' },
];

export const MOCK_COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  { id: '1', title: 'Road Blockage Cleared', detail: 'Fallen branch removed from main avenue gate by residents.', time: '2 hours ago', icon: 'tree', color: '#43A047' },
  { id: '2', title: 'Lost Child Reunited', detail: '6-year-old child found near park safely escorted back to block B.', time: 'Yesterday', icon: 'account-child', color: '#0D47A1' },
  { id: '3', title: 'Medical Assistance Logged', detail: 'CPR volunteer dispatched to Sector 2 block for elderly citizen aid.', time: '3 days ago', icon: 'heart-pulse', color: '#E53935' },
  { id: '4', title: 'Underpass Drain Unclogged', detail: 'Volunteer group cleared leaves to prevent flash flood logging.', time: '5 days ago', icon: 'water-off', color: '#00ACC1' },
  { id: '5', title: 'Power Grid Main restored', detail: 'Utility hazard reported and technician dispatched.', time: '1 week ago', icon: 'flash', color: '#FDD835' },
];

export const MOCK_REPUTATION_STATS = {
  trustScore: 98,
  rating: 4.9,
  reportsCount: 0,
  peopleHelped: 14,
  volunteerHours: 42,
};
