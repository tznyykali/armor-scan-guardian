import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import Index from './pages/Index';
import Optimize from './pages/Optimize';
import Scan from './pages/Scan';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="Home" 
              component={Index}
              options={{ title: 'Secure Scan' }}
            />
            <Stack.Screen 
              name="Optimize" 
              component={Optimize}
              options={{ title: 'Optimize' }}
            />
            <Stack.Screen 
              name="Scan" 
              component={Scan}
              options={{ title: 'Scan' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;