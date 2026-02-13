import { useState, useEffect } from 'react';
import { useAssets, type SectorItem } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SectorListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectorListModal({ open, onOpenChange }: SectorListModalProps) {
  const { fetchSectorsList, updateSector, deleteSector } = useAssets();
  const [list, setList] = useState<SectorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<SectorItem | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSectorsList();
      setList(data);
    } catch {
      toast.error('Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async (item: SectorItem) => {
    if (!window.confirm(`Excluir o setor "${item.descricaoSetor}"?`)) return;
    try {
      await deleteSector(item.idSetor);
      toast.success('Setor excluído');
      load();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir');
    }
  };

  const openEdit = (item: SectorItem) => {
    setEditing(item);
    setEditName(item.descricaoSetor);
  };

  const handleSaveEdit = async () => {
    if (!editing || !editName.trim()) return;
    setSaving(true);
    try {
      await updateSector(editing.idSetor, { name: editName.trim() });
      toast.success('Setor atualizado');
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
            <DialogTitle>Setores cadastrados</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum setor cadastrado.</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {list.map((item) => (
                <li
                  key={item.idSetor}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="text-sm font-medium">{item.descricaoSetor}</span>
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
            <DialogTitle>Editar setor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome do setor" />
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
