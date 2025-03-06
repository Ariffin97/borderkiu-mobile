import BorderData from '@/components/BorderData';
import BorderMap from '@/components/BorderMap';
import BorderPicker from '@/components/BorderPicker';
import ChatBox from '@/components/ChatBox';
import QueueTimeChart from '@/components/QueueTimeChart';
import { formatUnixTimestamp } from '@/utils/time-utils';
import { useEffect, useState } from 'react';
import { View, ScrollView, Text, Keyboard } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { ChartLine, MessageCircleMore } from 'lucide-react-native'
import io from 'socket.io-client';

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

// interfaces
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

export interface ChatResponse {
  chat: string[];
}

export interface ErrorResponse {
  error: string;
}

type ChatState = ChatResponse | ErrorResponse;

export default function Home() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null)
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<BorderDirections | null>(null);
  const [borderChatHistory, setBorderChatHistory] = useState<ChatState>({ error: 'No chat history available yet' });
  const [showChatBox, setShowChatBox] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [undreadMessages, setUnreadMessages] = useState(0)

  // GET /api/borders mock
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
    setSelectedBorderData(borderData[selectedBorder])
  }, [selectedBorder])

  const fetchBorderChatHistory = async (border: string) => {
    try {
      const response = await fetch(`https://chat-xuou.onrender.com/api/chat/${border}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setBorderChatHistory({ error: `Chat history for ${border} not found.` });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setBorderChatHistory(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setBorderChatHistory({ error: 'An unexpected error occurred while fetching chat history.' });
    }
  };

  useEffect(() => {
    if (!selectedBorder) return;

    const socket = io('https://chat-xuou.onrender.com');

    fetchBorderChatHistory(selectedBorder);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('join', selectedBorder);
    });

    socket.on('chat message', (message) => {
      console.log('Received new message:', message);
      setUnreadMessages(undreadMessages => undreadMessages + 1);
      setBorderChatHistory((prevMessages: ChatState) => {
        if ('chat' in prevMessages) {
          return {
            ...prevMessages,
            chat: [...prevMessages.chat, message]
          };
        } else {
          return prevMessages;
        }
      });
    });

    socket.on('connect_error', (error) => {
      console.log('Connection Error:', error);
    });

    return () => {
      socket.off('chat message');
      socket.disconnect();
    };
  }, [selectedBorder]);

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

  const toggleChatBox = () => {
    setShowChart(false);
    setUnreadMessages(0);
    setShowChatBox(!showChatBox);
  }

  const toggleChart = () => {
    setShowChatBox(false);
    setShowChart(!showChart);
  }
  return (
    <GestureHandlerRootView className='flex-1'>
      {selectedBorderData && (
        <View className='flex-1'>
          <BorderMap coordinates={selectedBorderData?.coordinates} />
          <View className='flex-1 pt-5 pb-10 mb-10'>
            <BorderPicker borders={borders} selectedBorder={selectedBorder} setSelectedBorder={setSelectedBorder} />
            <BorderData data={selectedBorderData} />
            {showChatBox &&
              <ChatBox
                border={selectedBorder}
                chatHistory={borderChatHistory}
                setShowChatBox={setShowChatBox}
              />
            }
            {showChart &&
              <QueueTimeChart
                border={selectedBorder}
                country1={selectedBorderData.country1}
                country2={selectedBorderData.country2}
                setShowChart={setShowChart}
              />
            }
          </View>
          {!isKeyboardVisible && (
            <View className='absolute bottom-3 right-2'>
              <View className='flex-1 flex-column gap-3'>
                <TouchableOpacity
                  onPress={toggleChatBox}
                  style={{
                    backgroundColor: 'white',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 1.5,
                    elevation: 1,
                    position: 'relative',
                  }}
                  className="rounded-full w-14 h-14 bg-white flex items-center justify-center"
                >
                  <MessageCircleMore color='gray' size={35} />
                  {undreadMessages > 0 && (
                    <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {undreadMessages > 99 ? '99+' : undreadMessages}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={toggleChart}
                  style={{
                    backgroundColor: 'white',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 1.5,
                    elevation: 1
                  }}
                  className='rounded-full w-14 h-14 bg-gray-50 shadow flex items-center justify-center'
                >
                  <ChartLine color='gray' size={35} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
};