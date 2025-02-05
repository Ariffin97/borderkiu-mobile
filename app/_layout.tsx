import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HamburgerMenu from '@/components/HamburgerMenu';
import { ImageBackground } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <HamburgerMenu navigation={navigation} />,
          headerLeft: () => null,
          drawerPosition: 'right',
          drawerStyle: {
            width: '70%',
          },
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'BorderKiu',
          }}
        />
        <Drawer.Screen
          name="AboutUs"
          options={{
            drawerLabel: 'About Us',
            title: 'About Us',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
