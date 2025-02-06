import { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, G, Text, Line } from 'react-native-svg';
import * as d3 from 'd3';

interface QueueTimeChartProps {
    border: string;
    country1: string;
    country2: string;
}

const QueueTimeChart = ({ border, country1, country2 }: QueueTimeChartProps) => {
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
    const height = 260;
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
        <View className='rounded-lg shadow flex-1 mx-2 mt-2 mb-4 justify-center align-center bg-black p-2'>
            <Svg width={width} height={height} className='bg-black rounded-lg'>
                {/* y-axis labels */}
                {y.ticks(5).map((tick) => (
                    <G key={tick}>
                        <Text
                            x={margin.left - 10}
                            y={y(tick)}
                            fontSize={8}
                            fill="white"
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
                                    fill="white"
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
                    stroke="white"
                />
                <Line
                    x1={margin.left}
                    y1={margin.top}
                    x2={margin.left}
                    y2={height - margin.bottom}
                    stroke="white"
                />

                {/* x-axis title*/}
                <Text
                    x={width / 2}
                    y={height - 10}
                    fontSize={10}
                    fill="white"
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
                    fill="white"
                    textAnchor="middle"
                    transform={`rotate(-90, 10, ${height / 2})`}
                >
                    Queue Time (min)
                </Text>
            </Svg>
        </View>
    );
};

export default QueueTimeChart;