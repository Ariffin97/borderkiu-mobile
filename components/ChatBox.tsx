import { ChatResponse, ErrorResponse, ChatMessage } from "@/app";
import { formatHumanReadable } from "@/utils/string-utils";
import { useRef, useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Animated, Image } from "react-native";
import { RefreshCcw, X, Send, MessageSquare, AlertCircle, Users, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBoxProps {
  border: string;
  chatHistory: ChatResponse | ErrorResponse;
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>
  fetchBorderChatHistory: any
  showCloseButton?: boolean;
}

export default function ChatBox({ border, chatHistory, setShowChatBox, fetchBorderChatHistory, showCloseButton = true }: ChatBoxProps) {
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const onChange = (text: string) => {
    setMessage(text);
    setIsTyping(text.length > 0);
  };

  const sendMessage = async () => {
    if (message.trim().length === 0) return;

    const messageToSend = message.trim();
    setMessage('');
    setIsTyping(false);

    try {
      const response = await fetch(`https://www.borderkiu.com/api/chat/${border}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          deviceId: 'jjk'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh chat after sending
      setTimeout(() => fetchBorderChatHistory(border), 500);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ message, index }: { message: ChatMessage, index: number }) => {
    const isRecent = index >= (('chat' in chatHistory) ? chatHistory.chat.length - 3 : 0);
    
    // Safety check for message object
    if (!message || typeof message !== 'object') {
      return (
        <View className="mb-4 p-4 bg-red-50 rounded-xl">
          <Text className="text-red-600 text-sm">Invalid message format</Text>
        </View>
      );
    }

    const { username, time, type, imageUrl, imageThumbnailUrl, caption, isDeveloper, message: textMessage } = message;
    
    return (
      <Animated.View 
        key={index} 
        className="mb-4"
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          }],
        }}
      >
        <View className="flex-row items-start">
          {/* Avatar */}
          <View className={`w-8 h-8 ${isDeveloper ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-full items-center justify-center mr-3`}>
            <Users size={14} color="#ffffff" />
          </View>
          
          {/* Message Content */}
          <View className="flex-1">
            {/* Username */}
            <View className="flex-row items-center mb-1 ml-1">
              <Text className={`text-sm font-medium ${isDeveloper ? 'text-green-600' : 'text-gray-600'}`}>
                {username || 'Anonymous'}
              </Text>
              {isDeveloper && (
                <View className="ml-2 px-2 py-1 bg-green-100 rounded-full">
                  <Text className="text-green-700 text-xs font-bold">DEV</Text>
                </View>
              )}
            </View>
            
            {/* Message Content Based on Type */}
            <View className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm" style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}>
              {type === 'image' && imageUrl ? (
                <View>
                  <Image 
                    source={{ uri: imageUrl }}
                    className="w-full h-48 rounded-xl mb-2"
                    resizeMode="cover"
                  />
                  {caption && (
                    <Text className="text-gray-800 text-base leading-6">{caption}</Text>
                  )}
                </View>
              ) : type === 'image' && imageThumbnailUrl ? (
                <View>
                  <Image 
                    source={{ uri: imageThumbnailUrl }}
                    className="w-full h-48 rounded-xl mb-2"
                    resizeMode="cover"
                  />
                  {caption && (
                    <Text className="text-gray-800 text-base leading-6">{caption}</Text>
                  )}
                </View>
              ) : (
                <Text className="text-gray-800 text-base leading-6">
                  {textMessage || caption || 'No message content'}
                </Text>
              )}
            </View>
            
            {/* Timestamp */}
            <View className="flex-row items-center mt-1 ml-1">
              <Clock size={12} color="#9ca3af" />
              <Text className="text-gray-400 text-xs ml-1">
                {time || 'Unknown time'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <View className="items-center">
        <View className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full items-center justify-center mb-6">
          <MessageSquare size={32} color="#6366f1" />
        </View>
        <Text className="text-gray-800 text-xl font-semibold mb-2">
          Start the conversation
        </Text>
        <Text className="text-gray-500 text-base text-center px-8 leading-6">
          Share real-time updates about border crossing conditions with other travelers
        </Text>
        {('chat' in chatHistory) && chatHistory.userCount > 0 && (
          <Text className="text-blue-600 text-sm mt-4 font-medium">
            {chatHistory.userCount} travelers online
          </Text>
        )}
      </View>
    </View>
  );

  const ErrorDisplay = ({ error }: { error: string }) => (
    <View className="flex-1 items-center justify-center p-6">
      <View className="bg-red-50 rounded-3xl p-8 items-center border border-red-100">
        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
          <AlertCircle size={32} color="#dc2626" />
        </View>
        <Text className="text-red-800 font-semibold text-lg mb-2 text-center">
          Connection Issue
        </Text>
        <Text className="text-red-600 text-sm text-center leading-5">
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchBorderChatHistory(border)}
          className="bg-red-600 px-6 py-3 rounded-full mt-4"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <Animated.View 
        style={{ opacity: fadeAnim }}
        className="flex-1"
      >
        {/* Main Container */}
        <View className="flex-1 bg-white overflow-hidden">
          {/* Header */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-6 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <MessageSquare size={20} color="#ffffff" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-white font-bold text-lg">
                  Live Chat
                </Text>
                <Text className="text-white/80 text-sm">
                  {formatHumanReadable(border)}
                  {('chat' in chatHistory) && chatHistory.userCount && (
                    <Text> • {chatHistory.userCount} online</Text>
                  )}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity
                onPress={() => fetchBorderChatHistory(border)}
                className="p-3 rounded-full bg-white/20"
                activeOpacity={0.7}
              >
                <RefreshCcw size={18} color="#ffffff" />
              </TouchableOpacity>
              {showCloseButton && (
                <TouchableOpacity
                  onPress={() => setShowChatBox(false)}
                  className="p-3 rounded-full bg-white/20"
                  activeOpacity={0.7}
                >
                  <X size={18} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>

          {/* Messages Container */}
          <View className="flex-1 bg-gradient-to-b from-gray-50 to-white">
            <ScrollView
              className="flex-1 px-6"
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
            >
              {('chat' in chatHistory) ? (
                chatHistory.chat.length > 0 ? (
                  <>
                    {chatHistory.chat.filter(msg => msg && typeof msg === 'object').map((msg, index) => (
                      <MessageBubble key={index} message={msg} index={index} />
                    ))}
                  </>
                ) : (
                  <EmptyState />
                )
              ) : (
                <ErrorDisplay error={chatHistory.error} />
              )}
            </ScrollView>
          </View>

          {/* Input Section */}
          <View className="bg-white border-t border-gray-100">
            <View className="px-6 py-4">
              <View className="flex-row items-end space-x-3">
                {/* Input Container */}
                <View className="flex-1 bg-gray-50 rounded-3xl px-5 py-3 min-h-[50px] justify-center" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}>
                  <TextInput
                    className="text-gray-800 text-base leading-6"
                    value={message}
                    onChangeText={onChange}
                    placeholder="Share border updates..."
                    placeholderTextColor="#9ca3af"
                    returnKeyType="send"
                    onSubmitEditing={sendMessage}
                    onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    multiline
                    maxLength={500}
                    style={{ minHeight: 24, maxHeight: 120 }}
                  />
                </View>
                
                {/* Send Button */}
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={message.trim().length === 0}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    message.trim().length > 0 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gray-200'
                  }`}
                  activeOpacity={0.8}
                  style={{
                    shadowColor: message.trim().length > 0 ? "#6366f1" : "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: message.trim().length > 0 ? 0.3 : 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Send 
                    size={18} 
                    color={message.trim().length > 0 ? '#ffffff' : '#9ca3af'} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Helper Text */}
              <Text className="text-gray-400 text-xs mt-3 text-center">
                Help fellow travelers with real-time border conditions
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  )
}