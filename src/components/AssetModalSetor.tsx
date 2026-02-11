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
import { useAssets } from "@/contexts/AssetContext"; // importar contexto
import { toast } from "sonner"; // importar toast

interface SectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectorModal({ open, onOpenChange }: SectorModalProps) {
  const [sectorName, setSectorName] = useState("");
  const { addSector } = useAssets(); // pegar função do contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorName.trim()) return; // evita cadastro vazio

    try {
      await addSector({ name: sectorName }); // cadastra no back-end
      setSectorName(""); // limpa input
      onOpenChange(false); // fecha modal
      toast.success("Setor cadastrado com sucesso!"); // mensagem de sucesso
    } catch (err) {
      console.error("Erro ao cadastrar setor:", err);
      toast.error("Setor já existente!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Cadastrar Setor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Sector Name Field */}
          <div className="space-y-2">
            <Label htmlFor="sectorName" className="text-sm font-medium text-foreground">
              Nome do Setor <span className="text-primary">*</span>
            </Label>
            <Input
              id="sectorName"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              placeholder="Ex: Financeiro, RH, TI..."
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
