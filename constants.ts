
import { Language, RoomType, Translation } from './types';

export const ASHRAE_FACTORS: Record<RoomType, number> = {
  [RoomType.BEDROOM]: 100, // W/m2
  [RoomType.LIVING_ROOM]: 120,
  [RoomType.KITCHEN]: 180,
  [RoomType.OFFICE]: 140,
  [RoomType.SERVER_ROOM]: 350,
  [RoomType.GYM]: 220,
};

// Adjustment percentages based on typical ASHRAE/HVAC safety margins
export const ADJUSTMENT_PERCENTAGES = {
  highSunExposure: 0.10, // +10%
  poorInsulation: 0.15,   // +15%
  extraOccupants: 0.10,   // +10%
  highElectronicLoad: 0.10 // +10%
};

export const CONVERSION_BTU_PER_WATT = 3.412142;
export const BTU_PER_HP = 9000;

export const TRANSLATIONS: Record<Language, Translation> = {
  [Language.EN]: {
    title: 'CoolCalc Pro',
    subtitle: 'ASHRAE Standard Cooling Capacity Estimator',
    areaLabel: 'Cooling Area (m²)',
    roomTypeLabel: 'Room Type',
    calculateBtn: 'Calculate Capacity',
    resultsTitle: 'Recommended Capacity',
    kwLabel: 'Kilowatts (kW)',
    btuLabel: 'BTU per Hour (BTU/h)',
    hpLabel: 'Horsepower (HP)',
    m2Label: 'Square Meters',
    disclaimer: 'Calculations are based on ASHRAE standard load factors. Adjustments are applied additively based on environmental conditions.',
    factorsTitle: 'Environmental Factors (Optional)',
    factors: {
      highSun: 'High Sun Exposure (South-facing/Large windows)',
      poorInsulation: 'Poor Insulation (Old building/Thin walls)',
      extraOccupants: 'High Occupancy (>2 people regularly)',
      electronics: 'Many Electronics/Appliances (Heat sources)'
    },
    roomTypes: {
      [RoomType.BEDROOM]: 'Bedroom / Rest Area',
      [RoomType.LIVING_ROOM]: 'Living Room / Lounge',
      [RoomType.KITCHEN]: 'Kitchen / Dining',
      [RoomType.OFFICE]: 'Office / Workspace',
      [RoomType.SERVER_ROOM]: 'Server / Tech Room',
      [RoomType.GYM]: 'Gym / Fitness Area'
    }
  },
  [Language.FR]: {
    title: 'CoolCalc Pro',
    subtitle: 'Estimateur de Capacité de Refroidissement (ASHRAE)',
    areaLabel: 'Surface à refroidir (m²)',
    roomTypeLabel: 'Type de pièce',
    calculateBtn: 'Calculer la capacité',
    resultsTitle: 'Capacité Recommandée',
    kwLabel: 'Kilowatts (kW)',
    btuLabel: 'BTU par heure (BTU/h)',
    hpLabel: 'Chevaux (HP)',
    m2Label: 'Mètres Carrés',
    disclaimer: 'Les calculs sont basés sur les facteurs de charge standard ASHRAE. Les ajustements sont appliqués de manière additive.',
    factorsTitle: 'Facteurs Environnementaux (Optionnel)',
    factors: {
      highSun: 'Exposition Solaire Élevée (Sud/Grandes fenêtres)',
      poorInsulation: 'Isolation Faible (Vieux bâtiment/Murs fins)',
      extraOccupants: 'Occupation Élevée (>2 personnes)',
      electronics: 'Beaucoup d\'Électronique (Sources de chaleur)'
    },
    roomTypes: {
      [RoomType.BEDROOM]: 'Chambre / Zone de repos',
      [RoomType.LIVING_ROOM]: 'Salon / Séjour',
      [RoomType.KITCHEN]: 'Cuisine / Salle à manger',
      [RoomType.OFFICE]: 'Bureau / Espace de travail',
      [RoomType.SERVER_ROOM]: 'Serveur / Local technique',
      [RoomType.GYM]: 'Gymnase / Fitness'
    }
  }
};
