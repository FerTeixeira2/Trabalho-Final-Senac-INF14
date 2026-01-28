import React, { useState } from 'react';
import { Asset, FilterState } from '@/types/asset';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { AssetFilters } from '@/components/AssetFilters';
import { AssetTable } from '@/components/AssetTable';
import { AssetModal } from '@/components/AssetModal';
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
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // 👉 FUNÇÃO ATIVA PARA CADASTRAR ATIVO
  const handleCreate = () => {
    setSelectedAsset(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        {/* SIDEBAR ESQUERDA */}
        {isAdmin && (
          <aside className="w-64 min-h-screen border-r border-border bg-muted/30 p-4 space-y-2">
            <Button
              className="w-full justify-start gap-2"
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4" />
              Cadastrar Ativo
            </Button>

            <Button variant="secondary" className="w-full justify-start gap-2">
              <Layers className="w-4 h-4" />
              Cadastrar Marca
            </Button>

            <Button variant="secondary" className="w-full justify-start gap-2">
              <Building2 className="w-4 h-4" />
              Cadastrar Empresa
            </Button>

            <Button variant="secondary" className="w-full justify-start gap-2">
              <FolderTree className="w-4 h-4" />
              Cadastrar Grupo
            </Button>

            <Button variant="secondary" className="w-full justify-start gap-2">
              <FolderTree className="w-4 h-4" />
              Cadastrar Subgrupo
            </Button>

            <Button variant="secondary" className="w-full justify-start gap-2">
              <Network className="w-4 h-4" />
              Cadastrar Setor
            </Button>
          </aside>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 container px-4 py-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Gerencie os ativos de TI da sua organização
            </p>
          </div>

          {/* Stats */}
          <StatsCards />

          {/* Tabs */}
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger
                value="table"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LayoutDashboard className="w-4 h-4" />
                Listagem
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="w-4 h-4" />
                Gráficos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6 space-y-6">
              <AssetFilters filters={filters} onFiltersChange={setFilters} />

              <AssetTable
                filters={filters}
                onEdit={() => {}}
                onView={() => {}}
                onDeactivate={() => {}}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsCharts />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* MODAIS */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        asset={selectedAsset}
        mode={modalMode}
      />

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        asset={selectedAsset}
      />
    </div>
  );
}
