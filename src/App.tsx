import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import Optimize from "./pages/Optimize";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-beige dark:bg-taupe-dark font-mono">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/optimize" element={<Optimize />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;