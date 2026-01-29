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
import { Textarea } from "@/components/ui/textarea";

interface SectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SectorModal({ open, onOpenChange }: SectorModalProps) {
  const [sectorName, setSectorName] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSectorName("");
    onOpenChange(false);
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