export interface RiskItem {
  id: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  icon: string; // MaterialCommunityIcons name
  color: string;
}

export interface RouteDetail {
  id: 'A' | 'B' | 'C';
  name: string;
  safetyScore: number;
  riskLevel: 'Very Safe' | 'Moderately Safe' | 'Risky' | 'Danger Zone';
  duration: number; // in minutes
  distance: number; // in km
  color: string;
  risks: RiskItem[];
  recommendations: string[];
  explanation: string;
  timeline: Array<{
    time: string;
    location: string;
    status: 'safe' | 'warning' | 'danger';
    detail: string;
  }>;
}

export interface DestinationConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: RouteDetail[];
}

export const MOCK_DESTINATIONS: DestinationConfig[] = [
  {
    id: 'SECTOR_62_NOIDA',
    name: 'Sector 62, Noida',
    latitude: 28.6219,
    longitude: 77.3794,
    routes: [
      {
        id: 'A',
        name: 'Route A (Safest)',
        safetyScore: 95,
        riskLevel: 'Very Safe',
        duration: 24,
        distance: 7.8,
        color: '#2E7D32', // Green
        risks: [
          { id: '1', name: 'Heavy Traffic', severity: 'LOW', icon: 'car-multiple', color: '#4CAF50' },
          { id: '2', name: 'Road Construction', severity: 'LOW', icon: 'cone', color: '#4CAF50' },
        ],
        recommendations: [
          'Prefer Route A for late night travel.',
          'Fully illuminated street light coverage.',
          'Patrol squad active on this corridor.',
        ],
        explanation: 'This route has 34% lower risk based on historical incidents, active police patrols, and live community safety logs.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point, police presence high.' },
          { time: '8 min', location: 'Akshardham Crossing', status: 'safe', detail: 'Well lit junction, traffic flowing.' },
          { time: '16 min', location: 'NH-24 Bypass Corridor', status: 'warning', detail: 'Minor road works, keep right.' },
          { time: '24 min', location: 'Sector 62 (End)', status: 'safe', detail: 'Destination reached, secure zone.' },
        ],
      },
      {
        id: 'B',
        name: 'Route B (Balanced)',
        safetyScore: 80,
        riskLevel: 'Moderately Safe',
        duration: 21,
        distance: 7.2,
        color: '#FBC02D', // Yellow
        risks: [
          { id: '1', name: 'Low Lighting', severity: 'MEDIUM', icon: 'lightbulb-off', color: '#FBC02D' },
          { id: '2', name: 'Recent Road Accident', severity: 'MEDIUM', icon: 'car-emergency', color: '#FBC02D' },
        ],
        recommendations: [
          'Street lights inactive in Sector 4 bypass.',
          'Recent minor collision near underpass; lane blocked.',
        ],
        explanation: 'Average security rating. Minor traffic congestion and partially unlit segments lower its safety index.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point.' },
          { time: '6 min', location: 'Pragati Maidan Flyover', status: 'warning', detail: 'Traffic slowing due to minor tailback.' },
          { time: '14 min', location: 'Sector 4 Junction', status: 'warning', detail: 'Street lights off for 400m segment.' },
          { time: '21 min', location: 'Sector 62 (End)', status: 'safe', detail: 'Destination reached.' },
        ],
      },
      {
        id: 'C',
        name: 'Route C (Fastest but Risky)',
        safetyScore: 63,
        riskLevel: 'Risky',
        duration: 18,
        distance: 6.8,
        color: '#D32F2F', // Red
        risks: [
          { id: '1', name: 'Recent Theft Zone', severity: 'CRITICAL', icon: 'shield-alert', color: '#D32F2F' },
          { id: '2', name: 'Active Flood Area', severity: 'HIGH', icon: 'water', color: '#E64A19' },
          { id: '3', name: 'Heavy Traffic', severity: 'MEDIUM', icon: 'car-multiple', color: '#FBC02D' },
        ],
        recommendations: [
          'Avoid Route C after 9 PM.',
          'High waterlogging alert on low-level highway crossing.',
          'Police warn of frequent smartphone snatching reports here.',
        ],
        explanation: 'Fastest ETA, but passes through an active crime-watch corridor and a heavy waterlogging sub-tunnel.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point.' },
          { time: '5 min', location: 'ITO Bridge Highway', status: 'warning', detail: 'Heavy vehicle jam, high noise.' },
          { time: '11 min', location: 'Mayur Vihar Tunnel', status: 'danger', detail: '6 inches waterlogged; low-clearance hazard.' },
          { time: '15 min', location: 'Khoda Metro Corridor', status: 'danger', detail: 'Recent thefts reported. Keep windows closed.' },
          { time: '18 min', location: 'Sector 62 (End)', status: 'safe', detail: 'Destination reached.' },
        ],
      },
    ],
  },
  {
    id: 'TERMINAL_3_AIRPORT',
    name: 'Terminal 3, IG Airport',
    latitude: 28.5562,
    longitude: 77.1001,
    routes: [
      {
        id: 'A',
        name: 'Route A (Safest)',
        safetyScore: 92,
        riskLevel: 'Very Safe',
        duration: 35,
        distance: 18.5,
        color: '#2E7D32',
        risks: [
          { id: '1', name: 'Road Construction', severity: 'LOW', icon: 'cone', color: '#4CAF50' },
        ],
        recommendations: [
          'Secure expressway route.',
          'Constant police patrolling checkpoints active.',
        ],
        explanation: 'Excellent choice. 100% lit toll road with emergency response vehicles stationed every 2km.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point.' },
          { time: '15 min', location: 'Dhaula Kuan Highway Split', status: 'safe', detail: 'Smooth merge lanes, heavily monitored.' },
          { time: '28 min', location: 'Expressway Toll Booth', status: 'warning', detail: 'Minor queue delays, keep cash/tag ready.' },
          { time: '35 min', location: 'Terminal 3 Airport (End)', status: 'safe', detail: 'Airport drop terminal, heavily guarded.' },
        ],
      },
      {
        id: 'B',
        name: 'Route B (Balanced)',
        safetyScore: 78,
        riskLevel: 'Moderately Safe',
        duration: 30,
        distance: 17.2,
        color: '#FBC02D',
        risks: [
          { id: '1', name: 'Heavy Traffic', severity: 'MEDIUM', icon: 'car-multiple', color: '#FBC02D' },
          { id: '2', name: 'Low Lighting', severity: 'LOW', icon: 'lightbulb-off', color: '#4CAF50' },
        ],
        recommendations: [
          'Expect minor congestion around airport arterial slipways.',
          'Moderate illumination near suburban borders.',
        ],
        explanation: 'Fairly safe route but experiences recurrent bottlenecking that could extend travel delays.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point.' },
          { time: '12 min', location: 'Chanakyapuri Marg', status: 'safe', detail: 'Green, highly illuminated sector.' },
          { time: '22 min', location: 'Mahipalpur Junction', status: 'warning', detail: 'Severe intersection traffic merge.' },
          { time: '30 min', location: 'Terminal 3 Airport (End)', status: 'safe', detail: 'Airport arrival reached.' },
        ],
      },
      {
        id: 'C',
        name: 'Route C (Risky but Fast)',
        safetyScore: 55,
        riskLevel: 'Risky',
        duration: 25,
        distance: 15.8,
        color: '#D32F2F',
        risks: [
          { id: '1', name: 'Recent Road Accident', severity: 'HIGH', icon: 'car-emergency', color: '#E64A19' },
          { id: '2', name: 'Low Lighting', severity: 'HIGH', icon: 'lightbulb-off', color: '#E64A19' },
        ],
        recommendations: [
          'Avoid this route. Multiple dark spots over unlit flyover paths.',
          'A multi-vehicle crash is blocking the left double lanes currently.',
        ],
        explanation: 'Very low safety rating. High speed limits combined with non-functional street lamps result in elevated accident frequencies.',
        timeline: [
          { time: '0 min', location: 'Connaught Place (Start)', status: 'safe', detail: 'Departure point.' },
          { time: '8 min', location: 'Delhi Cantonment Area Bypass', status: 'warning', detail: 'No overhead lights for 1.2km.' },
          { time: '18 min', location: 'Outer Ring Slip Bridge', status: 'danger', detail: 'Multi-car pileup under review; emergency cars blocking lane.' },
          { time: '25 min', location: 'Terminal 3 Airport (End)', status: 'safe', detail: 'Airport arrival reached.' },
        ],
      },
    ],
  },
];

export const MOCK_SAFE_PLACES = [
  { id: '1', name: 'Police HQ', type: 'Police', icon: 'police-badge', distance: '350m', contact: '100' },
  { id: '2', name: 'Max Hospital', type: 'Hospital', icon: 'hospital-building', distance: '800m', contact: '102' },
  { id: '3', name: 'Metro Security Station', type: 'Metro', icon: 'subway-variant', distance: '1.2km', contact: '112' },
  { id: '4', name: 'HP Petrol Pump', type: 'Petrol Bunk', icon: 'gas-station', distance: '1.5km', contact: '-' },
  { id: '5', name: 'Community Center Shelter', type: 'Safe Shelter', icon: 'shield-home', distance: '2.1km', contact: '1091' },
];
