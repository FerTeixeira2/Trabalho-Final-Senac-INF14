import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Asset, AssetFormData } from '@/types/asset';

interface AssetContextType {
  assets: Asset[];
  brands: string[];
  companies: string[];
  groups: { idGrupo: number; descricaoGrupo: string }[];
  subgroups: {
    idGrupo(idGrupo: any): unknown; idSubgrupo: number; descricaoSubgrupo: string 
}[];
  sectors: string[];
  statusOptions: string[];
  loading: boolean;
  addAsset: (data: AssetFormData) => Promise<void>;
  addCompany: (data: { name: string; cnpj?: string; description?: string }) => Promise<void>;
  addBrand: (data: { name: string }) => Promise<void>;
  addGroup: (data: { name: string }) => Promise<void>;
  addSector: (data: { name: string }) => Promise<void>;
  addSubgroup: (data: { name: string; groupId: number; description?: string }) => Promise<void>;
  updateAsset: (id: string, data: AssetFormData) => Promise<void>; // ADICIONADO
  deleteAsset: (id: string) => Promise<void>; // ADICIONADO
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ idGrupo: number; descricaoGrupo: string }[]>([]);
  const [subgroups, setSubgroups] = useState<{ idSubgrupo: number; descricaoSubgrupo: string }[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAssets() {
    const r = await fetch('http://localhost:3000/assets');
    const data = await r.json();
    setAssets(data.map((i: any) => ({
      id: String(i.idItem),
      code: i.codigo,
      name: i.nome,
      description: i.descricaoItem,
      imageUrl: i.imagem,
      brand: i.marca,
      model: i.modelo,
      company: i.empresa,
      sector: i.setor,
      status: i.status === 'Ativo' ? 'active' : 'inactive',
      ondeEsta: i.ondeEsta,
      // usamos os IDs de grupo/subgrupo para manter o relacionamento correto
      group: i.idGrupo != null ? String(i.idGrupo) : '',
      subgroup: i.idSubgrupo != null ? String(i.idSubgrupo) : '',
    })));
  }

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

  async function addAsset(data: AssetFormData) {
    await fetch('http://localhost:3000/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    await fetchAssets();
  }

  async function addCompany(data: { name: string; cnpj?: string; description?: string }) {
    await fetch('http://localhost:3000/companies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    await fetchLookups();
  }

  async function addBrand(data: { name: string }) {
    await fetch('http://localhost:3000/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    await fetchLookups();
  }

  async function addGroup(data: { name: string }) {
    await fetch('http://localhost:3000/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    await fetchLookups();
  }

  async function addSector(data: { name: string }) {
    await fetch('http://localhost:3000/sectors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    await fetchLookups();
  }

  async function addSubgroup(data: { name: string; groupId: number; description?: string }) {
    if (!data.name || !data.groupId) throw new Error('Nome do subgrupo e grupo são obrigatórios');
    await fetch('http://localhost:3000/subgroups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const sg = await fetch('http://localhost:3000/subgroups').then(r => r.json());
    setSubgroups(sg);
  }

  useEffect(() => {
    Promise.all([fetchAssets(), fetchLookups()]).finally(() => setLoading(false));
  }, []);

  async function updateAsset(id: string, data: AssetFormData) {
    await fetch(`http://localhost:3000/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchAssets();
  }
  
  async function deleteAsset(id: string) {
    await fetch(`http://localhost:3000/assets/${id}`, {
      method: 'DELETE',
    });
    await fetchAssets();
  }
  

  return (
    <AssetContext.Provider
      value={{
        assets,
        brands,
        companies,
        groups,
        subgroups: subgroups.map((sg: any) => ({
          ...sg,
          idGrupo: sg.idGrupo ?? sg.groupId ?? null,
        })),
        sectors,
        statusOptions,
        loading,
        addAsset,
        addCompany,
        addBrand,
        addGroup,
        addSector,
        addSubgroup,
        updateAsset, // ADICIONADO
        deleteAsset, // ADICIONADO
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error('useAssets must be used within AssetProvider');
  return ctx;
}
