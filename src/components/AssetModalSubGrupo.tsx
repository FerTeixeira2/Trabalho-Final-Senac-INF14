import React, { useState } from 'react';
import { useAssets } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AssetModalSubGrupoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssetModalSubGrupo({ isOpen, onClose }: AssetModalSubGrupoProps) {
  const { addSubgroup, groups } = useAssets();
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!name || !groupId) {
      toast.error('Nome e grupo são obrigatórios');
      return;
    }

    try {
      await addSubgroup({ name, groupId, description });
      toast.success('Subgrupo cadastrado com sucesso');
      setName('');
      setGroupId(null);
      setDescription('');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar subgrupo');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={val => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Subgrupo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome do Subgrupo</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Grupo</Label>
            <Select
              value={groupId !== null ? String(groupId) : undefined}
              onValueChange={val => setGroupId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(g => (
                  <SelectItem
                    key={g.idGrupo} // ✅ key única
                    value={String(g.idGrupo)}
                  >
                    {g.descricaoGrupo}
                  </SelectItem>
                ))}
              </SelectContent>

            </Select>
          </div>
          <div>
            <Label>Descrição</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <Button onClick={handleSubmit}>Cadastrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
