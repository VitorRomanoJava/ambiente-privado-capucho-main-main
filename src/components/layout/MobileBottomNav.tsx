import { Button } from "@/components/ui/button";
import { Package, Settings } from "lucide-react";

interface MobileBottomNavProps {
  onProductSelectorClick: () => void;
  onArtSettingsClick: () => void;
}

export function MobileBottomNav({
  onProductSelectorClick,
  onArtSettingsClick,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-14 w-14"
          onClick={onProductSelectorClick}
          aria-label="Selecionar Produto"
        >
          <Package className="h-7 w-7" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-14 w-14"
          onClick={onArtSettingsClick}
          aria-label="Configurações da Arte"
        >
          <Settings className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
}