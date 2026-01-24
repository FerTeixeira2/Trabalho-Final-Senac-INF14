import React, { useState, useEffect } from 'react';
import { Asset, AssetFormData } from '@/types/asset';
import { useAssets } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
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
  responsibleUser: '',
  company: '',
  sector: '',
  group: '',
  subgroup: '',
  observations: '',
  imageUrl: '',
  status: 'active',
};

export function AssetModal({ isOpen, onClose, asset, mode }: AssetModalProps) {
  const { addAsset, updateAsset } = useAssets();
  const [formData, setFormData] = useState<AssetFormData>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (asset && (mode === 'edit' || mode === 'view')) {
      setFormData({
        code: asset.code,
        description: asset.description,
        brand: asset.brand,
        model: asset.model,
        serialNumber: asset.serialNumber,
        responsibleUser: asset.responsibleUser,
        company: asset.company,
        sector: asset.sector,
        group: asset.group,
        subgroup: asset.subgroup,
        observations: asset.observations,
        imageUrl: asset.imageUrl,
        status: asset.status,
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [asset, mode, isOpen]);

  const handleChange = (field: keyof AssetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Código é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.brand.trim()) newErrors.brand = 'Marca é obrigatória';
    if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Número de série é obrigatório';
    if (!formData.responsibleUser.trim()) newErrors.responsibleUser = 'Responsável é obrigatório';
    if (!formData.company.trim()) newErrors.company = 'Empresa é obrigatória';
    if (!formData.sector.trim()) newErrors.sector = 'Setor é obrigatório';
    if (!formData.group.trim()) newErrors.group = 'Grupo é obrigatório';
    if (!formData.subgroup.trim()) newErrors.subgroup = 'Subgrupo é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mode === 'create') {
      addAsset(formData);
      toast.success('Ativo cadastrado com sucesso!');
    } else if (mode === 'edit' && asset) {
      updateAsset(asset.id, formData);
      toast.success('Ativo atualizado com sucesso!');
    }

    setIsLoading(false);
    onClose();
  };

  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Cadastrar Ativo' : mode === 'edit' ? 'Editar Ativo' : 'Detalhes do Ativo';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Asset" className="w-full h-full object-cover" />
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={() => handleChange('imageUrl', '')}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </>
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {!isViewMode && (
              <div>
                <Label htmlFor="image" className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">
                    Selecionar imagem
                  </span>
                </Label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG ou GIF. Max 5MB.
                </p>
              </div>
            )}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                disabled={isViewMode}
                className={errors.code ? 'border-destructive' : ''}
              />
              {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de Série *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                disabled={isViewMode}
                className={errors.serialNumber ? 'border-destructive' : ''}
              />
              {errors.serialNumber && <p className="text-xs text-destructive">{errors.serialNumber}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={isViewMode}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                disabled={isViewMode}
                className={errors.brand ? 'border-destructive' : ''}
              />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                disabled={isViewMode}
                className={errors.model ? 'border-destructive' : ''}
              />
              {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleUser">Usuário Responsável *</Label>
              <Input
                id="responsibleUser"
                value={formData.responsibleUser}
                onChange={(e) => handleChange('responsibleUser', e.target.value)}
                disabled={isViewMode}
                className={errors.responsibleUser ? 'border-destructive' : ''}
              />
              {errors.responsibleUser && <p className="text-xs text-destructive">{errors.responsibleUser}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                disabled={isViewMode}
                className={errors.company ? 'border-destructive' : ''}
              />
              {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Setor *</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => handleChange('sector', e.target.value)}
                disabled={isViewMode}
                className={errors.sector ? 'border-destructive' : ''}
              />
              {errors.sector && <p className="text-xs text-destructive">{errors.sector}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Grupo *</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                disabled={isViewMode}
                className={errors.group ? 'border-destructive' : ''}
              />
              {errors.group && <p className="text-xs text-destructive">{errors.group}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subgroup">Subgrupo *</Label>
              <Input
                id="subgroup"
                value={formData.subgroup}
                onChange={(e) => handleChange('subgroup', e.target.value)}
                disabled={isViewMode}
                className={errors.subgroup ? 'border-destructive' : ''}
              />
              {errors.subgroup && <p className="text-xs text-destructive">{errors.subgroup}</p>}
            </div>

            {mode !== 'create' && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange('status', v as 'active' | 'inactive')}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Baixado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                disabled={isViewMode}
                rows={3}
              />
            </div>
          </div>

          {/* View mode additional info */}
          {isViewMode && asset && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Data de Cadastro:</span>{' '}
                {new Date(asset.registrationDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          {/* Actions */}
          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : mode === 'create' ? (
                  'Cadastrar'
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
