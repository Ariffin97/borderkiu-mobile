import { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import ChatBox from '@/components/ChatBox';
import { ChatResponse, ErrorResponse } from './index';

type ChatState = ChatResponse | ErrorResponse;

export default function LiveChatTab() {
  const [selectedBorder] = useState<string>('Miri(SungaiTujuh)');
  const [chatHistory, setChatHistory] = useState<ChatState>({ error: 'Loading...' });
  const [showChatBox, setShowChatBox] = useState<boolean>(true);

  const fetchBorderChatHistory = async (border: string) => {
    try {
      const response = await fetch(`https://www.borderkiu.com/api/chat/${border}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ChatResponse = await response.json();
      setChatHistory(data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setChatHistory({ error: 'Failed to load chat history. Please check your connection.' });
    }
  };

  useEffect(() => {
    fetchBorderChatHistory(selectedBorder);
  }, [selectedBorder]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Chat Component */}
      {showChatBox && (
        <ChatBox 
          border={selectedBorder}
          chatHistory={chatHistory}
          setShowChatBox={setShowChatBox}
          fetchBorderChatHistory={fetchBorderChatHistory}
          showCloseButton={false}
        />
      )}
    </SafeAreaView>
  );
} 