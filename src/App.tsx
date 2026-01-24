import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AssetProvider } from "@/contexts/AssetContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AssetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(222 47% 8%)',
                border: '1px solid hsl(222 47% 18%)',
                color: 'hsl(210 40% 98%)',
              },
            }}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AssetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
