import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";

import Index from './pages/Index';
import Optimize from './pages/Optimize';
import Scan from './pages/Scan';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router>
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/optimize" element={<Optimize />} />
                <Route path="/scan" element={<Scan />} />
              </Routes>
            </main>
          </Router>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;