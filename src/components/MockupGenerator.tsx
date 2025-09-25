// Arquivo: src/components/MockupGenerator.tsx
// Descrição: Versão com lógica de download híbrida para mockups 2D e 3D.

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';

// Importação do editor de arte
import { ArtEditor } from "@/components/ArtEditor";

// Importações dos visualizadores 3D e 2D
import { Mug3DViewer } from "@/components/3d/Mug3DViewer";
import { TshirtViewer } from "@/components/3d/TshirtViewer";
import { CapViewer } from "@/components/3d/CapViewer";
import { XicaraViewer } from "@/components/3d/XicaraViewer";
import { LongSleeveViewer } from "@/components/3d/LongSleeveViewer";
import { Apron2DViewer } from "@/components/2d/Apron2DViewer";
import { Azulejo2DViewer } from "@/components/2d/Azulejo2DViewer";
import { Almofada2DViewer } from "@/components/2d/Almofada2DViewer";
import { BabyBody2DViewer } from "@/components/2d/BabyBody2DViewer";
import { Squeeze2DViewer } from "./2d/Squeeze2DViewer";
import { ChoppMug2DViewer } from "@/components/2d/ChoppMug2DViewer";

// Importação de ícones
import {
  Download, Palette, Wand2, RotateCw, Move3d, ArrowLeftRight, ArrowUpDown, Upload,
  Shirt, Coffee, HardHat, Sparkles, Ruler, CupSoda, ChefHat, Square, BedDouble, Baby, GlassWater, Beer, ImageDown,
  FlipHorizontal, FlipVertical
} from "lucide-react";


// --- Definições de Configuração (sem alterações) ---
const availableProducts = [
  { id: "mug", name: "Caneca", icon: Coffee },
  { id: "xicara", name: "Xícara", icon: CupSoda },
  { id: "tshirt", name: "Camiseta", icon: Shirt },
  { id: "long_sleeve", name: "Camiseta Manga Longa", icon: Shirt },
  { id: "cap", name: "Boné", icon: HardHat },
  { id: "apron", name: "Avental", icon: ChefHat },
  { id: "azulejo", name: "Azulejo", icon: Square },
  { id: "almofada", name: "Almofada", icon: BedDouble },
  { id: "babybody", name: "Body de Bebê", icon: Baby },
  { id: "squeeze", name: "Squeeze", icon: GlassWater },
  { id: "chopp_mug", name: "Caneca de Chopp", icon: Beer },
];
const products3D = ['mug', 'xicara', 'tshirt', 'long_sleeve', 'cap'];
const products2D = ['apron', 'azulejo', 'almofada', 'babybody', 'squeeze', 'chopp_mug'];
type ProductSettings = {
  imageScaleX: number; imageScaleY: number; imageOffsetX: number;
  imageOffsetY: number; imageRotation: number; textureOffsetX: number;
};
const productConfigurations: Record<string, Omit<ProductSettings, 'textScaleY' | 'textOffsetX' | 'textOffsetY' | 'textRotation'>> = {
  mug: { imageScaleX: 2.31, imageScaleY: 1, imageOffsetX: 110, imageOffsetY: 230, imageRotation: 180, textureOffsetX: 190 / 360, },
  xicara: { imageScaleX: 2.31, imageScaleY: 1, imageOffsetX: 110, imageOffsetY: 230, imageRotation: 180, textureOffsetX: 190 / 360, },
  tshirt: { imageScaleX: 1.0, imageScaleY: 0.6, imageOffsetX: -500, imageOffsetY: 99, imageRotation: 180, textureOffsetX: 0, },
  long_sleeve: { imageScaleX: 1.0, imageScaleY: 0.6, imageOffsetX: 460, imageOffsetY: -170, imageRotation: 180, textureOffsetX: 0, },
  cap: { imageScaleX: 1.0, imageScaleY: 0.8, imageOffsetX: -500, imageOffsetY: 20, imageRotation: 180, textureOffsetX: 0, },
  apron: { imageScaleX: 0.5, imageScaleY: 0.5, imageOffsetX: 0, imageOffsetY: -50, imageRotation: 0, textureOffsetX: 0, },
  azulejo: { imageScaleX: 0.8, imageScaleY: 0.8, imageOffsetX: 0, imageOffsetY: 0, imageRotation: 0, textureOffsetX: 0, },
  almofada: { imageScaleX: 0.7, imageScaleY: 0.7, imageOffsetX: 0, imageOffsetY: 0, imageRotation: 0, textureOffsetX: 0, },
  babybody: { imageScaleX: 0.4, imageScaleY: 0.4, imageOffsetX: 0, imageOffsetY: -60, imageRotation: 0, textureOffsetX: 0, },
  squeeze: { imageScaleX: 0.5, imageScaleY: 0.5, imageOffsetX: 0, imageOffsetY: -40, imageRotation: 0, textureOffsetX: 0, },
  chopp_mug: { imageScaleX: 0.45, imageScaleY: 0.45, imageOffsetX: 0, imageOffsetY: -30, imageRotation: 0, textureOffsetX: 0, },
};

// Interface para o tipo da ref que será exposta pelos componentes 3D
interface CanvasHandle {
  getCanvas: () => HTMLCanvasElement;
}

const MockupGenerator = () => {
  const { toast } = useToast();
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const canvas3DRef = useRef<CanvasHandle>(null); // <-- 1. REF PARA O CANVAS 3D

  const [selectedProduct, setSelectedProduct] = useState(availableProducts[0].id);
  const [finalArtUrl, setFinalArtUrl] = useState<string | null>(null);
  const [isArtEditorOpen, setIsArtEditorOpen] = useState(false);
  const [artFlip, setArtFlip] = useState({ horizontal: false, vertical: false });
  const [productColor, setProductColor] = useState("#ffffff");
  const [settings, setSettings] = useState(productConfigurations[selectedProduct]);
  const [globalSizeMultiplier, setGlobalSizeMultiplier] = useState(1.0);

  useEffect(() => {
    setSettings(productConfigurations[selectedProduct]);
    setGlobalSizeMultiplier(1.0);
  }, [selectedProduct]);

  const handleSettingChange = (key: keyof Omit<ProductSettings, 'textScaleY' | 'textOffsetX' | 'textOffsetY' | 'textRotation'>, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // --- 2. LÓGICA DE DOWNLOAD HÍBRIDA IMPLEMENTADA ---
  const handleDownloadMockup = async () => {
    // Lógica para produtos 3D
    if (products3D.includes(selectedProduct)) {
      const canvas = canvas3DRef.current?.getCanvas();
      if (canvas) {
        try {
          const link = document.createElement("a");
          link.download = `mockup-3d-${selectedProduct}.png`;
          // Preserva o conteúdo do canvas antes de convertê-lo para Data URL
          link.href = canvas.toDataURL("image/png");
          link.click();
          toast({ title: "Mockup 3D exportado!", description: "O download foi iniciado." });
        } catch (error) {
           console.error("Falha ao exportar canvas 3D:", error);
           toast({ title: "Erro de Exportação", description: "Não foi possível gerar a imagem. O seu navegador pode não ser compatível.", variant: "destructive"});
        }
      } else {
        toast({ title: "Erro de Referência", description: "Não foi possível acessar o canvas 3D para captura.", variant: "destructive" });
      }
      return;
    }

    // Lógica para produtos 2D (mantém html2canvas)
    const mockupArea = document.getElementById("viewer-2d-container");
    if (!mockupArea) {
      toast({ title: "Erro de Seletor", description: "Não foi possível encontrar a área do mockup 2D para captura.", variant: "destructive" });
      return;
    }
    try {
      const canvas = await html2canvas(mockupArea, { 
          backgroundColor: null,
          logging: false,
          useCORS: true
      });
      const link = document.createElement("a");
      link.download = `mockup-2d-${selectedProduct}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({ title: "Mockup 2D exportado!", description: "O download foi iniciado." });
    } catch (error) {
      console.error("Falha ao gerar o mockup 2D com html2canvas:", error);
      toast({ title: "Erro Inesperado", description: "Ocorreu um problema ao gerar a imagem do mockup 2D.", variant: "destructive" });
    }
  };

  const handleDownloadArt = () => {
    if (!finalArtUrl) {
      toast({ title: "Nenhuma arte encontrada", description: "Crie ou carregue uma arte antes de exportar.", variant: "destructive" });
      return;
    }
    const link = document.createElement("a");
    link.href = finalArtUrl;
    link.download = "sua-arte.png";
    link.click();
    toast({ title: "Arte exportada!", description: "Sua arte foi baixada com sucesso." });
  };
  
  const handleDirectArtUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "Arquivo muito grande", description: "O arquivo deve ter no máximo 10MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFinalArtUrl(reader.result as string);
        setArtFlip({ horizontal: false, vertical: false });
        toast({ title: "Arte Carregada!", description: "Sua arte pronta foi aplicada ao produto." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveArtFromEditor = (artDataUrl: string) => {
    setFinalArtUrl(artDataUrl);
    setArtFlip({ horizontal: false, vertical: false });
    toast({ title: "Arte Aplicada!", description: "Sua arte criada no editor foi aplicada ao produto." });
  };

  const commonViewerProps = {
    productColor: productColor, 
    uploadedImage: finalArtUrl,
    customText: "", textColor: "", textFont: "", textSize: 0, 
    textureOffsetX: settings.textureOffsetX,
    imageScaleX: settings.imageScaleX * globalSizeMultiplier * (artFlip.horizontal ? -1 : 1),
    imageScaleY: settings.imageScaleY * globalSizeMultiplier * (artFlip.vertical ? -1 : 1),
    imageOffsetX: settings.imageOffsetX, imageOffsetY: settings.imageOffsetY, imageRotation: settings.imageRotation,
    textScaleY: 0, textOffsetX: 0, textOffsetY: 0, textRotation: 0, 
    selectedProduct: selectedProduct,
  };

  return (
    <>
      <ArtEditor 
        isOpen={isArtEditorOpen}
        onClose={() => setIsArtEditorOpen(false)}
        onSave={handleSaveArtFromEditor}
      />
      <input type="file" ref={directFileInputRef} onChange={handleDirectArtUpload} className="hidden" accept="image/png, image/jpeg" />

      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">Editor de Mockup</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalize seu produto com visualização interativa. Gire, ajuste e veja o resultado em tempo real.
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                 {/* Painel de Controles (inalterado) */}
                <Card>
                  <CardHeader><CardTitle>1. Escolha o Produto</CardTitle></CardHeader>
                  <CardContent>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Selecione um produto..." /></SelectTrigger>
                      <SelectContent>
                        {availableProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center"><product.icon className="w-4 h-4 mr-2 text-muted-foreground" />{product.name}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>2. Escolha sua Arte</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline" onClick={() => setIsArtEditorOpen(true)}>
                      <Wand2 className="w-4 h-4 mr-2" /> Criar / Editar Arte
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => directFileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" /> Carregar Arte Pronta
                    </Button>
                  </CardContent>
                </Card>
                {finalArtUrl && (
                  <Card>
                    <CardHeader><CardTitle>3. Ajustes da Arte no Produto</CardTitle></CardHeader>
                    <CardContent className="space-y-6 pt-2">
                      <div className="space-y-2">
                        <Label className="flex justify-between items-center font-medium">
                          <span className="flex items-center"><Ruler className="w-4 h-4 mr-2" /> Tamanho Global</span>
                          <span>{globalSizeMultiplier.toFixed(2)}x</span>
                        </Label>
                        <Slider value={[globalSizeMultiplier]} onValueChange={(v) => setGlobalSizeMultiplier(v[0])} min={0.2} max={2.0} step={0.05} />
                      </div>
                      <div className="space-y-2 pt-4 border-t border-muted">
                        <Label className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center"><ArrowLeftRight className="w-4 h-4 mr-2" /> Largura (Ajuste Fino)</span>
                          <span>{settings.imageScaleX.toFixed(2)}</span>
                        </Label>
                        <Slider value={[settings.imageScaleX]} onValueChange={(v) => handleSettingChange('imageScaleX', v[0])} min={0.1} max={3} step={0.01} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex justify-between items-center text-muted-foreground">
                          <span className="flex items-center"><ArrowUpDown className="w-4 h-4 mr-2" /> Altura (Ajuste Fino)</span>
                          <span>{settings.imageScaleY.toFixed(2)}</span>
                        </Label>
                        <Slider value={[settings.imageScaleY]} onValueChange={(v) => handleSettingChange('imageScaleY', v[0])} min={0.1} max={3} step={0.01} />
                      </div>
                      <div className="space-y-2 pt-4 border-t border-muted">
                        <Label className="flex justify-between">Posição Horizontal (X)<span>{settings.imageOffsetX}px</span></Label>
                        <Slider value={[settings.imageOffsetX]} onValueChange={(v) => handleSettingChange('imageOffsetX', v[0])} min={-1000} max={1000} step={1} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex justify-between">Posição Vertical (Y)<span>{settings.imageOffsetY}px</span></Label>
                        <Slider value={[settings.imageOffsetY]} onValueChange={(v) => handleSettingChange('imageOffsetY', v[0])} min={-1000} max={1000} step={1} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex justify-between items-center"><span className="flex items-center"><RotateCw className="w-4 h-4 mr-2" /> Rotação 2D</span><span>{settings.imageRotation}°</span></Label>
                        <Slider value={[settings.imageRotation]} onValueChange={(v) => handleSettingChange('imageRotation', v[0])} min={0} max={360} step={1} />
                      </div>
                      <div className="space-y-2 pt-4 border-t border-muted">
                        <Label>Espelhar</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => setArtFlip(f => ({ ...f, horizontal: !f.horizontal }))}>
                            <FlipHorizontal className="w-4 h-4 mr-2"/> Horizontal
                          </Button>
                          <Button variant="outline" onClick={() => setArtFlip(f => ({ ...f, vertical: !f.vertical }))}>
                            <FlipVertical className="w-4 h-4 mr-2"/> Vertical
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardHeader><CardTitle>Ajustes Gerais do Produto</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="flex justify-between items-center"><span className="flex items-center"><Move3d className="w-4 h-4 mr-2" /> Girar Arte (360°)</span><span>{(settings.textureOffsetX * 360).toFixed(0)}°</span></Label>
                      <Slider value={[settings.textureOffsetX]} onValueChange={(v) => handleSettingChange('textureOffsetX', v[0])} min={0} max={1} step={0.01} disabled={!['mug', 'xicara'].includes(selectedProduct)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center"><Palette className="w-4 h-4 mr-2" /> Cor Base do Produto</Label>
                      <Input type="color" value={productColor} onChange={(e) => setProductColor(e.target.value)} className="p-0 h-10 w-full cursor-pointer" />
                    </div>
                  </CardContent>
                </Card>
                <Button size="lg" className="w-full btn-primary" onClick={handleDownloadMockup}>
                  <Download className="w-4 h-4 mr-2" /> Baixar Mockup PNG
                </Button>
                {finalArtUrl && (
                  <Button size="lg" variant="secondary" className="w-full mt-2" onClick={handleDownloadArt}>
                    <ImageDown className="w-4 h-4 mr-2" /> Baixar Arte PNG
                  </Button>
                )}
              </div>
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-2 md:p-4 h-[60vh] lg:h-[70vh] relative bg-muted/30 rounded-lg">
                    {products3D.includes(selectedProduct) ? (
                      <>
                        {/* --- 3. REF PASSADA PARA OS COMPONENTES 3D --- */}
                        {selectedProduct === 'mug' && <Mug3DViewer ref={canvas3DRef} {...commonViewerProps} />}
                        {selectedProduct === 'xicara' && <XicaraViewer ref={canvas3DRef} {...commonViewerProps} />}
                        {selectedProduct === 'tshirt' && <TshirtViewer ref={canvas3DRef} {...commonViewerProps} />}
                        {selectedProduct === 'long_sleeve' && <LongSleeveViewer ref={canvas3DRef} {...commonViewerProps} />}
                        {selectedProduct === 'cap' && <CapViewer ref={canvas3DRef} {...commonViewerProps} />}
                      </>
                    ) : (
                      <div id="viewer-2d-container">
                        {selectedProduct === 'apron' && <Apron2DViewer {...commonViewerProps} />}
                        {selectedProduct === 'azulejo' && <Azulejo2DViewer {...commonViewerProps} />}
                        {selectedProduct === 'almofada' && <Almofada2DViewer {...commonViewerProps} />}
                        {selectedProduct === 'babybody' && <BabyBody2DViewer {...commonViewerProps} />}
                        {selectedProduct === 'squeeze' && <Squeeze2DViewer {...commonViewerProps} />}
                        {selectedProduct === 'chopp_mug' && <ChoppMug2DViewer {...commonViewerProps} />}
                      </div>
                    )}
                    {!finalArtUrl && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg">
                          <p className="text-muted-foreground font-medium">Crie ou carregue uma arte para começar.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MockupGenerator;