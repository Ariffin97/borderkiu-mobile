import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerNavigationProps } from '../types';
import { HamburgerMenu } from './components/HamburgerMenu';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }: { navigation: DrawerNavigationProps }) => ({
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
          name="aboutUs"
          options={{
            drawerLabel: 'About Us',
            title: 'About Us',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
