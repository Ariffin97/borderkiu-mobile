import { useState, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Text, Line } from 'react-native-svg';
import * as d3 from 'd3';
import { X } from 'lucide-react-native';

interface QueueTimeChartProps {
    border: string;
    country1: string;
    country2: string;
    setShowChart: React.Dispatch<React.SetStateAction<boolean>>
}

const QueueTimeChart = ({ border, country1, country2, setShowChart }: QueueTimeChartProps) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        fetchQueueTimesAndRenderChart();
    }, [border]);

    const fetchQueueTimesAndRenderChart = async () => {
        try {
            const response = await fetch(`https://www.borderkiu.com/api/queue-times/${border}`);
            const data = await response.json();
            setChartData(data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    if (!chartData) {
        return null;
    }

    const width = Dimensions.get('window').width - 60;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };

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
        <View className='rounded-lg shadow flex mx-2 z-50 p-2 align-center bg-white shadow items-center'>
            <TouchableOpacity className='self-end' onPress={() => setShowChart(false)}>
                <X color="#5d6198" className='self-end' />
            </TouchableOpacity>
            <Svg width={width} height={height + 60} className='rounded-lg'>
                {/* y-axis labels */}
                {y.ticks(5).map((tick) => (
                    <G key={tick}>
                        <Text
                            x={margin.left - 10}
                            y={y(tick)}
                            fontSize={8}
                            textAnchor="end"
                            alignmentBaseline="middle"
                        >
                            {tick}
                        </Text>
                        <Line
                            x1={margin.left}
                            y1={y(tick)}
                            x2={width - margin.right}
                            y2={y(tick)}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={0.5}
                        />
                    </G>
                ))}

                {/* x-axis labels (at intervals of 35 mins and rotated 45 degrees)*/}
                {chartData.hoursAgo.map((hour: string, i: number) => {

                    if (i % 7 === 0) {
                        return (
                            <G key={i} transform={`translate(${x(i)},${height - margin.bottom}) rotate(-45)`}>
                                <Text
                                    fontSize={8}
                                    textAnchor="end"
                                    dy={10}
                                    dx={-10}
                                >
                                    {hour}
                                </Text>
                            </G>
                        );
                    }
                    return null;
                })}

                {/* Chart lines */}
                <Path d={line1 || ""} stroke="rgba(255, 99, 132, 1)" strokeWidth={2} fill="none" />
                <Path d={line2 || ""} stroke="rgba(54, 162, 235, 1)" strokeWidth={2} fill="none" />

                {/* Axes */}
                <Line
                    x1={margin.left}
                    y1={height - margin.bottom}
                    x2={width - margin.right}
                    y2={height - margin.bottom}
                    stroke="gray"
                />
                <Line
                    x1={margin.left}
                    y1={margin.top}
                    x2={margin.left}
                    y2={height - margin.bottom}
                    stroke="gray"
                />

                {/* x-axis title*/}
                <Text
                    x={width / 2}
                    y={height - 10}
                    fontSize={10}
                    textAnchor="middle"
                    dy={5}
                >
                    Time (24h)
                </Text>

                {/* y-axis title */}
                <Text
                    x={10}
                    y={height / 2}
                    fontSize={10}
                    textAnchor="middle"
                    transform={`rotate(-90, 10, ${height / 2})`}
                >
                    Queue Time (min)
                </Text>

                {/* Legend */}
                <G transform={`translate(${margin.left}, ${height + 10})`}>
                    {/* Legend for country1 */}
                    <Line
                        x1={0}
                        y1={0}
                        x2={20}
                        y2={0}
                        stroke="rgba(255, 99, 132, 1)"
                        strokeWidth={2}
                    />
                    <Text x={25} y={5} fontSize={10} textAnchor="start">
                        {country1} - {country2}
                    </Text>

                    {/* Legend for country2 */}
                    <Line
                        x1={0}
                        y1={25}
                        x2={20}
                        y2={25}
                        stroke="rgba(54, 162, 235, 1)"
                        strokeWidth={2}
                    />
                    <Text x={25} y={30} fontSize={10} textAnchor="start">
                        {country2} - {country1}
                    </Text>
                </G>

            </Svg>
        </View>
    );
};

export default QueueTimeChart;