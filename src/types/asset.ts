export interface Asset {
  id: string;
  code: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  registrationDate: string;
  responsibleUser: string;
  company: string;
  sector: string;
  group: string;
  subgroup: string;
  observations: string;
  imageUrl: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type AssetFormData = Omit<Asset, 'id' | 'registrationDate'>;

export interface FilterState {
  search: string;
  brand: string;
  model: string;
  status: string;
  company: string;
  sector: string;
}
