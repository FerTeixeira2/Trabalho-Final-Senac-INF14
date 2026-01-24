import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, AssetFormData } from '@/types/asset';

interface AssetContextType {
  assets: Asset[];
  addAsset: (data: AssetFormData) => void;
  updateAsset: (id: string, data: AssetFormData) => void;
  deactivateAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  brands: string[];
  models: string[];
  companies: string[];
  sectors: string[];
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

// Initial mock data
const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    code: 'PC-001',
    description: 'Computador Desktop Dell OptiPlex',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DL7090-2024-001',
    registrationDate: '2024-01-15',
    responsibleUser: 'João Silva',
    company: 'Matriz',
    sector: 'TI',
    group: 'Computadores',
    subgroup: 'Desktop',
    observations: 'Equipamento principal da equipe de desenvolvimento',
    imageUrl: '',
    status: 'active',
  },
  {
    id: '2',
    code: 'SW-001',
    description: 'Switch Cisco Catalyst 48 portas',
    brand: 'Cisco',
    model: 'Catalyst 9200',
    serialNumber: 'CSC9200-2024-001',
    registrationDate: '2024-01-10',
    responsibleUser: 'Maria Santos',
    company: 'Matriz',
    sector: 'Infraestrutura',
    group: 'Rede',
    subgroup: 'Switch',
    observations: 'Switch principal do datacenter',
    imageUrl: '',
    status: 'active',
  },
  {
    id: '3',
    code: 'NB-001',
    description: 'Notebook Lenovo ThinkPad',
    brand: 'Lenovo',
    model: 'ThinkPad T14',
    serialNumber: 'LNV-T14-2024-001',
    registrationDate: '2024-02-01',
    responsibleUser: 'Carlos Oliveira',
    company: 'Filial SP',
    sector: 'Comercial',
    group: 'Computadores',
    subgroup: 'Notebook',
    observations: 'Notebook para uso em campo',
    imageUrl: '',
    status: 'active',
  },
  {
    id: '4',
    code: 'SV-001',
    description: 'Servidor HP ProLiant',
    brand: 'HP',
    model: 'ProLiant DL380',
    serialNumber: 'HP-DL380-2023-001',
    registrationDate: '2023-06-15',
    responsibleUser: 'Ana Costa',
    company: 'Matriz',
    sector: 'TI',
    group: 'Servidores',
    subgroup: 'Rack',
    observations: 'Servidor de banco de dados',
    imageUrl: '',
    status: 'inactive',
  },
  {
    id: '5',
    code: 'RT-001',
    description: 'Roteador Cisco',
    brand: 'Cisco',
    model: 'ISR 4331',
    serialNumber: 'CSC-ISR-2024-001',
    registrationDate: '2024-03-01',
    responsibleUser: 'Pedro Almeida',
    company: 'Filial RJ',
    sector: 'Infraestrutura',
    group: 'Rede',
    subgroup: 'Roteador',
    observations: 'Roteador de borda',
    imageUrl: '',
    status: 'active',
  },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const storedAssets = localStorage.getItem('assets');
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    } else {
      setAssets(INITIAL_ASSETS);
      localStorage.setItem('assets', JSON.stringify(INITIAL_ASSETS));
    }
  }, []);

  const saveAssets = (newAssets: Asset[]) => {
    setAssets(newAssets);
    localStorage.setItem('assets', JSON.stringify(newAssets));
  };

  const addAsset = (data: AssetFormData) => {
    const newAsset: Asset = {
      ...data,
      id: generateId(),
      registrationDate: new Date().toISOString().split('T')[0],
    };
    saveAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, data: AssetFormData) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, ...data } : asset
    );
    saveAssets(updatedAssets);
  };

  const deactivateAsset = (id: string) => {
    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, status: 'inactive' as const } : asset
    );
    saveAssets(updatedAssets);
  };

  const getAssetById = (id: string) => assets.find(asset => asset.id === id);

  const brands = [...new Set(assets.map(a => a.brand))];
  const models = [...new Set(assets.map(a => a.model))];
  const companies = [...new Set(assets.map(a => a.company))];
  const sectors = [...new Set(assets.map(a => a.sector))];

  return (
    <AssetContext.Provider value={{
      assets,
      addAsset,
      updateAsset,
      deactivateAsset,
      getAssetById,
      brands,
      models,
      companies,
      sectors,
    }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}
