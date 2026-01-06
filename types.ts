
export enum Section {
  SOCIAL = 'SOCIAL',
  PERSONAL = 'PERSONAL',
  INSURANCE = 'INSURANCE',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

export interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  category: 'social' | 'personal';
}

export interface VehicleEntry {
  id: string;
  name: string;
  type: 'Car' | 'Bike';
  lastService: string; // ISO string
  nextService: string; // ISO string
}

export interface InsuranceEntry {
  id: string;
  name: string;
  dueDate: string;
  premium: string;
  comments: string;
}

export type VaultData = {
  passwords: PasswordEntry[];
  vehicles: VehicleEntry[];
  insurances: InsuranceEntry[];
};
