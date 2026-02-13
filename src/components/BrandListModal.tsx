import { useState, useEffect } from 'react';
import { useAssets, type BrandItem } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BrandListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandListModal({ open, onOpenChange }: BrandListModalProps) {
  const { fetchBrandsList, updateBrand, deleteBrand } = useAssets();
  const [list, setList] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<BrandItem | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchBrandsList();
      setList(data);
    } catch {
      toast.error('Erro ao carregar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async (item: BrandItem) => {
    if (!window.confirm(`Excluir a marca "${item.descricaoMarca}"?`)) return;
    try {
      await deleteBrand(item.idMarca);
      toast.success('Marca excluída');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir');
    }
  };

  const openEdit = (item: BrandItem) => {
    setEditing(item);
    setEditName(item.descricaoMarca);
  };

  const handleSaveEdit = async () => {
    if (!editing || !editName.trim()) return;
    setSaving(true);
    try {
      await updateBrand(editing.idMarca, { name: editName.trim() });
      toast.success('Marca atualizada');
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
            <DialogTitle>Marcas cadastradas</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhuma marca cadastrada.</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {list.map((item) => (
                <li
                  key={item.idMarca}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="text-sm font-medium">{item.descricaoMarca}</span>
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar marca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome da marca" />
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
