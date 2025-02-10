import { ChatResponse, ErrorResponse } from "@/app";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
interface ChatBoxProps {
    border: string;
    chatHistory: ChatResponse | ErrorResponse;
    callBack: any
}

export default function ChatBox({ border, chatHistory, callBack }: ChatBoxProps) {
    const [message, setMessage] = useState<string>('');

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

            callBack(border);
            setMessage('');
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    return (
        <View className='bg-white rounded-lg shadowflex-1 mx-2 mb-4 p-2 bg-white'>
            <Text className='font-bold'>Live Chat ({border})</Text>
            <View className='p-2'>
                {('chat' in chatHistory)
                    ? chatHistory.chat.map((message, index) => (
                        <Text key={index}>{message}</Text>
                    ))
                    : <Text>Error: {chatHistory.error}</Text>
                }
            </View>
            <View className="flex-row border border-gray-300 rounded-lg overflow-hidden">
                <TextInput
                    className="flex-1 h-12 px-3"
                    value={message}
                    onChangeText={onChange}
                    placeholder="Enter your message"
                    returnKeyType="send"
                    returnKeyLabel="send"
                    onSubmitEditing={sendMessage}
                />
            </View>
        </View>
    )
}