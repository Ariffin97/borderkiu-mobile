import { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, Text, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BarChart3, TrendingUp, Clock, MapPin, Users, Activity, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BorderPicker from '@/components/BorderPicker';
import QueueTimeChart from '@/components/QueueTimeChart';
import { formatHumanReadable } from '@/utils/string-utils';
import { BorderDataMap } from './index';
import { formatUnixTimestamp, millisecondsToHHMM } from '@/utils/time-utils';

const data = {
  'Miri(SungaiTujuh)': {
    country1: 'Miri',
    country2: 'Brunei',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: { latitude: 4.5842079, longitude: 114.078966 },
    '1t2': { queueTime: 540000, queueLength: 2008 },
    '2t1': { queueTime: 480000, queueLength: 1200 }
  },
  'KualaLurah(ICQSTedungan)': {
    country1: 'Brunei',
    country2: 'Limbang',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: { latitude: 4.7833, longitude: 115.0167 },
    '1t2': { queueTime: 890889, queueLength: 2387 },
    '2t1': { queueTime: 888888, queueLength: 480 }
  },
  'UjungJalan(ICQSPandaruan)': {
    country1: 'Temburung',
    country2: 'Limbang',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: { latitude: 4.6000, longitude: 115.1333 },
    '1t2': { queueTime: 823847, queueLength: 20 },
    '2t1': { queueTime: 873620, queueLength: 200 }
  },
};

export default function AnalyticsTab() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<any>(null);
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

  const refreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setBorderData({ ...data });
      setRefreshing(false);
    }, 1000);
  };

  const getQueueStatus = (queueTime: number) => {
    if (queueTime < 300000) return { status: 'Low', color: '#10b981', bg: '#ecfdf5', icon: CheckCircle };
    if (queueTime < 900000) return { status: 'Moderate', color: '#f59e0b', bg: '#fffbeb', icon: Clock };
    return { status: 'High', color: '#ef4444', bg: '#fef2f2', icon: AlertTriangle };
  };

  const getTrafficTrend = () => {
    const trends = ['Increasing', 'Stable', 'Decreasing'];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getPeakHours = () => {
    return ['8:00 AM - 10:00 AM', '12:00 PM - 2:00 PM', '5:00 PM - 7:00 PM'];
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Analytics Header */}
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-6"
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <BarChart3 size={20} color="#ffffff" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white font-bold text-lg">
              Border Analytics
            </Text>
            <Text className="text-white/80 text-sm">
              Real-time crossing insights
            </Text>
          </View>
          <TouchableOpacity
            onPress={refreshData}
            className="p-2 rounded-full bg-white/20"
            disabled={refreshing}
          >
            <Activity size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Border Selector */}
        <View className="my-6">
          <Text className="text-gray-800 text-lg font-semibold mb-4">Select Border Crossing</Text>
          {borders && (
            <BorderPicker 
              borders={borders} 
              selectedBorder={selectedBorder} 
              setSelectedBorder={setSelectedBorder} 
            />
          )}
        </View>

        {selectedBorderData && (
          <>
            {/* Overview Cards */}
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-semibold mb-4">Current Status</Text>
              
              <View className="flex-row space-x-3 mb-4">
                {/* Queue Status Card */}
                <View className="flex-1 bg-white rounded-xl p-4" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-600 text-sm font-medium">Queue Status</Text>
                    {(() => {
                      const avgTime = (selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2;
                      const status = getQueueStatus(avgTime);
                      const IconComponent = status.icon;
                      return <IconComponent size={16} color={status.color} />;
                    })()}
                  </View>
                  <Text 
                    className="text-2xl font-bold mb-1"
                    style={{ 
                      color: getQueueStatus((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2).color 
                    }}
                  >
                    {getQueueStatus((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2).status}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Avg. {Math.round(((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2) / 60000)} min wait
                  </Text>
                </View>

                {/* Traffic Trend Card */}
                <View className="flex-1 bg-white rounded-xl p-4" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-600 text-sm font-medium">Trend</Text>
                    <TrendingUp size={16} color="#3b82f6" />
                  </View>
                  <Text className="text-2xl font-bold text-blue-600 mb-1">
                    {getTrafficTrend()}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Last 24 hours
                  </Text>
                </View>
              </View>
            </View>

            {/* Direction Analysis */}
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-semibold mb-4">Direction Analysis</Text>
              
              <View className="space-y-3">
                {/* Direction 1 to 2 */}
                <View className="bg-white rounded-xl p-5" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <MapPin size={18} color="#3b82f6" />
                      <Text className="text-gray-800 font-semibold ml-2">
                        {selectedBorderData.country1} → {selectedBorderData.country2}
                      </Text>
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
                  
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Clock size={14} color="#6b7280" />
                        <Text className="text-gray-600 text-sm ml-1">Wait Time</Text>
                      </View>
                      <Text className="text-xl font-bold text-gray-900">
                        {millisecondsToHHMM(selectedBorderData['1t2'].queueTime)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Users size={14} color="#6b7280" />
                        <Text className="text-gray-600 text-sm ml-1">Queue Length</Text>
                      </View>
                      <Text className="text-xl font-bold text-gray-900">
                        {(selectedBorderData['1t2'].queueLength / 1000).toFixed(1)} km
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Direction 2 to 1 */}
                <View className="bg-white rounded-xl p-5" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}>
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <MapPin size={18} color="#10b981" />
                      <Text className="text-gray-800 font-semibold ml-2">
                        {selectedBorderData.country2} → {selectedBorderData.country1}
                      </Text>
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
                  
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Clock size={14} color="#6b7280" />
                        <Text className="text-gray-600 text-sm ml-1">Wait Time</Text>
                      </View>
                      <Text className="text-xl font-bold text-gray-900">
                        {millisecondsToHHMM(selectedBorderData['2t1'].queueTime)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Users size={14} color="#6b7280" />
                        <Text className="text-gray-600 text-sm ml-1">Queue Length</Text>
                      </View>
                      <Text className="text-xl font-bold text-gray-900">
                        {(selectedBorderData['2t1'].queueLength / 1000).toFixed(1)} km
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Queue Time Chart */}
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-semibold mb-4">Queue Time Trends</Text>
              <View className="bg-white rounded-xl p-4" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <QueueTimeChart borderData={selectedBorderData} />
              </View>
            </View>

            {/* Peak Hours */}
            <View className="mb-6">
              <Text className="text-gray-800 text-lg font-semibold mb-4">Peak Hours</Text>
              <View className="bg-white rounded-xl p-5" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <Text className="text-gray-600 text-sm mb-3">Busiest crossing times (local time)</Text>
                {getPeakHours().map((hour, index) => (
                  <View key={index} className="flex-row items-center py-2">
                    <View className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    <Text className="text-gray-800 font-medium">{hour}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Last Updated */}
            <View className="mb-8">
              <View className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <View className="flex-row items-center">
                  <Activity size={16} color="#3b82f6" />
                  <Text className="text-blue-800 font-medium ml-2">
                    Last Updated: {selectedBorderData.lastUpdated}
                  </Text>
                </View>
                <Text className="text-blue-600 text-sm mt-1">
                  Data is updated every 5 minutes
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 