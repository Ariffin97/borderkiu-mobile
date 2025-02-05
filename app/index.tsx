import BorderData from '@/components/BorderData';
import BorderMap from '@/components/BorderMap';
import BorderPicker from '@/components/BorderPicker';
import { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';

// Mock data
const data = {
  'Miri(SungaiTujuh)': {
    '1t2': {
      direction: 'Miri-Brunei',
      queueTime: 540000,
      queueLength: 2008,
      lastUpdated: Date.now()
    },
    '2t1': {
      direction: 'Brunei-Miri',
      queueTime: 480000,
      queueLength: 1200,
      lastUpdated: Date.now()
    }
  },
  'KualaLurah(ICQSTedungan)': {
    '1t2': {
      direction: 'Brunei-Limbang',
      queueTime: 890889,
      queueLength: 2387,
      lastUpdated: Date.now()
    },
    '2t1': {
      direction: 'Limbang-Brunei',
      queueTime: 888888,
      queueLength: 480,
      lastUpdated: Date.now()
    }
  },
  'UjungJalan(ICQSPandaruan)': {
    '1t2': {
      direction: 'Temburung-Limbang',
      queueTime: 823847,
      queueLength: 20,
      lastUpdated: Date.now()
    },
    '2t1': {
      direction: 'Limbang-Temburung',
      queueTime: 873620,
      queueLength: 200,
      lastUpdated: Date.now()
    }
  },
}

// interfaces
export interface QueueData {
  direction: string;
  queueTime: number;
  queueLength: number;
  lastUpdated: number;
}

interface BorderDirections {
  '1t2': QueueData;
  '2t1': QueueData;
}

export interface BorderDataMap {
  [borderName: string]: BorderDirections;
}

export default function Home() {
  const [borderData, setBorderData] = useState<BorderDataMap | null>(null);
  const [borders, setBorders] = useState<string[] | null>(null)
  const [selectedBorder, setSelectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [selectedBorderData, setSelectedBorderData] = useState<BorderDirections | null>(null);

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
    <View className='flex p-2'>
      <BorderPicker borders={borders} selectedBorder={selectedBorder} setSelectedBorder={setSelectedBorder}/>
      {selectedBorderData && (
        <View>
          <BorderData data={selectedBorderData}/>
          <BorderMap border={selectedBorder}/>
        </View>
      )}
    </View>
  );
}
