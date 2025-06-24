import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Keyboard, StatusBar, Animated, RefreshControl } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { MapPin, Clock, Users, Activity, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Components
import BorderMap from '@/components/BorderMap';
import BorderPicker from '@/components/BorderPicker';
import QueueTimeChart from '@/components/QueueTimeChart';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import { formatUnixTimestamp, millisecondsToHHMM } from '@/utils/time-utils';
import { formatHumanReadable } from '@/utils/string-utils';

const data = {
  'Miri(SungaiTujuh)': {
    country1: 'Miri',
    country2: 'Brunei',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: {
      latitude: 4.5842079,
      longitude: 114.078966
    },
    '1t2': {
      queueTime: 540000,
      queueLength: 2008,
    },
    '2t1': {
      queueTime: 480000,
      queueLength: 1200,
    }
  },
  'KualaLurah(ICQSTedungan)': {
    country1: 'Brunei',
    country2: 'Limbang',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: {
      latitude: 4.7833,
      longitude: 115.0167
    },
    '1t2': {
      queueTime: 890889,
      queueLength: 2387,
    },
    '2t1': {
      queueTime: 888888,
      queueLength: 480,
    }
  },
  'UjungJalan(ICQSPandaruan)': {
    country1: 'Temburung',
    country2: 'Limbang',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: {
      latitude: 4.6000,
      longitude: 115.1333
    },
    '1t2': {
      queueTime: 823847,
      queueLength: 20,
    },
    '2t1': {
      queueTime: 873620,
      queueLength: 200,
    }
  },
}

// Interfaces
export interface QueueData {
  queueTime: number;
  queueLength: number;
}

interface BorderDirections {
  country1: string;
  country2: string;
  lastUpdated: string;
  '1t2': QueueData;
  '2t1': QueueData;
  coordinates: {
    longitude: number,
    latitude: number
  }
}

export interface BorderDataMap {
  [borderName: string]: BorderDirections;
}

export interface ChatMessage {
  type: string;
  username: string;
  time: string;
  imageUrl?: string;
  imageThumbnailUrl?: string;
  caption?: string;
  isDeveloper?: boolean;
  message?: string; // For text messages
}

export interface ChatResponse {
  chat: ChatMessage[];
  userCount: number;
}

export interface ErrorResponse {
  error: string;
}

type ChatState = ChatResponse | ErrorResponse;

export default function Home() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<BorderDirections | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setBorderData(data);
    }, 100);
  }, []);

  useEffect(() => {
    if (!borderData) return;
    const keys = Object.keys(borderData);
    setBorders(keys);
    setSelectedBorderData(borderData[selectedBorder]);
  }, [borderData]);

  useEffect(() => {
    if (!selectedBorder || !borderData) return;
    setSelectedBorderData(borderData[selectedBorder]);
  }, [selectedBorder]);





  // Keyboard listeners
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getQueueStatus = (queueTime: number) => {
    if (queueTime < 300000) return { status: 'Low', color: '#10b981', bg: '#ecfdf5' };
    if (queueTime < 900000) return { status: 'Moderate', color: '#f59e0b', bg: '#fffbeb' };
    return { status: 'High', color: '#ef4444', bg: '#fef2f2' };
  };

  return (
    <GestureHandlerRootView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {selectedBorderData && (
        <View className="flex-1">
          {/* Collapsible Header */}
          <CollapsibleHeader />
          
          {/* Border Selector Section */}
          <View className="bg-white pb-6">
            <View className="px-6">
              <View className="bg-gray-50 rounded-xl p-1">
                <BorderPicker 
                  borders={borders} 
                  selectedBorder={selectedBorder} 
                  setSelectedBorder={setSelectedBorder} 
                />
              </View>
            </View>
          </View>

          {/* Map Section */}
          <View className="h-48 bg-white mx-6 rounded-xl mb-6 overflow-hidden" style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <BorderMap coordinates={selectedBorderData.coordinates} />
          </View>

          {/* Content */}
          <ScrollView 
            className="flex-1 px-6"
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Current Status Card */}
            <View className="bg-white rounded-xl p-6 mb-6" style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View className="flex-row items-center mb-4">
                <MapPin size={20} color="#374151" />
                <Text className="text-gray-900 text-lg font-semibold ml-2">
                  {formatHumanReadable(selectedBorder)}
                </Text>
              </View>
              
              <Text className="text-gray-500 text-sm mb-6">
                Last updated: {selectedBorderData.lastUpdated}
              </Text>

              {/* Queue Information */}
              <View className="space-y-4">
                {/* Direction 1 */}
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium mb-1">
                      {selectedBorderData.country1} → {selectedBorderData.country2}
                    </Text>
                    <View className="flex-row items-center">
                      <Clock size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {millisecondsToHHMM(selectedBorderData['1t2'].queueTime)}
                      </Text>
                      <Users size={16} color="#6b7280" className="ml-4" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {(selectedBorderData['1t2'].queueLength / 1000).toFixed(1)}km
                      </Text>
                    </View>
                  </View>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getQueueStatus(selectedBorderData['1t2'].queueTime).bg }}
                  >
                    <Text 
                      className="text-xs font-medium"
                      style={{ color: getQueueStatus(selectedBorderData['1t2'].queueTime).color }}
                    >
                      {getQueueStatus(selectedBorderData['1t2'].queueTime).status}
                    </Text>
                  </View>
                </View>

                {/* Direction 2 */}
                <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium mb-1">
                      {selectedBorderData.country2} → {selectedBorderData.country1}
                    </Text>
                    <View className="flex-row items-center">
                      <Clock size={16} color="#6b7280" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {millisecondsToHHMM(selectedBorderData['2t1'].queueTime)}
                      </Text>
                      <Users size={16} color="#6b7280" className="ml-4" />
                      <Text className="text-gray-600 text-sm ml-1">
                        {(selectedBorderData['2t1'].queueLength / 1000).toFixed(1)}km
                      </Text>
                    </View>
                  </View>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getQueueStatus(selectedBorderData['2t1'].queueTime).bg }}
                  >
                    <Text 
                      className="text-xs font-medium"
                      style={{ color: getQueueStatus(selectedBorderData['2t1'].queueTime).color }}
                    >
                      {getQueueStatus(selectedBorderData['2t1'].queueTime).status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="flex-row space-x-4 mb-6">
              <View className="flex-1 bg-white rounded-xl p-4" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View className="flex-row items-center mb-2">
                  <Activity size={16} color="#3b82f6" />
                  <Text className="text-gray-700 text-sm font-medium ml-2">Avg. Wait</Text>
                </View>
                <Text className="text-gray-900 text-xl font-bold">
                  {Math.round((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 120000)} min
                </Text>
              </View>
              
              <View className="flex-1 bg-white rounded-xl p-4" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View className="flex-row items-center mb-2">
                  <Users size={16} color="#10b981" />
                  <Text className="text-gray-700 text-sm font-medium ml-2">Queue Length</Text>
                </View>
                <Text className="text-gray-900 text-xl font-bold">
                  {((selectedBorderData['1t2'].queueLength + selectedBorderData['2t1'].queueLength) / 2000).toFixed(1)} km
                </Text>
              </View>
            </View>
          </ScrollView>





          {/* Chart Overlay */}
          {showChart && (
            <View className="absolute inset-0 bg-black/30">
              <View className="flex-1 pt-16 pb-4 px-4">
                <QueueTimeChart
                  border={selectedBorder}
                  country1={selectedBorderData.country1}
                  country2={selectedBorderData.country2}
                  setShowChart={setShowChart}
                />
              </View>
            </View>
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
}