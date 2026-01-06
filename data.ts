
import { PasswordEntry, VehicleEntry } from './types';

export const mockPasswords: PasswordEntry[] = [
  { id: '1', service: 'Facebook', username: 'john_doe@email.com', password: 'SecretPassword123!', category: 'social' },
  { id: '2', service: 'Twitter/X', username: 'johndoe_real', password: 'X_password_2024', category: 'social' },
  { id: '3', service: 'Instagram', username: 'johnny_pics', password: 'insta_safe_99', category: 'social' },
  { id: '4', service: 'Chase Bank', username: 'j_doe_chase', password: 'BankingSecure#1', category: 'personal' },
  { id: '5', service: 'Gmail', username: 'john.doe.personal@gmail.com', password: 'GooglePassKey!8', category: 'personal' },
  { id: '6', service: 'Employer Portal', username: 'jdoe_corp', password: 'WorkWorkWork-22', category: 'personal' },
];

export const mockVehicles: VehicleEntry[] = [
  { id: 'v1', name: 'Sedan Family Car', type: 'Car', lastService: '2023-12-01', nextService: '2024-06-01' },
  { id: 'v2', name: 'Mountain Explorer', type: 'Bike', lastService: '2024-01-15', nextService: '2024-04-15' },
  { id: 'v3', name: 'City Commuter', type: 'Car', lastService: '2023-10-20', nextService: '2024-10-20' },
];
