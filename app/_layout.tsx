import React from 'react';
import { Tabs } from 'expo-router';
import { Home, MessageSquare, BarChart3 } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#6b7280',
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Live Chat',
            tabBarIcon: ({ color, size, focused }) => (
              <MessageSquare 
                size={focused ? 26 : 24} 
                color={focused ? '#3b82f6' : '#6b7280'} 
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '700',
              color: '#374151',
            },
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="IndividualChat"
          options={{
            href: null, // Hide this from tabs, it's used for individual chat rooms
          }}
        />
        <Tabs.Screen
          name="FAQ"
          options={{
            href: null, // Hide this from tabs, it's used for navigation only
          }}
        />
        <Tabs.Screen
          name="Borders"
          options={{
            href: null, // Hide this from tabs, it's used for navigation only
          }}
        />
        <Tabs.Screen
          name="Updates"
          options={{
            href: null, // Hide this from tabs, it's used for navigation only
          }}
        />
        <Tabs.Screen
          name="aboutUs"
          options={{
            href: null, // Hide this from tabs, it's used for navigation only
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
