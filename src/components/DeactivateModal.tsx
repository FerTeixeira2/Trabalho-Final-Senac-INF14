import React, { useState } from 'react';
import { Asset } from '@/types/asset';
import { useAssets } from '@/contexts/AssetContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export function DeactivateModal({ isOpen, onClose, asset }: DeactivateModalProps) {
  const { deactivateAsset } = useAssets();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeactivate = async () => {
    if (!asset) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    deactivateAsset(asset.id);
    toast.success('Ativo baixado com sucesso!');
    
    setIsLoading(false);
    onClose();
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>Confirmar Baixa</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Você está prestes a dar baixa no ativo:
          </p>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="font-mono text-sm font-medium text-primary">{asset.code}</p>
            <p className="text-sm text-foreground mt-1">{asset.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              S/N: {asset.serialNumber}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDeactivate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Baixa'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
