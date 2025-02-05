import BorderPicker from '@/components/BorderPicker';
import { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';

// Mock data
const data = {
  'Miri': {
    queueTime1t2: 8,
    queueTime2t1: 9,
    queueLength1t2: 20,
    queuelength2t1: 30,
    lastUpdated: Date.now()
  },
  'Kuala Lurah': {
    queueTime1t2: 8,
    queueTime2t1: 9,
    queueLength1t2: 1000,
    queuelength2t1: 30,
    lastUpdated: Date.now()
  },
  'Ujung Jalan': {
    queueTime1t2: 8,
    queueTime2t1: 900,
    queueLength1t2: 20,
    queuelength2t1: 3000,
    lastUpdated: Date.now()
  },
}
// interfaces
interface BorderData {
  queueTime1t2: number;
  queueTime2t1: number;
  queueLength1t2: number;
  queuelength2t1: number;
  lastUpdated: number;
}

interface BorderDataMap {
  [key: string]: BorderData;
}

export default function Home() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null)
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri');
  const [selectedBorderData, setSelectedBorderData] = useState<BorderData | null>(null);

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

  return (
    <View className='flex-1 p-2'>
      <Text>{selectedBorder}</Text>
      <Text>{JSON.stringify(selectedBorderData)}</Text>
      <BorderPicker borders={borders} selectedBorder={selectedBorder} setSelectedBorder={setSelectedBorder}/>
    </View>
  );
}
