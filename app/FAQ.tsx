import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, ArrowLeft, HelpCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      category: "General",
      question: "What is BorderKiu?",
      answer: "BorderKiu is a real-time border crossing intelligence platform that provides live queue times, wait estimates, and community updates to help travelers plan their border crossings more efficiently."
    },
    {
      category: "General", 
      question: "How accurate are the queue time estimates?",
      answer: "Our queue times are updated in real-time using multiple data sources including official border services, community reports, and AI-powered analysis. Accuracy typically ranges from 85-95% depending on the border crossing."
    },
    {
      category: "Live Chat",
      question: "How does the live chat work?",
      answer: "The live chat connects travelers at specific border crossings. You can share real-time updates, ask questions, and get advice from people currently at the same location. All messages are moderated for safety."
    },
    {
      category: "Live Chat",
      question: "Is the chat secure and anonymous?",
      answer: "Yes, the chat is designed with privacy in mind. You don't need to provide personal information, and messages are automatically cleaned after 24 hours. However, please avoid sharing sensitive personal details."
    },
    {
      category: "Data & Analytics",
      question: "What data does the analytics section show?",
      answer: "The analytics section provides historical trends, average wait times, peak hours analysis, and comparative data across different border crossings to help you plan optimal travel times."
    },
    {
      category: "Data & Analytics",
      question: "How often is the data updated?",
      answer: "Border crossing data is updated every 5-15 minutes depending on the source. Community chat messages and reports are updated in real-time using WebSocket connections."
    },
    {
      category: "Technical",
      question: "Do I need an account to use BorderKiu?",
      answer: "No account is required for basic features like viewing queue times and reading chat messages. However, contributing to chat discussions may require basic verification for spam prevention."
    },
    {
      category: "Technical",
      question: "Which border crossings are supported?",
      answer: "Currently, we support major border crossings between Brunei, Malaysia, and Singapore. We're continuously expanding coverage based on user demand and data availability."
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = [...new Set(faqData.map(item => item.category))];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-6"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
            <HelpCircle size={20} color="#ffffff" />
          </View>
          
          <View className="flex-1">
            <Text className="text-white font-bold text-xl">
              Frequently Asked Questions
            </Text>
            <Text className="text-white/80 text-sm">
              Get answers to common questions
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {categories.map(category => (
          <View key={category} className="mb-8">
            {/* Category Header */}
            <Text className="text-gray-900 text-lg font-bold mb-4 px-2">
              {category}
            </Text>

            {/* FAQ Items for this category */}
            {faqData
              .filter(item => item.category === category)
              .map((item, index) => {
                const globalIndex = faqData.indexOf(item);
                const isExpanded = expandedItems.includes(globalIndex);
                
                return (
                  <View
                    key={globalIndex}
                    className="bg-white rounded-xl mb-3 overflow-hidden"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleExpanded(globalIndex)}
                      className="p-4 flex-row items-center justify-between"
                      activeOpacity={0.7}
                    >
                      <Text className="text-gray-900 font-medium text-base flex-1 pr-3">
                        {item.question}
                      </Text>
                      <View
                        style={{
                          transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
                        }}
                      >
                        <ChevronDown size={20} color="#6b7280" />
                      </View>
                    </TouchableOpacity>

                    {isExpanded && (
                      <View className="px-4 pb-4 border-t border-gray-100">
                        <Text className="text-gray-700 text-sm leading-6 pt-3">
                          {item.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
          </View>
        ))}

        {/* Contact Section */}
        <View className="bg-blue-50 rounded-xl p-6 mt-4 mb-6">
          <Text className="text-blue-900 font-semibold text-lg mb-2">
            Still have questions?
          </Text>
          <Text className="text-blue-700 text-sm leading-6">
            If you can't find the answer you're looking for, feel free to reach out to our community in the live chat or contact our support team.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
