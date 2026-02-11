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
import { useAssets } from "@/contexts/AssetContext";
import { toast } from "sonner";

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Limpa o CNPJ (apenas números)
const cleanCNPJ = (cnpj: string) => cnpj.replace(/\D/g, '');

// Valida o CNPJ
const isValidCNPJ = (cnpj: string) => {
  cnpj = cleanCNPJ(cnpj);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false; // CNPJs repetidos são inválidos

  const calcCheckDigit = (cnpj: string, pos: number): number => {
    const weights = pos === 12
      ? [5,4,3,2,9,8,7,6,5,4,3,2]
      : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnpj[i]) * weights[i];
    }
    const res = sum % 11;
    return res < 2 ? 0 : 11 - res;
  };

  const d1 = calcCheckDigit(cnpj, 12);
  const d2 = calcCheckDigit(cnpj, 13);
  return d1 === parseInt(cnpj[12]) && d2 === parseInt(cnpj[13]);
};

// Aplica máscara enquanto digita
const maskCNPJ = (value: string) => {
  value = value.replace(/\D/g, '');       // Remove tudo que não é número
  value = value.substring(0, 14);         // Limita a 14 dígitos

  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');

  return value;
};

export function CompanyModal({ open, onOpenChange }: CompanyModalProps) {
  const { addCompany } = useAssets();

  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedCNPJ = cleanCNPJ(cnpj);

    if (cnpj && !isValidCNPJ(cleanedCNPJ)) {
      toast.error("CNPJ inválido!");
      return;
    }

    try {
      setLoading(true);

      await addCompany({
        name: companyName,
        cnpj: cleanedCNPJ,  // salva somente números no banco
        description,
      });

      toast.success("Empresa cadastrada com sucesso!");
      setCompanyName("");
      setCnpj("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar empresa. Nome da empresa ou CNPJ já cadastrado!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome da Empresa *</Label>
            <Input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>CNPJ</Label>
            <Input
              value={cnpj}
              onChange={e => setCnpj(maskCNPJ(e.target.value))}
              placeholder="00.000.000/0001-00"
              maxLength={18}
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
