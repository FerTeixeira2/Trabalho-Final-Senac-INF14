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
import { Upload, X } from "lucide-react";

interface BrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandModal({ open, onOpenChange }: BrandModalProps) {
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();    // Reset form
    setBrandName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
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

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional da marca..."
              rows={3}
              className="bg-input/50 border-border focus:border-primary focus:ring-primary resize-none"
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
