import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import ConfigurationScreen from './screens/ConfigurationScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TokenScreen from './screens/TokenScreen';
import AboutScreen from './screens/AboutScreen';
import StatisticsScreen from './screens/StatisticsScreen';

export type RootStackParamList = {
  Configuration: undefined;
  Login: {config: WSO2Config};
  Dashboard: {tokens: AuthTokens; config: WSO2Config};
  Token: {tokens: AuthTokens; config: WSO2Config};
  About: {tokens: AuthTokens};
  Statistics: {tokens: AuthTokens};
};

export interface WSO2Config {
  clientId: string;
  clientSecret?: string; // Optional for public clients
  callbackUrl: string;
  ngrokUrl: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Configuration"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen 
            name="Configuration" 
            component={ConfigurationScreen}
            options={{title: 'WSO2 IS Configuration'}}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{title: 'WSO2 IS Login'}}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{title: 'WSO2 IS Dashboard'}}
          />
          <Stack.Screen 
            name="Token" 
            component={TokenScreen}
            options={{title: 'Token Details'}}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen}
            options={{title: 'About App'}}
          />
          <Stack.Screen 
            name="Statistics" 
            component={StatisticsScreen}
            options={{title: 'Statistics'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;