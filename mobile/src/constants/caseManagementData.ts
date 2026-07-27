export interface CaseTimelineEvent {
  title: string;
  time: string;
  desc: string;
}

export interface CaseReport {
  id: string;
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  datetime: string;
  status: 'REPORTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  description: string;
  reporter: string;
  assignedAuthority: string;
  eta: string;
  progress: number;
  confirmedCount: number;
  disputedCount: number;
  confidenceScore: number;
  timeline: CaseTimelineEvent[];
}

export const MOCK_CASE_REPORTS: CaseReport[] = [
  {
    id: 'INC-1094',
    title: 'Waterlogging at Metro Underpass',
    category: 'Flood Risk',
    severity: 'HIGH',
    location: 'Mayur Vihar Subway Metro Crossing',
    datetime: 'Today, 2:40 PM',
    status: 'IN_PROGRESS',
    description: 'Underpass filled with over 1 foot of muddy rain water. Small vehicles are stalling. Traffic has swerved to highway.',
    reporter: 'John Doe',
    assignedAuthority: 'Civil Defence Unit 03 (Officer Rawat)',
    eta: '45 mins remaining',
    progress: 75,
    confirmedCount: 14,
    disputedCount: 0,
    confidenceScore: 98,
    timeline: [
      { title: 'Incident Logged', time: '14:40 PM', desc: 'Case generated in Smart City Dispatch queue.' },
      { title: 'Geospatial Verification', time: '14:45 PM', desc: 'Alert verified by local volunteers and GPS coordinates.' },
      { title: 'Responder Assigned', time: '14:52 PM', desc: 'Officer Rawat assigned to head civil defence drainage crews.' },
      { title: 'Response Started', time: '15:10 PM', desc: 'Crews deployed high-capacity water pumps to empty underpass.' },
    ],
  },
  {
    id: 'INC-1082',
    title: 'Street Lamp Blackout Sector 4',
    category: 'Road Hazard',
    severity: 'MEDIUM',
    location: 'Sector 4 Residential Block C',
    datetime: 'Yesterday, 8:15 PM',
    status: 'RESOLVED',
    description: 'Entire street lamp grid from house 12 to 24 is completely dark. High risk of snatching or visual accidents.',
    reporter: 'John Doe',
    assignedAuthority: 'Municipal Electric Division (Officer Yadav)',
    eta: 'Resolved',
    progress: 100,
    confirmedCount: 6,
    disputedCount: 1,
    confidenceScore: 85,
    timeline: [
      { title: 'Incident Logged', time: 'Yesterday, 20:15 PM', desc: 'Case logged by resident.' },
      { title: 'Electric Team Dispatched', time: 'Yesterday, 21:00 PM', desc: 'Technician dispatched to inspection transformer cabinet.' },
      { title: 'Blown fuse replaced', time: 'Yesterday, 21:45 PM', desc: 'Replaced high-voltage cabinet fuse. Lights verified functional.' },
      { title: 'Incident Resolved', time: 'Yesterday, 22:00 PM', desc: 'Case closed. Verified by resident feedback.' },
    ],
  },
  {
    id: 'INC-1021',
    title: 'Minor Slip Accident on Crossing',
    category: 'Road Accident',
    severity: 'LOW',
    location: 'Connaught Place Outer Ring G-Block',
    datetime: '3 days ago, 11:20 AM',
    status: 'REJECTED',
    description: 'Minor motorbike skid. No major injuries, rider resumed travel. Road surface slightly slippery.',
    reporter: 'John Doe',
    assignedAuthority: 'Traffic Guard Line CP',
    eta: 'N/A',
    progress: 0,
    confirmedCount: 1,
    disputedCount: 4,
    confidenceScore: 20,
    timeline: [
      { title: 'Incident Logged', time: '3 days ago, 11:20 AM', desc: 'Case registered.' },
      { title: 'Traffic Patrol Inspect', time: '3 days ago, 11:45 AM', desc: 'Patrol officer visited location. No skid traces or traffic blockage found.' },
      { title: 'Rejected as False Alarm', time: '3 days ago, 12:00 PM', desc: 'Disputed by 4 nearby vendors. Archived.' },
    ],
  },
];
