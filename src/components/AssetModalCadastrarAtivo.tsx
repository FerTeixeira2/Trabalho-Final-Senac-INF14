import React, { useEffect, useState } from 'react';
import { Asset, AssetFormData } from '@/types/asset';
import { useAssets } from '@/contexts/AssetContext';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset | null;
  mode: 'create' | 'edit' | 'view';
}

const INITIAL_FORM: AssetFormData = {
  code: '',
  description: '',
  brand: '',
  model: '',
  serialNumber: '',
  responsibleUser: 'ADM',
  company: '',
  sector: '',
  group: '',
  subgroup: '',
  observations: '',
  imageUrl: '',
  status: 'active', // ✅ status padrão (fix to match type)
  name: '',
};

export function AssetModalCadastrarAtivo({ isOpen, onClose, asset, mode }: AssetModalProps) {
  const { addAsset, brands, companies, groups, subgroups, sectors, statusOptions } = useAssets();
  const [formData, setFormData] = useState<AssetFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const isView = mode === 'view';

  useEffect(() => {
    if (asset && mode !== 'create') {
      setFormData({
        code: asset.code ?? '',
        description: asset.description ?? '',
        brand: asset.brand ?? '',
        model: asset.model ?? '',
        serialNumber: asset.serialNumber ?? '',
        responsibleUser: asset.responsibleUser ?? 'ADM',
        company: asset.company ?? '',
        sector: asset.sector ?? '',
        group: asset.group ?? '',
        subgroup: asset.subgroup ?? '',
        observations: asset.observations ?? '',
        imageUrl: asset.imageUrl ?? '',
        status: asset.status === 'active' ? 'active' : 'inactive',
        name: asset.name ?? '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [asset, mode, isOpen]);

  function handleChange(field: keyof AssetFormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        await addAsset(formData);
        toast.success('Ativo cadastrado com sucesso');
      } else {
        toast.info('Edição ainda não implementada');
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar ativo');
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === 'create'
      ? 'Cadastrar Ativo'
      : mode === 'edit'
      ? 'Editar Ativo'
      : 'Visualizar Ativo';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IMAGEM */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 border rounded-lg flex items-center justify-center overflow-hidden">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Imagem do ativo" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>

            {!isView && (
              <>
                <Label htmlFor="image" className="cursor-pointer text-primary">
                  Selecionar imagem
                </Label>
                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </>
            )}
          </div>

          {/* CAMPOS TEXTO */}
          <Input placeholder="Código" value={formData.code} disabled={isView} onChange={e => handleChange('code', e.target.value)} />
          <Input placeholder="Descrição" value={formData.description} disabled={isView} onChange={e => handleChange('description', e.target.value)} />
          <Input placeholder="Modelo" value={formData.model} disabled={isView} onChange={e => handleChange('model', e.target.value)} />

          {/* SELECTS */}
          <Select value={formData.brand} disabled={isView} onValueChange={value => handleChange('brand', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.company} disabled={isView} onValueChange={value => handleChange('company', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.sector} disabled={isView} onValueChange={value => handleChange('sector', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o setor" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.group} disabled={isView} onValueChange={value => handleChange('group', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o grupo" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formData.subgroup} disabled={isView} onValueChange={value => handleChange('subgroup', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o subgrupo" />
            </SelectTrigger>
            <SelectContent>
              {subgroups.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* STATUS DINÂMICO */}
          <Select value={formData.status} disabled={isView} onValueChange={value => handleChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Observações"
            value={formData.observations}
            disabled={isView}
            onChange={e => handleChange('observations', e.target.value)}
          />

          {!isView && (
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Salvar
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
