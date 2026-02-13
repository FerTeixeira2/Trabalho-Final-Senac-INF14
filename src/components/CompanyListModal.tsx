import { useState, useEffect } from 'react';
import { useAssets, type CompanyItem } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const maskCNPJ = (value: string) => {
  value = value.replace(/\D/g, '').substring(0, 14);
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  return value;
};

interface CompanyListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyListModal({ open, onOpenChange }: CompanyListModalProps) {
  const { fetchCompaniesList, updateCompany, deleteCompany } = useAssets();
  const [list, setList] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CompanyItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCnpj, setEditCnpj] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCompaniesList();
      setList(data);
    } catch {
      toast.error('Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async (item: CompanyItem) => {
    if (!window.confirm(`Excluir a empresa "${item.descricaoEmpresa}"?`)) return;
    try {
      await deleteCompany(item.idEmpresa);
      toast.success('Empresa excluída');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir');
    }
  };

  const openEdit = (item: CompanyItem) => {
    setEditing(item);
    setEditName(item.descricaoEmpresa);
    setEditCnpj(item.cnpjEmpresa ? maskCNPJ(item.cnpjEmpresa) : '');
    setEditDescription(item.descricao || '');
  };

  const handleSaveEdit = async () => {
    if (!editing || !editName.trim()) return;
    setSaving(true);
    try {
      await updateCompany(editing.idEmpresa, {
        name: editName.trim(),
        cnpj: editCnpj.replace(/\D/g, '') || undefined,
        description: editDescription || undefined,
      });
      toast.success('Empresa atualizada');
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Empresas cadastradas</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhuma empresa cadastrada.</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {list.map((item) => (
                <li
                  key={item.idEmpresa}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="text-sm font-medium">{item.descricaoEmpresa}</span>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar empresa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome da empresa" />
            </div>
            <div>
              <Label>CNPJ</Label>
              <Input value={editCnpj} onChange={(e) => setEditCnpj(maskCNPJ(e.target.value))} placeholder="00.000.000/0001-00" maxLength={18} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button onClick={handleSaveEdit} disabled={saving || !editName.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
