import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Asset, AssetFormData } from '@/types/asset';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface BrandItem { idMarca: number; descricaoMarca: string; }
export interface CompanyItem { idEmpresa: number; descricaoEmpresa: string; cnpjEmpresa?: string; descricao?: string; }
export interface SectorItem { idSetor: number; descricaoSetor: string; }

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
  updateAsset: (id: string, data: AssetFormData) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  // Listagem com ID + atualizar/excluir para cada entidade
  fetchBrandsList: () => Promise<BrandItem[]>;
  updateBrand: (id: number, data: { name: string }) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  fetchCompaniesList: () => Promise<CompanyItem[]>;
  updateCompany: (id: number, data: { name: string; cnpj?: string; description?: string }) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
  updateGroup: (id: number, data: { name: string }) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  fetchSectorsList: () => Promise<SectorItem[]>;
  updateSector: (id: number, data: { name: string }) => Promise<void>;
  deleteSector: (id: number) => Promise<void>;
  updateSubgroup: (id: number, data: { name: string; groupId: number; description?: string }) => Promise<void>;
  deleteSubgroup: (id: number) => Promise<void>;
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
    const r = await fetch(`${API_URL}/assets`);
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

      fetch(`${API_URL}/brands`).then(r => r.json()),
      fetch(`${API_URL}/companies`).then(r => r.json()),
      fetch(`${API_URL}/groups`).then(r => r.json()),
      fetch(`${API_URL}/subgroups`).then(r => r.json()),
      fetch(`${API_URL}/sectors`).then(r => r.json()),
      fetch(`${API_URL}/status`).then(r => r.json()),
    ]);
    setBrands(b);
    setCompanies(c);
    setGroups(g);
    setSubgroups(sg);
    setSectors(s);
    setStatusOptions(st);
  }

  async function addAsset(data: AssetFormData) {
    const res = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar ativo');
    }
    await fetchAssets();
  }

  async function addCompany(data: { name: string; cnpj?: string; description?: string }) {
    const res = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar empresa');
    }
    await fetchLookups();
  }

  async function addBrand(data: { name: string }) {
    const res = await fetch(`${API_URL}/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar marca');
    }
    await fetchLookups();
  }

  async function addGroup(data: { name: string }) {
    const res = await fetch(`${API_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar grupo');
    }
    await fetchLookups();
  }

  async function addSector(data: { name: string }) {
    const res = await fetch(`${API_URL}/sectors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar setor');
    }
    await fetchLookups();
  }

  async function addSubgroup(data: { name: string; groupId: number; description?: string }) {
    if (!data.name || !data.groupId) throw new Error('Nome do subgrupo e grupo são obrigatórios');
    const res = await fetch(`${API_URL}/subgroups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar subgrupo');
    }
    const sg = await fetch(`${API_URL}/subgroups`).then(r => r.json());
    setSubgroups(sg);
  }

  async function fetchBrandsList(): Promise<BrandItem[]> {
    const r = await fetch(`${API_URL}/brands/list`);
    if (!r.ok) throw new Error('Erro ao carregar marcas');
    return r.json();
  }
  async function updateBrand(id: number, data: { name: string }) {
    const res = await fetch(`${API_URL}/brands/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao atualizar marca'); }
    await fetchLookups();
  }
  async function deleteBrand(id: number) {
    const res = await fetch(`${API_URL}/brands/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao excluir marca'); }
    await fetchLookups();
  }

  async function fetchCompaniesList(): Promise<CompanyItem[]> {
    const r = await fetch(`${API_URL}/companies/list`);
    if (!r.ok) throw new Error('Erro ao carregar empresas');
    return r.json();
  }
  async function updateCompany(id: number, data: { name: string; cnpj?: string; description?: string }) {
    const res = await fetch(`${API_URL}/companies/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao atualizar empresa'); }
    await fetchLookups();
  }
  async function deleteCompany(id: number) {
    const res = await fetch(`${API_URL}/companies/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao excluir empresa'); }
    await fetchLookups();
  }

  async function updateGroup(id: number, data: { name: string }) {
    const res = await fetch(`${API_URL}/groups/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao atualizar grupo'); }
    await fetchLookups();
  }
  async function deleteGroup(id: number) {
    const res = await fetch(`${API_URL}/groups/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao excluir grupo'); }
    await fetchLookups();
  }

  async function fetchSectorsList(): Promise<SectorItem[]> {
    const r = await fetch(`${API_URL}/sectors/list`);
    if (!r.ok) throw new Error('Erro ao carregar setores');
    return r.json();
  }
  async function updateSector(id: number, data: { name: string }) {
    const res = await fetch(`${API_URL}/sectors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao atualizar setor'); }
    await fetchLookups();
  }
  async function deleteSector(id: number) {
    const res = await fetch(`${API_URL}/sectors/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao excluir setor'); }
    await fetchLookups();
  }

  async function updateSubgroup(id: number, data: { name: string; groupId: number; description?: string }) {
    const res = await fetch(`${API_URL}/subgroups/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao atualizar subgrupo'); }
    const sg = await fetch(`${API_URL}/subgroups`).then(r => r.json());
    setSubgroups(sg);
  }
  async function deleteSubgroup(id: number) {
    const res = await fetch(`${API_URL}/subgroups/${id}`, { method: 'DELETE' });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Erro ao excluir subgrupo'); }
    const sg = await fetch(`${API_URL}/subgroups`).then(r => r.json());
    setSubgroups(sg);
  }

  useEffect(() => {
    Promise.all([fetchAssets(), fetchLookups()]).finally(() => setLoading(false));
  }, []);

  async function updateAsset(id: string, data: AssetFormData) {
    await fetch(`${API_URL}/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchAssets();
  }
  
  async function deleteAsset(id: string) {
    await fetch(`${API_URL}/assets/${id}`, {
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
        updateAsset,
        deleteAsset,
        fetchBrandsList,
        updateBrand,
        deleteBrand,
        fetchCompaniesList,
        updateCompany,
        deleteCompany,
        updateGroup,
        deleteGroup,
        fetchSectorsList,
        updateSector,
        deleteSector,
        updateSubgroup,
        deleteSubgroup,
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
