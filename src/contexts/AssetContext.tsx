import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Asset, AssetFormData } from '@/types/asset';

interface AssetContextType {
  assets: Asset[];
  brands: string[];
  companies: string[];
  groups: string[];
  subgroups: string[];
  sectors: string[];
  statusOptions: string[];
  loading: boolean;
  addAsset: (data: AssetFormData) => Promise<void>;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [subgroups, setSubgroups] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  // 🔹 BUSCAR ATIVOS
  async function fetchAssets() {
    const response = await fetch('http://localhost:3000/assets');
    const data = await response.json();

    const mapped: Asset[] = data.map((item: any) => ({
      id: item.codigo,
      code: item.codigo,
      name: item.nome ?? '',
      description: item.descricaoItem ?? '',
      imageUrl: item.imagem ?? '',
      brand: item.marca ?? '',
      model: item.modelo ?? '',
      company: item.empresa ?? '',
      sector: item.setor ?? '',
      status: item.status === 'Ativo' ? 'active' : 'inactive',
      serialNumber: item.numeroSerie ?? '',
      responsibleUser: 'ADM',

      group: item.grupo ?? '',
      subgroup: item.subgrupo ?? '',
      observations: item.observacoes ?? '',
    }));

    setAssets(mapped);
  }

  // 🔹 BUSCAR LISTAS AUXILIARES
  async function fetchLookups() {
    const [b, c, g, sg, s, st] = await Promise.all([
      fetch('http://localhost:3000/brands').then(r => r.json()),
      fetch('http://localhost:3000/companies').then(r => r.json()),
      fetch('http://localhost:3000/groups').then(r => r.json()),
      fetch('http://localhost:3000/subgroups').then(r => r.json()),
      fetch('http://localhost:3000/sectors').then(r => r.json()),
      fetch('http://localhost:3000/status').then(r => r.json()),
    ]);

    setBrands(b);
    setCompanies(c);
    setGroups(g);
    setSubgroups(sg);
    setSectors(s);
    setStatusOptions(st);
  }

  // 🔹 ADICIONAR ATIVO
  async function addAsset(data: AssetFormData) {
    await fetch('http://localhost:3000/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        responsibleUser: 'ADM', // só para exibir
      }),
    });

    await fetchAssets(); // 🔥 atualiza tabela automaticamente
  }

  useEffect(() => {
    Promise.all([fetchAssets(), fetchLookups()]).finally(() => setLoading(false));
  }, []);

  return (
    <AssetContext.Provider
      value={{
        assets,
        brands,
        companies,
        groups,
        subgroups,
        sectors,
        statusOptions,
        loading,
        addAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within AssetProvider');
  }
  return context;
}
