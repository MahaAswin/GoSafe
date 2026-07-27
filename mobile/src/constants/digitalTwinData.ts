export interface MapMarker {
  id: string;
  title: string;
  type: 'Police' | 'Hospital' | 'Fire Station' | 'Incident' | 'Volunteer' | 'Safe Shelter';
  category?: 'Crime' | 'Flood' | 'Accident' | 'Medical' | 'Road Closure' | 'Fire';
  lat: number; // percentage coordinate
  lng: number; // percentage coordinate
  details: string;
  status: string;
}

export const MOCK_MAP_MARKERS: MapMarker[] = [
  { id: '1', title: 'Sector 4 Police station', type: 'Police', lat: 30, lng: 20, details: 'Active Patrol Units: 4. Control line secure.', status: 'Active' },
  { id: '2', title: 'Metro General Hospital', type: 'Hospital', lat: 75, lng: 15, details: 'ICU Beds Available: 12. Paramedic ambulances standby.', status: 'Optimal' },
  { id: '3', title: 'City Fire Station HQ', type: 'Fire Station', lat: 25, lng: 80, details: 'Standby Trucks: 5. High alert status.', status: 'Active' },
  { id: '4', title: 'Multi-Vehicle Collision NH-8', type: 'Incident', category: 'Accident', lat: 45, lng: 40, details: '3 vehicles collision. Blocking 2 right lanes. Police on site.', status: 'Medium Danger' },
  { id: '5', title: 'Overhead Transformer Spark', type: 'Incident', category: 'Fire', lat: 20, lng: 60, details: 'Local transformer sparking. Fire crews deployed.', status: 'Critical Danger' },
  { id: '6', title: 'Mayur Vihar Waterlog Tunnel', type: 'Incident', category: 'Flood', lat: 60, lng: 55, details: 'Water levels at 1.4ft. Traffic swerved.', status: 'High Danger' },
  { id: '7', title: 'Dr. Priya Nair (Mesh Doctor)', type: 'Volunteer', lat: 65, lng: 22, details: 'Certified safety Mesh volunteer doctor.', status: 'Online' },
  { id: '8', title: 'NCC Volunteer Amit', type: 'Volunteer', lat: 35, lng: 70, details: 'NCC Cadet squad helper. Medical kits ready.', status: 'Online' },
  { id: '9', title: 'Sector 18 Safe shelter', type: 'Safe Shelter', lat: 85, lng: 45, details: 'Emergency shelter capacity: 150 beds.', status: 'Available' },
];

export const MOCK_HEATMAP_ZONES = {
  crime: [
    { area: 'Sector 4 Residential', weight: 8, lat: 20, lng: 60, color: '#D32F2F' },
  ],
  flood: [
    { area: 'Mayur Vihar Subways', weight: 9, lat: 60, lng: 55, color: '#0288D1' },
  ],
  traffic: [
    { area: 'NH-8 Bypass Corridor', weight: 6, lat: 45, lng: 40, color: '#F57C00' },
  ],
};
