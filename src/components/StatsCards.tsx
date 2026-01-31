import React from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { Monitor, CheckCircle, XCircle, Building2 } from 'lucide-react';

export function StatsCards() {
  const { assets, loading } = useAssets();

  // Evita tela preta enquanto carrega
  if (loading) {
    return null; // ou spinner depois
  }

  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status === 'active').length;
  const inactiveAssets = assets.filter(a => a.status === 'inactive').length;

  // Empresas únicas
  const companies = Array.from(
    new Set(assets.map(asset => asset.company))
  );

  const totalCompanies = companies.length;

  const stats = [
    {
      label: 'Total de Ativos',
      value: totalAssets,
      icon: Monitor,
      color: 'primary',
    },
    {
      label: 'Ativos',
      value: activeAssets,
      icon: CheckCircle,
      color: 'accent',
    },
    {
      label: 'Baixados',
      value: inactiveAssets,
      icon: XCircle,
      color: 'destructive',
    },
    {
      label: 'Empresas',
      value: totalCompanies,
      icon: Building2,
      color: 'primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-4 card-hover fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg
                ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                ${stat.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
                ${stat.color === 'destructive' ? 'bg-destructive/10 text-destructive' : ''}
              `}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>

          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
