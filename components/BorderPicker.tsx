import { Text, View, TouchableOpacity, Animated } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { formatHumanReadable } from "@/utils/string-utils";
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';

type BorderSelectorProps = {
    borders: string[] | null,
    selectedBorder: string,
    setSelectedBorder: React.Dispatch<React.SetStateAction<string>>
}

export default function BorderPicker({ borders, selectedBorder, setSelectedBorder }: BorderSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: isExpanded ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(rotateValue, {
                toValue: isExpanded ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isExpanded]);

    const rotateInterpolate = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const heightInterpolate = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200], // Adjust this value based on your picker height
    });

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View className="bg-white/90 backdrop-blur-md mx-4 rounded-2xl overflow-hidden" style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        }}>
            {/* Header - Always visible and tappable */}
            <TouchableOpacity 
                onPress={toggleExpanded}
                className="flex-row items-center justify-between px-4 py-3"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center flex-1">
                    <MapPin size={18} color="#1e40af" />
                    <View className="ml-2 flex-1">
                        <Text className="text-base font-semibold text-gray-800">
                            Select Border Crossing
                        </Text>
                        {!isExpanded && selectedBorder && (
                            <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
                                {formatHumanReadable(selectedBorder)}
                            </Text>
                        )}
                    </View>
                </View>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <ChevronDown size={20} color="#6b7280" />
                </Animated.View>
            </TouchableOpacity>

            {/* Collapsible Picker Section */}
            <Animated.View 
                style={{ 
                    height: heightInterpolate,
                    overflow: 'hidden'
                }}
            >
                <View className="border-t border-gray-200">
                    <Picker
                        selectedValue={selectedBorder}
                        onValueChange={(value) => setSelectedBorder(value)}
                        style={{
                            color: '#1f2937',
                            fontSize: 16,
                        }}
                        itemStyle={{
                            fontSize: 16,
                            color: '#1f2937',
                        }}
                    >
                        {borders && borders.map((item, index) => (
                            <Picker.Item 
                                label={formatHumanReadable(item)}
                                value={item}
                                key={index}
                                style={{ fontSize: 16 }}
                            />
                        ))}
                    </Picker>
                </View>
            </Animated.View>
        </View>
    )
}