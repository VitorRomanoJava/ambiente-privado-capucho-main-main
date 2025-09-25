import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { FileQuestion, Info, Video } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function App() {
  return (
    <>
      <main className="min-h-screen flex flex-col">
        {}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {}
      <Toaster />

      {}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-6 right-6 z-50 rounded-full px-6 py-3 font-semibold shadow-lg"
            >
              <Info className="h-7 w-7" />
              Precisa de ajuda?
              
            <span className="sr-only">Abrir tutorial</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>Veja esse tutorial</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <AspectRatio ratio={16 / 9}>
              {
                
              }
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                <iframe width="560" 
                height="315" src="https://www.youtube.com/embed/gvYqTMPv8tk?si=-3zPkfsVJ-Hssz2L&amp;start=1" 
                title="YouTube video player" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                </iframe>
              </div>

            </AspectRatio>
          </div>
        </DialogContent>
      </Dialog>
      {}
    </>
  );
}

export default App;