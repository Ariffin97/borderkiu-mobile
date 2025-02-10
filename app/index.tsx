import BorderData from '@/components/BorderData';
import BorderMap from '@/components/BorderMap';
import BorderPicker from '@/components/BorderPicker';
import ChatBox from '@/components/ChatBox';
import QueueTimeChart from '@/components/QueueTimeChart';
import { formatUnixTimestamp } from '@/utils/time-utils';
import { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, ScrollView } from 'react-native';

// Mock data
const data = {
  'Miri(SungaiTujuh)': {
    country1: 'Miri',
    country2: 'Brunei',
    lastUpdated: formatUnixTimestamp(Date.now()),
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

export default function Home() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null)
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<BorderDirections | null>(null);
  const [borderChatHistory, setBorderChatHistory] = useState<ChatResponse | ErrorResponse>({error: 'No chat history available yet'});

  // GET /api/borders mock
  useEffect(() => {
    setTimeout(() => {
      setBorderData(data);
    }, 100);
  }, []);

  useEffect(() => {
    if(!borderData) return;
    const keys = Object.keys(borderData);
    setBorders(keys);
    setSelectedBorderData(borderData[selectedBorder]);
  }, [borderData]);

  useEffect(() => {
    if(!selectedBorder || !borderData) return;
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
    if(!selectedBorder) return;
    fetchBorderChatHistory(selectedBorder);
  }, [selectedBorder])

  return (
    <ScrollView className='flex p-2'>
      <BorderPicker borders={borders} selectedBorder={selectedBorder} setSelectedBorder={setSelectedBorder}/>
      {selectedBorderData && (
        <View>
          <BorderData data={selectedBorderData}/>
          <BorderMap border={selectedBorder}/>
          <QueueTimeChart border={selectedBorder} country1={selectedBorderData.country1} country2={selectedBorderData.country2}/>
          <ChatBox border={selectedBorder} chatHistory={borderChatHistory} callBack={fetchBorderChatHistory}/>
        </View>
      )}
    </ScrollView>
  );
}