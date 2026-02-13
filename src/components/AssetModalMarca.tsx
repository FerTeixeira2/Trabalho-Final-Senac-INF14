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
import { toast } from "sonner";
import { List } from "lucide-react";
import { BrandListModal } from "./BrandListModal";

interface BrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandModal({ open, onOpenChange }: BrandModalProps) {
  const [brandName, setBrandName] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const { addBrand } = useAssets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return; // evita cadastro vazio

    try {
      await addBrand({ name: brandName }); // chama o back-end
      setBrandName(""); // limpa input
      onOpenChange(false); // fecha modal
      toast.success("Marca cadastrada com sucesso!"); // mensagem de sucesso
    } catch (err) {
      console.error("Erro ao cadastrar marca:", err);
      toast.error("Marca já existente!");
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Cadastrar Marca
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Brand Name Field */}
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-sm font-medium text-foreground">
              Nome da Marca <span className="text-primary">*</span>
            </Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ex: Dell, HP, Lenovo..."
              required
              className="bg-input/50 border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setListOpen(true)}
              className="w-full"
            >
              <List className="w-4 h-4 mr-2" />
              Gerenciar marcas cadastradas
            </Button>
            <div className="flex gap-3">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
    <BrandListModal open={listOpen} onOpenChange={setListOpen} />
    </>
  );
}
