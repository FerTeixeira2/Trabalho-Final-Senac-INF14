import { useState } from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GroupListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupListModal({ open, onOpenChange }: GroupListModalProps) {
  const { groups, updateGroup, deleteGroup } = useAssets();
  const [editing, setEditing] = useState<{ idGrupo: number; descricaoGrupo: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Excluir o grupo "${name}"?`)) return;
    try {
      await deleteGroup(id);
      toast.success('Grupo excluído');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir');
    }
  };

  const openEdit = (g: { idGrupo: number; descricaoGrupo: string }) => {
    setEditing(g);
    setEditName(g.descricaoGrupo);
  };

  const handleSaveEdit = async () => {
    if (!editing || !editName.trim()) return;
    setSaving(true);
    try {
      await updateGroup(editing.idGrupo, { name: editName.trim() });
      toast.success('Grupo atualizado');
      setEditing(null);
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
            <DialogTitle>Grupos cadastrados</DialogTitle>
          </DialogHeader>
          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum grupo cadastrado.</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {groups.map((g) => (
                <li
                  key={g.idGrupo}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="text-sm font-medium">{g.descricaoGrupo}</span>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(g)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(g.idGrupo, g.descricaoGrupo)}>
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
            <DialogTitle>Editar grupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome do grupo" />
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
