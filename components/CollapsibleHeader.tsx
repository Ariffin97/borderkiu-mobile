import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X, HelpCircle, Map, Bell, Info, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderMenuItem {
  title: string;
  icon: React.ReactNode;
  route: string;
  description: string;
}

export default function CollapsibleHeader() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  const menuItems: HeaderMenuItem[] = [
    {
      title: 'FAQ',
      icon: <HelpCircle size={20} color="#667eea" />,
      route: '/FAQ',
      description: 'Frequently asked questions'
    },
    {
      title: 'Borders',
      icon: <Map size={20} color="#10b981" />,
      route: '/Borders',
      description: 'All border crossings'
    },
    {
      title: 'Updates',
      icon: <Bell size={20} color="#f59e0b" />,
      route: '/Updates',
      description: 'Latest news and updates'
    },
    {
      title: 'About Us',
      icon: <Info size={20} color="#ef4444" />,
      route: '/aboutUs',
      description: 'Learn more about BorderKiu'
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateValue, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280], // Adjust based on content height
  });

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const navigateTo = (route: string) => {
    setIsExpanded(false);
    router.push(route);
  };

  return (
    <View className="bg-white">
      {/* Header Bar */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-bold">BorderKiu</Text>
            <Text className="text-gray-500 text-sm">Border Intelligence Platform</Text>
          </View>
          
          <View className="flex-row items-center space-x-4">
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-700 text-xs font-medium">LIVE</Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={toggleMenu}
              className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 text-sm font-medium mr-2">Menu</Text>
              <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                <ChevronDown size={16} color="#6b7280" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Collapsible Menu */}
      <Animated.View 
        style={{ 
          height: heightInterpolate,
          overflow: 'hidden'
        }}
      >
        <LinearGradient
          colors={['#f8fafc', '#ffffff']}
          className="px-6 pb-6"
        >
          <Animated.View style={{ opacity: fadeValue }}>
            <View className="bg-white rounded-2xl overflow-hidden" style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}>
              {/* Menu Header */}
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                className="px-4 py-3"
              >
                <Text className="text-white font-semibold text-base">Quick Navigation</Text>
              </LinearGradient>

              {/* Menu Items */}
              <View className="divide-y divide-gray-100">
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.route}
                    onPress={() => navigateTo(item.route)}
                    className="flex-row items-center p-4 bg-white hover:bg-gray-50"
                    activeOpacity={0.7}
                  >
                    <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                      {item.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-medium text-base mb-1">
                        {item.title}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {item.description}
                      </Text>
                    </View>
                    <ChevronDown 
                      size={16} 
                      color="#9ca3af" 
                      style={{ transform: [{ rotate: '-90deg' }] }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Menu Footer */}
              <View className="bg-gray-50 px-4 py-3">
                <Text className="text-gray-400 text-xs text-center">
                  Tap any option to navigate
                </Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
} 