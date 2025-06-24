import { useState, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Svg, { Path, G, Text as SvgText, Line } from 'react-native-svg';
import * as d3 from 'd3';
import { X, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface QueueTimeChartProps {
    border: string;
    country1: string;
    country2: string;
    setShowChart: React.Dispatch<React.SetStateAction<boolean>>
}

const QueueTimeChart = ({ border, country1, country2, setShowChart }: QueueTimeChartProps) => {
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQueueTimesAndRenderChart();
    }, [border]);

    const fetchQueueTimesAndRenderChart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://www.borderkiu.com/api/queue-times/${border}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
            setError('Failed to load chart data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const ErrorDisplay = () => (
        <View className="flex-1 items-center justify-center p-8">
            <View className="bg-red-50 rounded-2xl p-6 items-center">
                <AlertCircle size={48} color="#dc2626" />
                <Text className="text-red-800 font-semibold text-lg mt-3 text-center">
                    Chart Unavailable
                </Text>
                <Text className="text-red-600 text-sm mt-2 text-center">
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={fetchQueueTimesAndRenderChart}
                    className="bg-red-100 px-4 py-2 rounded-xl mt-4"
                >
                    <Text className="text-red-700 font-medium">Try Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const LoadingDisplay = () => (
        <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" color="#1e40af" />
            <Text className="text-gray-600 mt-4 text-center">Loading chart data...</Text>
        </View>
    );

    if (loading) {
        return (
            <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                className="flex-1 rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 24,
                    elevation: 10,
                }}
            >
                <LinearGradient
                    colors={['#1e40af', '#3b82f6']}
                    className="px-6 py-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center flex-1">
                        <BarChart3 size={24} color="#ffffff" />
                        <Text className="text-white font-bold text-lg ml-3">Queue Trends</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowChart(false)}
                        className="p-2 rounded-full bg-white/20"
                    >
                        <X size={20} color="#ffffff" />
                    </TouchableOpacity>
                </LinearGradient>
                <LoadingDisplay />
            </LinearGradient>
        );
    }

    if (error || !chartData) {
        return (
            <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                className="flex-1 rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 24,
                    elevation: 10,
                }}
            >
                <LinearGradient
                    colors={['#1e40af', '#3b82f6']}
                    className="px-6 py-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center flex-1">
                        <BarChart3 size={24} color="#ffffff" />
                        <Text className="text-white font-bold text-lg ml-3">Queue Trends</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowChart(false)}
                        className="p-2 rounded-full bg-white/20"
                    >
                        <X size={20} color="#ffffff" />
                    </TouchableOpacity>
                </LinearGradient>
                <ErrorDisplay />
            </LinearGradient>
        );
    }

    const width = Dimensions.get('window').width - 80;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 80, left: 50 };

    const x = d3.scaleLinear()
        .domain([0, chartData.hoursAgo.length - 1])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max([...chartData.aryQueueTimes_1t2, ...chartData.aryQueueTimes_2t1]) || 0])
        .range([height - margin.bottom, margin.top]);

    const line = d3.line<number>()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveBasis);

    const line1 = line(chartData.aryQueueTimes_1t2);
    const line2 = line(chartData.aryQueueTimes_2t1);

    return (
        <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            className="flex-1 rounded-3xl shadow-2xl overflow-hidden"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
                elevation: 10,
            }}
        >
            {/* Header */}
            <LinearGradient
                colors={['#1e40af', '#3b82f6']}
                className="px-6 py-4 flex-row items-center justify-between"
            >
                <View className="flex-row items-center flex-1">
                    <TrendingUp size={24} color="#ffffff" />
                    <View className="ml-3 flex-1">
                        <Text className="text-white font-bold text-lg">Queue Trends</Text>
                        <Text className="text-blue-100 text-sm">24-hour historical data</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => setShowChart(false)}
                    className="p-2 rounded-full bg-white/20"
                >
                    <X size={20} color="#ffffff" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Chart */}
            <View className="flex-1 p-6 bg-gray-50">
                <View className="bg-white rounded-2xl p-4 shadow-sm">
                    <Svg width={width} height={height + 60} className="rounded-xl">
                        {/* Grid lines */}
                        {y.ticks(5).map((tick) => (
                            <G key={tick}>
                                <SvgText
                                    x={margin.left - 10}
                                    y={y(tick)}
                                    fontSize={10}
                                    textAnchor="end"
                                    alignmentBaseline="middle"
                                    fill="#6b7280"
                                >
                                    {tick}
                                </SvgText>
                                <Line
                                    x1={margin.left}
                                    y1={y(tick)}
                                    x2={width - margin.right}
                                    y2={y(tick)}
                                    stroke="#f3f4f6"
                                    strokeWidth={1}
                                />
                            </G>
                        ))}

                        {/* X-axis labels */}
                        {chartData.hoursAgo.map((hour: string, i: number) => {
                            if (i % 7 === 0) {
                                return (
                                    <G key={i} transform={`translate(${x(i)},${height - margin.bottom}) rotate(-45)`}>
                                        <SvgText
                                            fontSize={10}
                                            textAnchor="end"
                                            dy={10}
                                            dx={-10}
                                            fill="#6b7280"
                                        >
                                            {hour}
                                        </SvgText>
                                    </G>
                                );
                            }
                            return null;
                        })}

                        {/* Chart lines */}
                        <Path d={line1 || ""} stroke="#3b82f6" strokeWidth={3} fill="none" />
                        <Path d={line2 || ""} stroke="#10b981" strokeWidth={3} fill="none" />

                        {/* Axes */}
                        <Line
                            x1={margin.left}
                            y1={height - margin.bottom}
                            x2={width - margin.right}
                            y2={height - margin.bottom}
                            stroke="#d1d5db"
                            strokeWidth={2}
                        />
                        <Line
                            x1={margin.left}
                            y1={margin.top}
                            x2={margin.left}
                            y2={height - margin.bottom}
                            stroke="#d1d5db"
                            strokeWidth={2}
                        />

                        {/* Axis titles */}
                        <SvgText
                            x={width / 2}
                            y={height - 10}
                            fontSize={12}
                            textAnchor="middle"
                            dy={5}
                            fill="#374151"
                            fontWeight="500"
                        >
                            Time (24h)
                        </SvgText>

                        <SvgText
                            x={15}
                            y={height / 2}
                            fontSize={12}
                            textAnchor="middle"
                            transform={`rotate(-90, 15, ${height / 2})`}
                            fill="#374151"
                            fontWeight="500"
                        >
                            Queue Time (min)
                        </SvgText>
                    </Svg>
                </View>

                {/* Legend */}
                <View className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
                    <Text className="text-gray-800 font-semibold mb-3">Legend</Text>
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <View className="w-4 h-0.5 bg-blue-500 mr-3" />
                            <Text className="text-gray-700 text-sm">
                                {country1} → {country2}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-4 h-0.5 bg-green-500 mr-3" />
                            <Text className="text-gray-700 text-sm">
                                {country2} → {country1}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default QueueTimeChart;