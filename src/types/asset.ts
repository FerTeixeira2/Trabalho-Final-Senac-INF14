export interface Asset {
  id: string;
  code: string;
  name: string; // ✅ PADRÃO
  description: string;
  imageUrl?: string;
  brand: string;
  model: string;
  company: string;
  sector: string;
  status: 'active' | 'inactive';
  serialNumber?: string;
  responsibleUser?: string;
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
