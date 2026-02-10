export interface Asset {
  id: string;
  code: string;
  name: string; 
  description: string;
  imageUrl?: string;
  brand: string;
  model: string;
  company: string;
  sector: string;
  status: 'active' | 'inactive';
  serialNumber?: string;
  responsibleUser?: string;
  ondeEsta?: string;
  group?: string;         // 🔹 adicionado
  subgroup?: string;      // 🔹 adicionado
  observations?: string;  // 🔹 adicionado
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

export type AssetFormData = Omit<Asset, 'id'>;

export interface FilterState {
  search: string;
  brand: string;
  model: string;
  status: string;
  company: string;
  sector: string;
}
