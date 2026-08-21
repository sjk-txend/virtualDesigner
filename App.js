import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserCheck, QrCode, Shirt } from 'lucide-react-native';
import LandingScreen from './src/screens/LandingScreen';
import FittingRoomScreen from './src/screens/FittingRoomScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import WardrobeScreen from './src/screens/WardrobeScreen';
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (!currentUser) {
    return <LandingScreen onAuthSuccess={(user) => setCurrentUser(user)} />;
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
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={{ fontSize: 10, color: focused ? COLORS.primary : COLORS.textMuted, marginTop: 4, fontWeight: '700' }}>
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
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <QrCode color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={{ fontSize: 10, color: focused ? COLORS.primary : COLORS.textMuted, marginTop: 4, fontWeight: '700' }}>
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
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Shirt color={focused ? COLORS.primary : COLORS.textMuted} size={22} />
                <Text style={{ fontSize: 10, color: focused ? COLORS.primary : COLORS.textMuted, marginTop: 4, fontWeight: '700' }}>
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
});
