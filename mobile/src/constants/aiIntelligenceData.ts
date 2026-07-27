export interface AiInsightCard {
  id: string;
  title: string;
  type: 'CRIME' | 'RAIN' | 'FLOOD' | 'TRAFFIC' | 'NIGHT';
  desc: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  icon: string;
  color: string;
}

export interface AiPredictionCard {
  id: string;
  category: string;
  confidence: number;
  riskProbability: number;
  recommendation: string;
  icon: string;
  color: string;
}

export interface NeighborIntelligence {
  areaName: string;
  safetyScore: number;
  volunteersCount: number;
  policePresence: string;
  recentIncidentsCount: number;
}

export interface TimelineRiskItem {
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  color: string;
}

export const MOCK_AI_INSIGHTS: AiInsightCard[] = [
  { id: '1', title: 'High Crime Corridor Alert', type: 'CRIME', desc: 'Slightly higher incidents of snatching reported near Central Sector after 8 PM.', severity: 'HIGH', icon: 'shield-alert', color: '#D32F2F' },
  { id: '2', title: 'Heavy Downpour Warning', type: 'RAIN', desc: 'Meteorology reports heavy rain coming within 2 hours. High possibility of flooding.', severity: 'HIGH', icon: 'weather-pouring', color: '#1E88E5' },
  { id: '3', title: 'Underpass Flood Risk', type: 'FLOOD', desc: 'Mayur Vihar tunnel has a 70% risk of waterlogging. Avoid low elevation underpasses.', severity: 'HIGH', icon: 'water-alert', color: '#0288D1' },
  { id: '4', title: 'Traffic Congestion Alert', type: 'TRAFFIC', desc: 'Tailback extends 1.5km on NH-8 Expressway near exit. Take alternate loops.', severity: 'MEDIUM', icon: 'car-multiple', color: '#F57C00' },
  { id: '5', title: 'Low Lit Road Warning', type: 'NIGHT', desc: 'Sector 4 block has reports of damaged street lights. Take balanced route.', severity: 'MEDIUM', icon: 'weather-night', color: '#7B1FA2' },
];

export const MOCK_AI_PREDICTIONS: AiPredictionCard[] = [
  { id: '1', category: 'Predictive Crime Rate', confidence: 88, riskProbability: 15, recommendation: 'Avoid walking in low lit alleys. Stay on populated pathways.', icon: 'handcuffs', color: '#D32F2F' },
  { id: '2', category: 'Accident Probability', confidence: 74, riskProbability: 28, recommendation: 'Road slick due to rain. Keep safe distance from trucks.', icon: 'car-emergency', color: '#E53935' },
  { id: '3', category: 'Flood Risk Index', confidence: 92, riskProbability: 64, recommendation: 'Avoid Mayur Vihar subways. Use elevated highway paths.', icon: 'waves', color: '#1976D2' },
  { id: '4', category: 'Road Closure Likelihood', confidence: 68, riskProbability: 40, recommendation: 'Demonstrations expected near metro square. Check routes.', icon: 'road-variant', color: '#F57C00' },
  { id: '5', category: 'Emergency Response Delay', confidence: 80, riskProbability: 8, recommendation: 'Response times are optimal. Dynamic mesh volunteers active.', icon: 'timer-sand', color: '#388E3C' },
];

export const MOCK_NEIGHBORHOOD_INTEL: NeighborIntelligence = {
  areaName: 'Connaught Place, Central Delhi',
  safetyScore: 92,
  volunteersCount: 24,
  policePresence: 'High Patrols Active (3 units)',
  recentIncidentsCount: 1,
};

export const MOCK_RISK_TIMELINE: TimelineRiskItem[] = [
  { period: 'Morning', time: '06:00 AM - 12:00 PM', riskLevel: 'LOW', score: 12, color: '#2E7D32' },
  { period: 'Afternoon', time: '12:00 PM - 05:00 PM', riskLevel: 'LOW', score: 18, color: '#4CAF50' },
  { period: 'Evening', time: '05:00 PM - 09:00 PM', riskLevel: 'MEDIUM', score: 45, color: '#F57C00' },
  { period: 'Night', time: '09:00 PM - 06:00 AM', riskLevel: 'HIGH', score: 72, color: '#D32F2F' },
];

export const MOCK_HISTORICAL_TRENDS = [
  { day: 'Mon', score: 94 },
  { day: 'Tue', score: 91 },
  { day: 'Wed', score: 88 },
  { day: 'Thu', score: 92 },
  { day: 'Fri', score: 95 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 92 },
];
