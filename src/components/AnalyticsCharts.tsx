import React from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--destructive))',
  'hsl(var(--accent))',
  'hsl(162, 100%, 50%)',
  'hsl(280, 100%, 60%)',
  'hsl(45, 100%, 50%)',
  'hsl(200, 100%, 50%)',
  'hsl(320, 100%, 50%)',
];

export function AnalyticsCharts() {
  const { assets } = useAssets();

  // Data by Status
  const statusData = React.useMemo(() => {
    const active = assets.filter(a => a.status === 'active').length;
    const inactive = assets.filter(a => a.status === 'inactive').length;
    return [
      { name: 'Ativos', value: active, fill: 'hsl(var(--primary))' },
      { name: 'Baixados', value: inactive, fill: 'hsl(var(--destructive))' },
    ].filter(item => item.value > 0);
  }, [assets]);

  // Data by Brand
  const brandData = React.useMemo(() => {
    const brandCount: Record<string, number> = {};
    assets.forEach(asset => {
      brandCount[asset.brand] = (brandCount[asset.brand] || 0) + 1;
    });
    return Object.entries(brandCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [assets]);

  // Data by Company
  const companyData = React.useMemo(() => {
    const companyCount: Record<string, number> = {};
    assets.forEach(asset => {
      companyCount[asset.company] = (companyCount[asset.company] || 0) + 1;
    });
    return Object.entries(companyCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  // Data by Sector
  const sectorData = React.useMemo(() => {
    const sectorCount: Record<string, number> = {};
    assets.forEach(asset => {
      sectorCount[asset.sector] = (sectorCount[asset.sector] || 0) + 1;
    });
    return Object.entries(sectorCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  // Data by Group
  const groupData = React.useMemo(() => {
    const groupCount: Record<string, number> = {};
    assets.forEach(asset => {
      groupCount[asset.group] = (groupCount[asset.group] || 0) + 1;
    });
    return Object.entries(groupCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [assets]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label || payload[0].name}</p>
          <p className="text-primary">
            Quantidade: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (assets.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum ativo cadastrado para exibir gráficos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Status Pie Chart */}
      <Card className="bg-card border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Status dos Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Brand Bar Chart */}
      <Card className="bg-card border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Ativos por Marca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={brandData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                animationBegin={0}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Company Bar Chart */}
      <Card className="bg-card border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Ativos por Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                radius={[4, 4, 0, 0]}
              >
                {companyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sector Bar Chart */}
      <Card className="bg-card border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Ativos por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                radius={[4, 4, 0, 0]}
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Group Pie Chart */}
      <Card className="bg-card border-border hover:border-primary/50 transition-colors lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Distribuição por Grupo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                animationBegin={0}
                animationDuration={800}
                radius={[4, 4, 0, 0]}
              >
                {groupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
