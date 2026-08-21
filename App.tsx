import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserCheck, QrCode, Shirt } from 'lucide-react-native';
import LandingScreen from './src/screens/LandingScreen';
import FittingRoomScreen from './src/screens/FittingRoomScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import WardrobeScreen from './src/screens/WardrobeScreen';
import { COLORS } from './src/constants/theme';

export type RootTabParamList = {
  FittingRoom: undefined;
  QRScanner: undefined;
  Wardrobe: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  if (!currentUser) {
    return <LandingScreen onAuthSuccess={(user: any) => setCurrentUser(user)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen
          name="FittingRoom"
          component={FittingRoomScreen}
          options={{
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <View style={styles.tabIconBox}>
                <UserCheck color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={[styles.tabLabel, { color: focused ? COLORS.primary : COLORS.textMuted }]}>
                  Fitting Studio
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="QRScanner"
          component={QRScannerScreen}
          options={{
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <View style={styles.tabIconBox}>
                <QrCode color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={[styles.tabLabel, { color: focused ? COLORS.primary : COLORS.textMuted }]}>
                  QR Scanner
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          options={{
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <View style={styles.tabIconBox}>
                <Shirt color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={[styles.tabLabel, { color: focused ? COLORS.primary : COLORS.textMuted }]}>
                  Wardrobe
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.cardDark,
    borderTopColor: COLORS.borderDark,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
  },
});
