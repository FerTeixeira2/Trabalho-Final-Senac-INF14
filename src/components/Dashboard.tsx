import React, { useState } from 'react';
import { Asset, FilterState } from '@/types/asset';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { AssetFilters } from '@/components/AssetFilters';
import { AssetTable } from '@/components/AssetTable';
import { AssetModal } from '@/components/AssetModal';
import { DeactivateModal } from '@/components/DeactivateModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

  const handleCreate = () => {
    setSelectedAsset(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeactivate = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeactivateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Gerencie os ativos de TI da sua organização
            </p>
          </div>
          {isAdmin && (
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Cadastrar Ativo
            </Button>
          )}
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Filters */}
        <AssetFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <AssetTable
          filters={filters}
          onEdit={handleEdit}
          onView={handleView}
          onDeactivate={handleDeactivate}
        />
      </main>

      {/* Modals */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        asset={selectedAsset}
        mode={modalMode}
      />

      <DeactivateModal
        isOpen={isDeactivateModalOpen}
        onClose={closeDeactivateModal}
        asset={selectedAsset}
      />
    </div>
  );
}
