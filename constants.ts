
import { Language, RoomType, Translation } from './types';

export const ASHRAE_FACTORS: Record<RoomType, number> = {
  [RoomType.BEDROOM]: 100, // W/m2
  [RoomType.LIVING_ROOM]: 160,
  [RoomType.KITCHEN]: 200,
  [RoomType.OFFICE]: 180,
  [RoomType.SERVER_ROOM]: 350,
  [RoomType.GYM]: 250,
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
    disclaimer: "Calculations are based on ASHRAE standard load factors. Adjustments are applied additively based on environmental conditions, and adjusted after consideration of modern building and people's actual feeling in tropical area.",
    tropicalAreaLabel: 'Tropical Area Application (+30%)',
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
    },
    confirmBtn: 'Confirm & Add',
    recordsTitle: 'Cooling Capacity Records',
    exportBtn: 'Export to CSV',
    clearAllBtn: 'Clear All',
    noRecords: 'No records yet',
    roomNamePrefix: 'Room'
  },
  [Language.FR]: {
    title: 'CoolCalc Pro',
    subtitle: 'Estimateur de Capacité de Refroidissement (ASHRAE)',
    areaLabel: 'Surface à refroidir (m²)',
    roomTypeLabel: 'Type de pièce',
    calculateBtn: 'Calculer la capacité',
    resultsTitle: 'Estimation de Capacité',
    kwLabel: 'Kilowatts (kW)',
    btuLabel: 'BTU par heure (BTU/h)',
    hpLabel: 'Chevaux (HP)',
    m2Label: 'm²',
    disclaimer: "Calculé selon les facteurs de charge standard ASHRAE. Les ajustements sont appliqués de manière additive en fonction des conditions environnementales, et ajustés après considération des bâtiments modernes et du ressenti réel des personnes en zone tropicale.",
    tropicalAreaLabel: 'Application Zone Tropicale (+30%)',
    factorsTitle: 'Facteurs Environnementaux (Optionnel)',
    factors: {
      highSun: 'Exposition Solaire Élevée (Sud/Grandes fenêtres)',
      poorInsulation: 'Isolation Faible (Vieux bâtiment/Murs fins)',
      extraOccupants: 'Occupation Élevée (>2 personnes régulièrement)',
      electronics: 'Nombreux Électronique (Sources de chaleur)'
    },
    roomTypes: {
      [RoomType.BEDROOM]: 'Chambre / Repos',
      [RoomType.LIVING_ROOM]: 'Salon / Séjour',
      [RoomType.KITCHEN]: 'Cuisine / Repas',
      [RoomType.OFFICE]: 'Bureau / Travail',
      [RoomType.SERVER_ROOM]: 'Serveur / Tech',
      [RoomType.GYM]: 'Gym / Fitness'
    },
    confirmBtn: 'Confirmer & Ajouter',
    recordsTitle: 'Registres de Capacité de Refroidissement',
    exportBtn: 'Exporter en CSV',
    clearAllBtn: 'Tout Effacer',
    noRecords: 'Aucun registre pour le moment',
    roomNamePrefix: 'Pièce'
  }
};
