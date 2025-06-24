import { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, Text, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { MessageSquare, MapPin, Users, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BorderPicker from '@/components/BorderPicker';
import CollapsibleHeader from '@/components/CollapsibleHeader';
import { formatHumanReadable } from '@/utils/string-utils';
import { ChatResponse, ErrorResponse, BorderDataMap, ChatMessage } from './index';
import { formatUnixTimestamp } from '@/utils/time-utils';
import io from 'socket.io-client';

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
  'Lawas(ICQSMengkalap)': {
    country1: 'Lawas',
    country2: 'Brunei',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: { latitude: 4.8500, longitude: 115.4167 },
    '1t2': { queueTime: 420000, queueLength: 150 },
    '2t1': { queueTime: 360000, queueLength: 100 }
  },
  'Sindumin-Merapok': {
    country1: 'Sarawak',
    country2: 'Sabah',
    lastUpdated: formatUnixTimestamp(Date.now()),
    coordinates: { latitude: 4.7000, longitude: 115.8000 },
    '1t2': { queueTime: 300000, queueLength: 80 },
    '2t1': { queueTime: 240000, queueLength: 60 }
  },
};

export default function ChatRoomSelection() {
  const router = useRouter();
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState<{[key: string]: number}>({});
  const [chatPreviews, setChatPreviews] = useState<{[key: string]: string}>({});

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

  // Socket.IO setup for all borders
  useEffect(() => {
    if (!borders) return;

    // Create socket connections for each border using namespaces
    const sockets: any[] = [];

    borders.forEach(border => {
      const socket = io(`https://www.borderkiu.com/${border}`, {
        query: {
          deviceIdentifier: 'borderkiu-mobile-app'
        }
      });

              socket.on('chat message', (message) => {
          if (message && typeof message === 'object') {
            setUnreadMessages(prev => ({
              ...prev,
              [border]: (prev[border] || 0) + 1
            }));
            
            // Create preview text from message object
            const previewText = message.message || message.caption || `${message.username}: ${message.type === 'image' ? 'sent an image' : 'sent a message'}`;
            setChatPreviews(prev => ({
              ...prev,
              [border]: previewText
            }));
          }
        });

              socket.on('chat history', (history) => {
          if (history && Array.isArray(history) && history.length > 0) {
            const lastMessage = history[history.length - 1];
            if (lastMessage && typeof lastMessage === 'object') {
              const previewText = lastMessage.message || lastMessage.caption || `${lastMessage.username}: ${lastMessage.type === 'image' ? 'sent an image' : 'sent a message'}`;
              setChatPreviews(prev => ({
                ...prev,
                [border]: previewText
              }));
            }
          }
        });

      sockets.push(socket);
      fetchLastMessage(border);
    });

    return () => {
      sockets.forEach(socket => socket.disconnect());
    };
  }, [borders]);

  const fetchLastMessage = async (border: string) => {
    try {
      const response = await fetch(`https://www.borderkiu.com/api/chat/${border}`);
      if (response.ok) {
        const data: ChatResponse = await response.json();
        if (data.chat && data.chat.length > 0) {
          const lastMessage = data.chat[data.chat.length - 1];
          if (lastMessage && typeof lastMessage === 'object') {
            const previewText = lastMessage.message || lastMessage.caption || `${lastMessage.username}: ${lastMessage.type === 'image' ? 'sent an image' : 'sent a message'}`;
            setChatPreviews(prev => ({
              ...prev,
              [border]: previewText
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching last message:', error);
    }
  };

  const openChat = (border: string) => {
    setUnreadMessages(prev => ({
      ...prev,
      [border]: 0
    }));
    
    router.push({
      pathname: '/Chat',
      params: { border }
    });
  };

  const getQueueStatus = (queueTime: number) => {
    if (queueTime < 300000) return { status: 'Low', color: '#10b981', bg: '#ecfdf5' };
    if (queueTime < 900000) return { status: 'Moderate', color: '#f59e0b', bg: '#fffbeb' };
    return { status: 'High', color: '#ef4444', bg: '#fef2f2' };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <CollapsibleHeader />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-4"
      >
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <MessageSquare size={20} color="#ffffff" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white font-bold text-lg">Live Chat</Text>
            <Text className="text-white/80 text-sm">Connect with travelers at border crossings</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
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
          <View className="mb-6">
            <Text className="text-gray-800 text-lg font-semibold mb-4">Current Border Chat</Text>
            
            <View className="bg-white rounded-xl p-6 mb-4" style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                  <MapPin size={20} color="#374151" />
                  <Text className="text-gray-900 text-lg font-semibold ml-2">
                    {formatHumanReadable(selectedBorder)}
                  </Text>
                </View>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: getQueueStatus((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2).bg }}
                >
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: getQueueStatus((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2).color }}
                  >
                    {getQueueStatus((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2).status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Clock size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-1">
                    Avg. Wait: {Math.round(((selectedBorderData['1t2'].queueTime + selectedBorderData['2t1'].queueTime) / 2) / 60000)} min
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Users size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {((selectedBorderData['1t2'].queueLength + selectedBorderData['2t1'].queueLength) / 2000).toFixed(1)} km queue
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => openChat(selectedBorder)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 relative"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <MessageSquare size={20} color="#ffffff" />
                  <Text className="text-white font-semibold text-base ml-2">Join Chat</Text>
                </View>
                {unreadMessages[selectedBorder] > 0 && (
                  <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[24px] h-[24px] flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {unreadMessages[selectedBorder] > 9 ? '9+' : unreadMessages[selectedBorder]}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {chatPreviews[selectedBorder] && (
                <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <Text className="text-gray-500 text-xs mb-1">Latest message:</Text>
                  <Text className="text-gray-700 text-sm" numberOfLines={2}>
                    {chatPreviews[selectedBorder]}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-gray-800 text-lg font-semibold mb-4">All Border Chats</Text>
          
          {borders && borders.map((border) => (
            <TouchableOpacity
              key={border}
              onPress={() => openChat(border)}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between"
              activeOpacity={0.7}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-1">
                <Text className="text-gray-900 font-medium text-base mb-1">
                  {formatHumanReadable(border)}
                </Text>
                {chatPreviews[border] ? (
                  <Text className="text-gray-500 text-sm" numberOfLines={1}>
                    {chatPreviews[border]}
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-sm">No messages yet</Text>
                )}
              </View>
              
              <View className="flex-row items-center">
                {unreadMessages[border] > 0 && (
                  <View className="bg-red-500 rounded-full min-w-[20px] h-[20px] flex items-center justify-center mr-3">
                    <Text className="text-white text-xs font-bold">
                      {unreadMessages[border] > 9 ? '9+' : unreadMessages[border]}
                    </Text>
                  </View>
                )}
                <MessageSquare size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 