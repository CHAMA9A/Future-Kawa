export interface Country {
  code: string;
  name: string;
  status: string;
  serviceUrl: string;
}

export interface Lot {
  id: number;
  lotCode: string;
  country: string;
  warehouseName: string;
  storageDate: string;
  status: string;
  createdAt: string;
}

export interface Measurement {
  id: number;
  warehouseName: string;
  temperature: number;
  humidity: number;
  measuredAt: string;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface DashboardData {
  lots: Lot[];
  fifoLots: Lot[];
  measurements: Measurement[];
  alerts: Alert[];
}