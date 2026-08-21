import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStateProvider } from './src/state/AppState';
import type { RootStackParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import MeasurementsScreen from './src/screens/MeasurementsScreen';
import ViewerScreen from './src/screens/ViewerScreen';
import ScanGarmentScreen from './src/screens/ScanGarmentScreen';
import TryOnScreen from './src/screens/TryOnScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppStateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Fitting Room' }} />
          <Stack.Screen
            name="Measurements"
            component={MeasurementsScreen}
            options={{ title: 'Your Body' }}
          />
          <Stack.Screen name="Viewer" component={ViewerScreen} options={{ title: 'Mannequin' }} />
          <Stack.Screen
            name="ScanGarment"
            component={ScanGarmentScreen}
            options={{ title: 'Try On' }}
          />
          <Stack.Screen name="TryOn" component={TryOnScreen} options={{ title: 'Fitting' }} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </AppStateProvider>
  );
}
