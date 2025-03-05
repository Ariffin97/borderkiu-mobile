import { ChatResponse, ErrorResponse } from "@/app";
import { formatHumanReadable } from "@/utils/string-utils";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { X } from 'lucide-react-native';
interface ChatBoxProps {
  border: string;
  chatHistory: ChatResponse | ErrorResponse;
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatBox({ border, chatHistory, setShowChatBox }: ChatBoxProps) {
  const [message, setMessage] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  const onChange = (text: string) => setMessage(text);

  const sendMessage = async () => {
    if (message.trim().length === 0) return;

    try {
      const response = await fetch(`https://chat-xuou.onrender.com/api/chat/${border}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          deviceId: 'jjk'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 z-50'
    >
      <View className="bg-white rounded-lg shadow flex-1 mx-2 p-2">
        <TouchableOpacity onPress={() => setShowChatBox(false)}>
          <X color="#5d6198" className='self-end' />
        </TouchableOpacity>
        <Text className="font-bold mb-2">
          Live Chat ({formatHumanReadable(border)})
        </Text>
        <ScrollView
          className="p-2 flex-1 h-50"
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {('chat' in chatHistory)
            ? chatHistory.chat.map((message, index) => (
              <Text key={index}>{message}</Text>
            ))
            : <Text>Error: {chatHistory.error}</Text>
          }
        </ScrollView>
        <View className="flex-row border border-gray-300 rounded-lg overflow-hidden">
          <TextInput
            className="flex-1 h-12 px-3"
            value={message}
            onChangeText={onChange}
            placeholder="Enter your message"
            returnKeyType="send"
            returnKeyLabel="send"
            onSubmitEditing={sendMessage}
            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}