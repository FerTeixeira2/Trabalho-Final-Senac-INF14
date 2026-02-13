import { useState } from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type SubgroupRow = { idSubgrupo: number; descricaoSubgrupo: string; idGrupo: number | null };

interface SubgroupListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubgroupListModal({ open, onOpenChange }: SubgroupListModalProps) {
  const { groups, subgroups, updateSubgroup, deleteSubgroup } = useAssets();
  const [editing, setEditing] = useState<SubgroupRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const subs = subgroups as unknown as { idSubgrupo: number; descricaoSubgrupo: string; idGrupo?: number }[];

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Excluir o subgrupo "${name}"?`)) return;
    try {
      await deleteSubgroup(id);
      toast.success('Subgrupo excluído');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir');
    }
  };

  const openEdit = (sg: SubgroupRow) => {
    setEditing(sg);
    setEditName(sg.descricaoSubgrupo);
    setEditGroupId(sg.idGrupo ?? (groups[0]?.idGrupo ?? null));
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editing || !editName.trim()) return;
    const groupId = editGroupId ?? groups[0]?.idGrupo;
    if (groupId == null) {
      toast.error('Selecione um grupo');
      return;
    }
    setSaving(true);
    try {
      await updateSubgroup(editing.idSubgrupo, { name: editName.trim(), groupId, description: editDescription || undefined });
      toast.success('Subgrupo atualizado');
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
            <DialogTitle>Subgrupos cadastrados</DialogTitle>
          </DialogHeader>
          {subs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum subgrupo cadastrado.</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {subs.map((sg) => (
                <li
                  key={sg.idSubgrupo}
                  className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30"
                >
                  <span className="text-sm font-medium">{sg.descricaoSubgrupo}</span>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit({ ...sg, idGrupo: sg.idGrupo ?? null })}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(sg.idSubgrupo, sg.descricaoSubgrupo)}>
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
            <DialogTitle>Editar subgrupo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome do subgrupo" />
            </div>
            <div>
              <Label>Grupo</Label>
              <Select
                value={editGroupId != null ? String(editGroupId) : ''}
                onValueChange={(v) => setEditGroupId(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.idGrupo} value={String(g.idGrupo)}>{g.descricaoGrupo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Opcional" />
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
