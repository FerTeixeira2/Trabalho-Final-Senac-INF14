import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAssets } from "@/contexts/AssetContext";
import { toast } from "sonner"; // IMPORTAR TOAST

interface GroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupModal({ open, onOpenChange }: GroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const { addGroup } = useAssets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      await addGroup({ name: groupName }); // cadastra no back-end
      setGroupName(""); // limpa input
      onOpenChange(false); // fecha modal
      toast.success("Grupo cadastrado com sucesso!"); // mensagem de sucesso
    } catch (err) {
      console.error("Erro ao cadastrar grupo:", err);
      toast.error("Não foi possível cadastrar o grupo.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Cadastrar Grupo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Group Name Field */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-foreground">
              Nome do Grupo <span className="text-primary">*</span>
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Equipamentos de TI..."
              required
              className="bg-input/50 border-border focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
