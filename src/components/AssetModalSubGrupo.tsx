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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubgroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - replace with real data from your backend
const mockGroups = [
  { id: "1", name: "Equipamentos de TI" },
  { id: "2", name: "Móveis" },
  { id: "3", name: "Veículos" },
];

export function SubgroupModal({ open, onOpenChange }: SubgroupModalProps) {
  const [subgroupName, setSubgroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ subgroupName, selectedGroup, description });
    setSubgroupName("");
    setSelectedGroup("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Cadastrar Subgrupo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Group Select Field */}
          <div className="space-y-2">
            <Label htmlFor="group" className="text-sm font-medium text-foreground">
              Grupo <span className="text-primary">*</span>
            </Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup} required>
              <SelectTrigger className="bg-input/50 border-border focus:border-primary focus:ring-primary">
                <SelectValue placeholder="Selecione um grupo..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {mockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subgroup Name Field */}
          <div className="space-y-2">
            <Label htmlFor="subgroupName" className="text-sm font-medium text-foreground">
              Nome do Subgrupo <span className="text-primary">*</span>
            </Label>
            <Input
              id="subgroupName"
              value={subgroupName}
              onChange={(e) => setSubgroupName(e.target.value)}
              placeholder="Ex: Notebooks..."
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
              placeholder="Descrição opcional do subgrupo..."
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