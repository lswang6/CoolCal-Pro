
export enum Language {
  EN = 'en',
  FR = 'fr'
}

export enum RoomType {
  BEDROOM = 'bedroom',
  LIVING_ROOM = 'living_room',
  KITCHEN = 'kitchen',
  OFFICE = 'office',
  SERVER_ROOM = 'server_room',
  GYM = 'gym'
}

export interface EnvironmentalFactors {
  highSunExposure: boolean;
  poorInsulation: boolean;
  extraOccupants: boolean;
  highElectronicLoad: boolean;
}

export interface RoomRecord {
  id: string;
  roomName: string;
  area: number;
  kw: number;
  btu: number;
  hp: number;
  roomType: RoomType;
}

export interface CalculationResult {
  watts: number;
  kw: number;
  btu: number;
  hp: number;
  area: number;
  roomType: RoomType;
  baseLoad: number;
  adjustmentMultiplier: number;
}

export interface Translation {
  title: string;
  subtitle: string;
  areaLabel: string;
  roomTypeLabel: string;
  calculateBtn: string;
  resultsTitle: string;
  kwLabel: string;
  btuLabel: string;
  hpLabel: string;
  m2Label: string;
  disclaimer: string;
  factorsTitle: string;
  factors: {
    highSun: string;
    poorInsulation: string;
    extraOccupants: string;
    electronics: string;
  };
  roomTypes: Record<RoomType, string>;
  confirmBtn: string;
  recordsTitle: string;
  exportBtn: string;
  clearAllBtn: string;
  noRecords: string;
  roomNamePrefix: string;
}
