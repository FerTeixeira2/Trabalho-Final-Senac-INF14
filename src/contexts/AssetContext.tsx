import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { Asset } from '@/types/asset';

interface AssetContextType {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  getAssetById: (id: string) => Asset | undefined;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await fetch('http://localhost:3000/assets');
        const data = await response.json();

        const mappedAssets: Asset[] = data.map((item: any) => ({
          id: String(item.codigo),
          code: String(item.codigo),
          name: item.nome, // ✅ PADRÃO DO FRONT
          description: item.descricaoItem,
          imageUrl: item.imagem,
          brand: item.marca,
          model: item.modelo,
          company: item.empresa,
          sector: item.setor,
          status: item.status === 'Ativo' ? 'active' : 'inactive',

          // usados apenas para filtros
          serialNumber: '',
          responsibleUser: '',
        }));

        setAssets(mappedAssets);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar ativos');
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  function getAssetById(id: string) {
    return assets.find(asset => asset.id === id);
  }

  return (
    <AssetContext.Provider
      value={{
        assets,
        loading,
        error,
        getAssetById,
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
