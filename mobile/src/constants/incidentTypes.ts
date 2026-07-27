export interface IncidentTypeConfig {
  id: string;
  label: string;
  emoji: string;
  icon: string; // MaterialCommunityIcons name
  color: string;
  safetyTips: string[];
}

export const INCIDENT_TYPES: IncidentTypeConfig[] = [
  {
    id: 'ROAD_ACCIDENT',
    label: 'Road Accident',
    emoji: '🚗',
    icon: 'car-emergency',
    color: '#E53935', // Red
    safetyTips: [
      'Do not move injured people unless absolutely necessary due to fire or explosion risk.',
      'Turn on hazard lights of your vehicle and set up warning triangles.',
      'Check for injuries and dial emergency services (Police/Ambulance) immediately.',
      'Document the scene with photos only if it is safe to do so.',
    ],
  },
  {
    id: 'CRIME',
    label: 'Crime',
    emoji: '🚨',
    icon: 'shield-alert',
    color: '#D32F2F', // Dark Red
    safetyTips: [
      'Move to a safe, populated, and well-lit place immediately.',
      'Do not try to confront the perpetrator or intervene directly.',
      'Take mental notes of physical appearance, clothing, and escape direction.',
      'Call local law enforcement as soon as you are out of harm\'s way.',
    ],
  },
  {
    id: 'FIRE',
    label: 'Fire',
    emoji: '🔥',
    icon: 'fire',
    color: '#F4511E', // Orange-Red
    safetyTips: [
      'Stay away from smoke; drop low and crawl under smoke if escaping.',
      'Touch doors with the back of your hand before opening; do not open if hot.',
      'Alert others in the vicinity and evacuate the building immediately.',
      'Call the fire department immediately and do not return for personal items.',
    ],
  },
  {
    id: 'FLOOD',
    label: 'Flood',
    emoji: '🌊',
    icon: 'water',
    color: '#1E88E5', // Blue
    safetyTips: [
      'Avoid flowing water. Even 6 inches of moving water can knock you down.',
      'Move to higher ground immediately; do not walk or drive through flooded areas.',
      'Keep away from downed power lines and electrical cables.',
      'Listen to local weather channels or emergency broadcasts for updates.',
    ],
  },
  {
    id: 'ELECTRIC_HAZARD',
    label: 'Electric Hazard',
    emoji: '⚡',
    icon: 'flash',
    color: '#FDD835', // Yellow
    safetyTips: [
      'Stay at least 30 feet away from any downed power lines or sparks.',
      'Do not touch anyone who is in direct contact with an electrical current.',
      'Turn off the main power supply if it is safe to access.',
      'Report sparking transformers or loose cables immediately to utility providers.',
    ],
  },
  {
    id: 'ROAD_DAMAGE',
    label: 'Road Damage',
    emoji: '🚧',
    icon: 'barrier',
    color: '#FB8C00', // Orange
    safetyTips: [
      'Slow down and increase following distance when driving over damaged roads.',
      'Avoid sudden swerving which can cause accidents with other vehicles.',
      'Report large potholes, sinkholes, or cracks to municipal authorities.',
      'Keep hazard warning indicators clear for other drivers.',
    ],
  },
  {
    id: 'STREET_LIGHT',
    label: 'Street Light Failure',
    emoji: '💡',
    icon: 'lightbulb-off',
    color: '#757575', // Grey
    safetyTips: [
      'Use a personal flashlight or your smartphone light when walking.',
      'Walk on designated sidewalks and cross streets only at illuminated intersections.',
      'Stay alert to your surroundings in unlit zones.',
      'Report specific light pole IDs to city maintenance.',
    ],
  },
  {
    id: 'MEDICAL_EMERGENCY',
    label: 'Medical Emergency',
    emoji: '🚑',
    icon: 'ambulance',
    color: '#00897B', // Teal
    safetyTips: [
      'Call emergency services (Ambulance) immediately.',
      'Provide clear details of the patient\'s condition and location.',
      'Perform CPR or basic first aid only if you are trained and certified.',
      'Keep the patient warm, calm, and do not feed them anything.',
    ],
  },
  {
    id: 'SUSPICIOUS_ACTIVITY',
    label: 'Suspicious Activity',
    emoji: '👤',
    icon: 'eye-off',
    color: '#5E35B1', // Purple
    safetyTips: [
      'Keep a safe distance and do not draw attention to yourself.',
      'Do not confront suspicious persons or attempt to detain them.',
      'Note details: clothing, height, gender, car model/color, license plate.',
      'Notify community security guards or local authorities immediately.',
    ],
  },
  {
    id: 'ANIMAL_ATTACK',
    label: 'Animal Attack',
    emoji: '🐕',
    icon: 'paw',
    color: '#8D6E63', // Brown
    safetyTips: [
      'Remain calm and avoid eye contact; do not scream or run away.',
      'Stand still or back away slowly. Do not wave your arms.',
      'If attacked, curl into a ball, cover your head/neck with your arms.',
      'Wash any animal scratch or bite immediately and seek urgent medical care.',
    ],
  },
  {
    id: 'FALLEN_TREE',
    label: 'Fallen Tree',
    emoji: '🌳',
    icon: 'tree',
    color: '#43A047', // Green
    safetyTips: [
      'Keep away from fallen branches as they may be touching live wires.',
      'Do not attempt to move large tree limbs from roads without help.',
      'Watch out for overhead hanging branches that might fall later.',
      'Alert traffic to blockages and notify park/road authorities.',
    ],
  },
  {
    id: 'OTHER',
    label: 'Other',
    emoji: '📦',
    icon: 'package-variant',
    color: '#00ACC1', // Cyan
    safetyTips: [
      'Stay calm and assess the situation carefully.',
      'Ensure you are in a safe zone before documenting or writing reports.',
      'Follow instructions of emergency officials or law enforcement.',
      'Share details clearly and provide coordinates for quick response.',
    ],
  },
];
