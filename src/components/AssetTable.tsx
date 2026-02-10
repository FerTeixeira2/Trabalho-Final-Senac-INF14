import React from 'react';
import { Asset, FilterState } from '@/types/asset';
import { useAssets } from '@/contexts/AssetContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Monitor } from 'lucide-react';

interface AssetTableProps {
  filters: FilterState;
  onEdit: (asset: Asset) => void;
  onView: (asset: Asset) => void;
  onDeactivate: (asset: Asset) => void;
}

export function AssetTable({
  filters,
  onEdit,
  onView,
  onDeactivate,
}: AssetTableProps) {
  const { assets } = useAssets();
  const { isAdmin } = useAuth();

  const filteredAssets = assets.filter(asset => {
    const searchLower = filters.search.toLowerCase();

    const matchesSearch =
      !filters.search ||
      asset.code.toLowerCase().includes(searchLower) ||
      asset.name.toLowerCase().includes(searchLower) ||
      asset.description.toLowerCase().includes(searchLower);

    const matchesBrand =
      !filters.brand || filters.brand === 'all' || asset.brand === filters.brand;

    const matchesModel =
      !filters.model || filters.model === 'all' || asset.model === filters.model;

    const matchesStatus =
      !filters.status || filters.status === 'all' || asset.status === filters.status;

    const matchesCompany =
      !filters.company ||
      filters.company === 'all' ||
      asset.company === filters.company;

    const matchesSector =
      !filters.sector ||
      filters.sector === 'all' ||
      asset.sector === filters.sector;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesModel &&
      matchesStatus &&
      matchesCompany &&
      matchesSector
    );
  });

  if (filteredAssets.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Monitor className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum ativo encontrado
        </h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                Código
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm text-muted-foreground">
                Imagem
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                Descrição
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground hidden md:table-cell">
                Marca / Modelo
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground hidden lg:table-cell">
                Empresa
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground hidden lg:table-cell">
                Setor
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground hidden lg:table-cell">
                Onde esta localizado
              </th>
              <th className="px-4 py-3 text-left text-sm text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((asset, index) => (
              <tr
                key={asset.id}
                className="border-b border-border last:border-0 fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-4 py-3 font-mono text-sm text-primary">
                  {asset.code}
                </td>

                <td className="px-4 py-3 text-sm text-foreground">
                  {asset.name}
                </td>

                <td className="px-5 py-4">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-14 h-14 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-4 py-3">
                  <p className="text-sm text-foreground line-clamp-2">
                    {asset.description}
                  </p>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-sm">{asset.brand}</p>
                  <p className="text-xs text-muted-foreground">{asset.model}</p>
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {asset.company}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {asset.sector}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {asset.ondeEsta}
                </td>

                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={
                      asset.status === 'active'
                        ? 'status-active'
                        : 'status-inactive'
                    }
                  >
                    {asset.status === 'active' ? 'Ativo' : 'Baixado'}
                  </Badge>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(asset)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(asset)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {asset.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeactivate(asset)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredAssets.length} de {assets.length} ativos
        </p>
      </div>
    </div>
  );
}
