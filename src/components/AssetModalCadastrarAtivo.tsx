import React, { useEffect, useRef, useState } from 'react';
import { Asset, AssetFormData } from '@/types/asset';
import { useAssets } from '@/contexts/AssetContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset | null;
  mode: 'create' | 'edit' | 'view';
}

/** Campos obrigatórios para cadastro/edição (chave do formulário -> label para mensagem) */
const REQUIRED_FIELDS: { key: keyof AssetFormData; label: string }[] = [
  { key: 'code', label: 'Código' },
  { key: 'name', label: 'Nome' },
  { key: 'description', label: 'Descrição' },
  { key: 'brand', label: 'Marca' },
  { key: 'model', label: 'Modelo' },
  { key: 'company', label: 'Empresa' },
  { key: 'sector', label: 'Setor' },
  { key: 'group', label: 'Grupo' },
  { key: 'subgroup', label: 'Subgrupo' },
  { key: 'status', label: 'Status' },
  { key: 'ondeEsta', label: 'Onde está localizado!' },
];

function getValidationErrors(data: AssetFormData): string[] {
  const missing: string[] = [];
  for (const { key, label } of REQUIRED_FIELDS) {
    const value = data[key];
    if (value === undefined || value === null || String(value).trim() === '') {
      missing.push(label);
    }
  }
  return missing;
}

/** Verifica se já existe outro ativo com o mesmo código ou nome (no cadastro ou na edição). */
function getDuplicateErrors(
  data: AssetFormData,
  assets: Asset[],
  excludeAssetId: string | null
): string[] {
  const errors: string[] = [];
  const codeNorm = String(data.code ?? '').trim().toLowerCase();
  const nameNorm = String(data.name ?? '').trim().toLowerCase();
  const others = excludeAssetId
    ? assets.filter(a => a.id !== excludeAssetId)
    : assets;

  const codeExists = others.some(
    a => String(a.code ?? '').trim().toLowerCase() === codeNorm
  );
  const nameExists = others.some(
    a => String(a.name ?? '').trim().toLowerCase() === nameNorm
  );

  if (codeExists) errors.push('Código já cadastrado');
  if (nameExists) errors.push('Nome já cadastrado');
  return errors;
}

const INITIAL_FORM: AssetFormData = {
  code: '',
  name: '',
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
  status: 'active',
  ondeEsta: '',
};

export function AssetModalCadastrarAtivo({ isOpen, onClose, asset, mode }: AssetModalProps) {
  const { assets, addAsset, updateAsset, brands, companies, groups, subgroups, sectors } = useAssets();

  const [formData, setFormData] = useState<AssetFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isView = mode === 'view';

  useEffect(() => {
    if (isOpen) {
      if (asset && mode !== 'create') {
        setFormData({
          ...INITIAL_FORM,
          ...asset,
          group: asset.group ? String(asset.group) : '',
          subgroup: asset.subgroup ? String(asset.subgroup) : '',
          imageUrl: asset.imageUrl ?? '',
          status: asset.status || 'active',
          ondeEsta: asset.ondeEsta || '',
        });
      } else {
        setFormData(INITIAL_FORM);
      }
    }
  }, [asset, mode, isOpen]);

  function handleChange(field: keyof AssetFormData, value: string) {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'group') updated.subgroup = '';
      return updated;
    });
  }

  async function handleImageUpload(file: File) {
    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      const res = await fetch('http://localhost:3000/upload', { method: 'POST', body: data });
      if (!res.ok) throw new Error();
      const json = await res.json();
      handleChange('imageUrl', json.imageUrl ?? '');
      toast.success('Imagem enviada com sucesso');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const errors = getValidationErrors(formData);
    if (errors.length > 0) {
      toast.error(`Preencha todos os campos obrigatórios: ${errors.join(', ')}`);
      return;
    }

    const duplicateErrors = getDuplicateErrors(
      formData,
      assets,
      mode === 'edit' && asset?.id ? asset.id : null
    );
    if (duplicateErrors.length > 0) {
      toast.error(duplicateErrors.join('. '));
      return;
    }

    setLoading(true);

    try {
      if (mode === 'edit' && asset?.id) {
        // Atualizar usando o contexto (que já refaz o fetch da lista)
        await updateAsset(asset.id, formData);
        toast.success('Ativo atualizado com sucesso');
      } else {
        // POST para criar ativo
        await addAsset(formData);
        toast.success('Ativo cadastrado com sucesso');
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro ao salvar ativo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Ativo' : mode === 'view' ? 'Visualizar Ativo' : 'Cadastrar Ativo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* IMAGEM */}
          <div className="flex gap-4 items-start">
            <div className="w-28 h-28 border rounded flex items-center justify-center overflow-hidden bg-muted">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Ativo" />
              ) : (
                <Upload className="opacity-40" />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Input
                placeholder="URL da imagem"
                value={formData.imageUrl ?? ''}
                onChange={e => handleChange('imageUrl', e.target.value)}
                disabled={isView}
              />
              {!isView && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Escolher arquivo'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                </>
              )}
            </div>
          </div>

          {/* CÓDIGO / NOME */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Código"
              value={formData.code ?? ''}
              onChange={e => handleChange('code', e.target.value)}
              disabled={isView}
            />
            <Input
              placeholder="Nome"
              value={formData.name ?? ''}
              onChange={e => handleChange('name', e.target.value)}
              disabled={isView}
            />
          </div>

          {/* MODELO */}
          <Input
            placeholder="Modelo"
            value={formData.model ?? ''}
            onChange={e => handleChange('model', e.target.value)}
            disabled={isView}
          />

          {/* Marca / Empresa */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.brand ?? ''}
              onValueChange={v => handleChange('brand', v)}
              disabled={isView}
            >
              <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
              <SelectContent>
                {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select
              value={formData.company ?? ''}
              onValueChange={v => handleChange('company', v)}
              disabled={isView}
            >
              <SelectTrigger><SelectValue placeholder="Empresa" /></SelectTrigger>
              <SelectContent>
                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Grupo */}
          <Select
            value={formData.group ?? ''}
            onValueChange={v => handleChange('group', v)}
            disabled={isView}
          >
            <SelectTrigger><SelectValue placeholder="Grupo" /></SelectTrigger>
            <SelectContent>
              {groups.map(g => (
                <SelectItem key={g.idGrupo} value={String(g.idGrupo)}>
                  {g.descricaoGrupo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subgrupo */}
          <Select
            value={formData.subgroup ?? ''}
            onValueChange={v => handleChange('subgroup', v)}
            disabled={isView || !formData.group}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.group ? "Selecione o Subgrupo" : "Selecione um Grupo primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {subgroups
                .filter(sg => String(sg.idGrupo) === String(formData.group))
                .map(sg => (
                  <SelectItem key={sg.idSubgrupo} value={String(sg.idSubgrupo)}>
                    {sg.descricaoSubgrupo}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Setor / Status */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={formData.sector ?? ''}
              onValueChange={v => handleChange('sector', v)}
              disabled={isView}
            >
              <SelectTrigger><SelectValue placeholder="Setor" /></SelectTrigger>
              <SelectContent>
                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select
              value={formData.status ?? ''}
              onValueChange={v => handleChange('status', v)}
              disabled={isView}
            >
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onde está e descrição */}
          <Input
            placeholder="Onde está localizado"
            value={formData.ondeEsta ?? ''}
            onChange={e => handleChange('ondeEsta', e.target.value)}
            disabled={isView}
          />
          <Textarea
            placeholder="Descrição"
            value={formData.description ?? ''}
            onChange={e => handleChange('description', e.target.value)}
            disabled={isView}
          />

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            {!isView && (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {mode === 'edit' ? 'Atualizar' : 'Salvar'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
