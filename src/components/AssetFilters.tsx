import React from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { FilterState } from '@/types/asset';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface AssetFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function AssetFilters({ filters, onFiltersChange }: AssetFiltersProps) {
  const { assets, loading } = useAssets();

  // 🔒 Proteção enquanto carrega
  if (loading) {
    return null;
  }

  const brands = Array.from(
    new Set(assets.map(a => a.brand).filter(b => b && b.trim() !== ''))
  );
  const models = Array.from(
    new Set(assets.map(a => a.model).filter(m => m && m.trim() !== ''))
  );
  const companies = Array.from(
    new Set(assets.map(a => a.company).filter(c => c && c.trim() !== ''))
  );
  const sectors = Array.from(
    new Set(assets.map(a => a.sector).filter(s => s && s.trim() !== ''))
  );

  function handleChange(key: keyof FilterState, value: string) {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  }

  function clearFilters() {
    onFiltersChange({
      search: '',
      brand: '',
      model: '',
      status: '',
      company: '',
      sector: ''
    });
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por código, descrição ou modelo"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filtros:</span>
        </div>

        {/* Marca */}
        <Select value={filters.brand} onValueChange={(v) => handleChange('brand', v)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Modelo */}
        <Select value={filters.model} onValueChange={(v) => handleChange('model', v)}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {models.map(model => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={filters.status} onValueChange={(v) => handleChange('status', v)}>
          <SelectTrigger className="w-[130px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Baixado</SelectItem>
          </SelectContent>
        </Select>

        {/* Empresa */}
        <Select value={filters.company} onValueChange={(v) => handleChange('company', v)}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {companies.map(company => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Setor */}
        <Select value={filters.sector} onValueChange={(v) => handleChange('sector', v)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Limpar filtros */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
