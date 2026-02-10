import React, { useState } from 'react';
import { Asset, FilterState } from '@/types/asset';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { AssetFilters } from '@/components/AssetFilters';
import { AssetTable } from '@/components/AssetTable';
import { AssetModalCadastrarAtivo } from '@/components/AssetModalCadastrarAtivo';
import { BrandModal } from '@/components/AssetModalMarca';
import { CompanyModal } from '@/components/AssetModalEmpresa';
import { GroupModal } from '@/components/AssetModalGrupo';
import { AssetModalSubGrupo } from '@/components/AssetModalSubGrupo';
import { SectorModal } from '@/components/AssetModalSetor';
import { DeactivateModal } from '@/components/DeactivateModal';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  LayoutDashboard,
  BarChart3,
  Building2,
  Layers,
  FolderTree,
  Network
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  brand: '',
  model: '',
  status: '',
  company: '',
  sector: '',
};

export function Dashboard() {
  const { isAdmin } = useAuth();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // ===== MODAL ATIVO =====
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalMode, setModalMode] =
    useState<'create' | 'edit' | 'view'>('create');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);

  // ===== MODAIS AUXILIARES =====
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSubgroupModalOpen, setIsSubgroupModalOpen] = useState(false);
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // ===== HANDLERS =====
  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setModalMode('create');
    setIsAssetModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        {/* SIDEBAR */}
        {isAdmin && (
          <aside className="w-64 min-h-screen border-r border-border bg-muted/30 p-4 space-y-2">
            <Button
              className="w-full justify-start gap-2"
              onClick={handleCreateAsset}
            >
              <Plus className="w-4 h-4" />
              Cadastrar Ativo
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => setIsBrandModalOpen(true)}
            >
              <Layers className="w-4 h-4" />
              Cadastrar Marca
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => setIsCompanyModalOpen(true)}
            >
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => setIsGroupModalOpen(true)}
            >
              <FolderTree className="w-4 h-4" />
              Cadastrar Grupo
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => setIsSubgroupModalOpen(true)}
            >
              <FolderTree className="w-4 h-4" />
              Cadastrar Subgrupo
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={() => setIsSectorModalOpen(true)}
            >
              <Network className="w-4 h-4" />
              Cadastrar Setor
            </Button>
          </aside>
        )}

        {/* CONTEÚDO */}
        <main className="flex-1 container px-4 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Gerencie os ativos de TI da sua organização
            </p>
          </div>

          <StatsCards />

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <LayoutDashboard className="w-4 h-4" />
                Listagem
              </TabsTrigger>

              <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="w-4 h-4" />
                Gráficos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6 space-y-6">
              <AssetFilters filters={filters} onFiltersChange={setFilters} />
              <AssetTable
                filters={filters}
                onView={(asset) => {
                  setSelectedAsset(asset);
                  setModalMode('view');
                  setIsAssetModalOpen(true);
                }}
                onEdit={(asset) => {
                  setSelectedAsset(asset);
                  setModalMode('edit');
                  setIsAssetModalOpen(true);
                }}
                onDeactivate={(asset) => {
                  setSelectedAsset(asset);
                  setIsDeactivateModalOpen(true);
                }}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsCharts />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* ===== MODAIS ===== */}
      <AssetModalCadastrarAtivo
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        asset={selectedAsset}
        mode={modalMode}
      />

      <BrandModal open={isBrandModalOpen} onOpenChange={setIsBrandModalOpen} />
      <CompanyModal open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen} />
      <GroupModal open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen} />
      <AssetModalSubGrupo
        isOpen={isSubgroupModalOpen}
        onClose={() => setIsSubgroupModalOpen(false)}
      />
      <SectorModal open={isSectorModalOpen} onOpenChange={setIsSectorModalOpen} />

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}