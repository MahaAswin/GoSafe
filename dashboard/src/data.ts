export interface StatCardData {
  title: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
}

export interface LiveIncidentMarker {
  id: string;
  title: string;
  type: 'Accident' | 'Fire' | 'Flood' | 'Crime' | 'Medical' | 'Suspicious' | 'Road Damage';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lat: number; // percentage coordinate on mock grid
  lng: number; // percentage coordinate on mock grid
  time: string;
  witnessCount: number;
  reporter: string;
  assignedUnit: string;
  details: string;
}

export interface AirRiskZone {
  id: string;
  area: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'SAFE';
  type: string;
  alert: string;
}

export interface SosQueueItem {
  id: string;
  citizenName: string;
  emergencyType: 'Medical' | 'Crime' | 'Road Accident' | 'Fire' | 'Flood';
  location: string;
  lat: number;
  lng: number;
  time: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED' | 'FALSE_ALARM';
  assignedUnit?: string;
  battery: string;
}

export interface ResourceUnit {
  id: string;
  name: string;
  type: 'Police Vehicle' | 'Ambulance' | 'Fire Truck' | 'Community Volunteer' | 'Medical Team';
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  operator: string;
  contact: string;
}

export interface CommunityVolunteer {
  id: string;
  name: string;
  badge: 'Doctor' | 'Nurse' | 'Apartment Security' | 'NCC' | 'NSS' | 'Civil Defence';
  status: 'ONLINE' | 'ACTIVE' | 'OFFLINE';
  distance: string;
}

export interface ActivityTimelineItem {
  id: string;
  time: string;
  action: string;
  status: string;
  team: string;
}

export const INITIAL_STATS: StatCardData[] = [
  { title: 'Active SOS Alarms', count: 3, icon: 'alert-octagon', color: '#D32F2F', bgColor: '#FFEBEE' },
  { title: 'Pending Incident Reports', count: 12, icon: 'clock-outline', color: '#EF6C00', bgColor: '#FFF3E0' },
  { title: 'Resolved Cases (Today)', count: 48, icon: 'check-circle-outline', color: '#2E7D32', bgColor: '#E8F5E9' },
  { title: 'Police Patrols Available', count: 8, icon: 'police-badge', color: '#0D47A1', bgColor: '#E1F5FE' },
  { title: 'Ambulances Available', count: 5, icon: 'ambulance', color: '#00897B', bgColor: '#E0F2F1' },
  { title: 'Fire Engines Standby', count: 4, icon: 'fire-truck', color: '#F4511E', bgColor: '#FBE9E7' },
  { title: 'Safety Volunteers Online', count: 34, icon: 'account-group', color: '#7B1FA2', bgColor: '#F3E5F5' },
];

export const INITIAL_INCIDENTS: LiveIncidentMarker[] = [
  {
    id: 'INC_001',
    title: 'Multi-Vehicle Collision NH-8',
    type: 'Accident',
    severity: 'HIGH',
    lat: 35,
    lng: 25,
    time: '12 mins ago',
    witnessCount: 3,
    reporter: 'Johnathan Doe',
    assignedUnit: 'Ambulance 02, Police Patrol 08',
    details: 'Three cars collided near the expressway exit. Right double lanes are currently blocked. Dispatching secondary tow team.',
  },
  {
    id: 'INC_002',
    title: 'Transformer Spark Fire Sector 4',
    type: 'Fire',
    severity: 'CRITICAL',
    lat: 20,
    lng: 60,
    time: '5 mins ago',
    witnessCount: 6,
    reporter: 'Sharma Residence',
    assignedUnit: 'Fire Engine 04, Police Patrol 12',
    details: 'Electrical overhead transformer sparking rapidly, catching local utility trees on fire. Evacuated nearby residential block.',
  },
  {
    id: 'INC_003',
    title: 'Low Underpass Waterlog Mayur Vihar',
    type: 'Flood',
    severity: 'HIGH',
    lat: 65,
    lng: 48,
    time: '24 mins ago',
    witnessCount: 1,
    reporter: 'Traffic Guard',
    assignedUnit: 'Civil Defence Unit 03',
    details: 'Accumulating rainwater in underpass has reached 1.2 feet. Commuters swerving. Blockage markers placed.',
  },
  {
    id: 'INC_004',
    title: 'Snatching Incident Sector 22',
    type: 'Crime',
    severity: 'MEDIUM',
    lat: 50,
    lng: 78,
    time: '45 mins ago',
    witnessCount: 2,
    reporter: 'Aisha Malik',
    assignedUnit: 'Police Patrol 10',
    details: 'Two bike-borne snatchers fled with smartphone. Victim secure at security booth. High-resolution CCTV feeds under scan.',
  },
  {
    id: 'INC_005',
    title: 'Cardiac Arrest Sector 18 Metro',
    type: 'Medical',
    severity: 'CRITICAL',
    lat: 80,
    lng: 15,
    time: '2 mins ago',
    witnessCount: 4,
    reporter: 'Metro Security Staff',
    assignedUnit: 'Max Emergency Medical Team 01',
    details: '60-year-old commuter collapsed. Nearby volunteer Dr. Priya Nair performing emergency CPR on site.',
  },
];

export const INITIAL_AI_RISK_ZONES: AirRiskZone[] = [
  { id: '1', area: 'Mayur Vihar Sub-Tunnel', riskLevel: 'HIGH', type: 'Flood Threat', alert: 'Rain intensity increasing; 6 inches depth.' },
  { id: '2', area: 'Sector 4 Residential', riskLevel: 'MEDIUM', type: 'Crime Watch', alert: 'Low illumination area; frequent patrol recommended.' },
  { id: '3', area: 'NH-8 Expressway Bypass', riskLevel: 'HIGH', type: 'Traffic Jam', alert: 'Tailback extends 1.5km due to collision.' },
  { id: '4', area: 'Connaught Place Central', riskLevel: 'SAFE', type: 'Secure Zone', alert: 'All safety vectors clear.' },
];

export const INITIAL_SOS_QUEUE: SosQueueItem[] = [
  { id: 'SOS_001', citizenName: 'Anjali Sen', emergencyType: 'Crime', location: 'Khoda Metro Corridor', lat: 72, lng: 85, time: '1 min ago', status: 'PENDING', battery: '14%' },
  { id: 'SOS_002', citizenName: 'Karan Mehra', emergencyType: 'Medical', location: 'Connaught Place Block G', lat: 28, lng: 22, time: '3 mins ago', status: 'DISPATCHED', assignedUnit: 'Ambulance 04', battery: '92%' },
  { id: 'SOS_003', citizenName: 'Sunita Roy', emergencyType: 'Flood', location: 'Mayur Vihar Subway Crossing', lat: 66, lng: 50, time: '5 mins ago', status: 'RESOLVED', assignedUnit: 'Civil Defence Team', battery: '45%' },
];

export const INITIAL_RESOURCES: ResourceUnit[] = [
  { id: 'POL_01', name: 'Police Patrol 08', type: 'Police Vehicle', status: 'BUSY', operator: 'Officer Rawat', contact: 'Ext 108' },
  { id: 'POL_02', name: 'Police Patrol 10', type: 'Police Vehicle', status: 'AVAILABLE', operator: 'Officer Yadav', contact: 'Ext 110' },
  { id: 'POL_03', name: 'Police Patrol 12', type: 'Police Vehicle', status: 'BUSY', operator: 'Officer Negi', contact: 'Ext 112' },
  { id: 'AMB_01', name: 'Ambulance 02', type: 'Ambulance', status: 'BUSY', operator: 'Paramedic Roy', contact: 'Ext 202' },
  { id: 'AMB_02', name: 'Ambulance 04', type: 'Ambulance', status: 'AVAILABLE', operator: 'Paramedic Sen', contact: 'Ext 204' },
  { id: 'FIR_01', name: 'Fire Engine 04', type: 'Fire Truck', status: 'BUSY', operator: 'Captain Negi', contact: 'Ext 304' },
  { id: 'VOL_01', name: 'NCC Squad Sector 4', type: 'Community Volunteer', status: 'AVAILABLE', operator: 'Cadet Verma', contact: 'V-401' },
];

export const INITIAL_VOLUNTEERS: CommunityVolunteer[] = [
  { id: '1', name: 'Dr. Priya Nair', badge: 'Doctor', status: 'ACTIVE', distance: '120m' },
  { id: '2', name: 'Nurse Anupama', badge: 'Nurse', status: 'ONLINE', distance: '400m' },
  { id: '3', name: 'Vikram Singh (Committee)', badge: 'Apartment Security', status: 'ONLINE', distance: '550m' },
  { id: '4', name: 'Cadet Amit Sharma', badge: 'NCC', status: 'OFFLINE', distance: '900m' },
  { id: '5', name: 'Elena Rostova', badge: 'Civil Defence', status: 'ONLINE', distance: '1.2km' },
];

export const INITIAL_TIMELINE: ActivityTimelineItem[] = [
  { id: 'T_01', time: '19:15:30', action: 'Ambulance 04 Arrived at G-Block CP', status: 'IN_PROGRESS', team: 'Medical' },
  { id: 'T_02', time: '19:12:10', action: 'Police Patrol 12 Dispatched to Sector 4 Transformer Fire', status: 'DISPATCHED', team: 'Police' },
  { id: 'T_03', time: '19:08:45', action: 'Active SOS of Sunita Roy Marked Resolved', status: 'COMPLETED', team: 'Control Room' },
  { id: 'T_04', time: '18:55:00', action: 'Evacuation Alert Broadcasted to Sector 4 Block C', status: 'COMPLETED', team: 'Disaster Management' },
];
