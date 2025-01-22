import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

import Index from './pages/Index';
import Optimize from './pages/Optimize';
import Scan from './pages/Scan';

const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/scan" element={<Scan />} />
          </Routes>
        </Router>
        <Toaster />
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;