import { BorderDataMap, QueueData } from "@/app";
import { formatUnixTimestamp, millisecondsToHHMM } from "@/utils/time-utils";
import { Text, View } from "react-native";

export default function BorderData({ data }: BorderDataMap) {
    const label1t2 = `${data.country1} - ${data.country2}`;
    const label2t1 = `${data.country2} - ${data.country1}`;

    const QueueData = ({ data, lastUpdated, label }: any) => {
        const formattedQueueTime = millisecondsToHHMM(data.queueTime);
        const formattedQueueLength = (data.queueLength / 1000).toFixed(1);

        return (
            <View className="flex-1 mx-2 p-4 bg-white rounded-lg shadow-lg">
                <Text className="text-md text-center font-bold">{label}</Text>
                <Text className="text-sm text-center">{formattedQueueTime}</Text>
                <Text className="text-sm text-center">{formattedQueueLength}km</Text>
                <Text className="text-xs text-center">{lastUpdated}</Text>
            </View>
        )
    }
    return (
        <View className='flex-row justify-between my-2'>
            <QueueData data={data['1t2']} lastUpdated={data.lastUpdated} label={label1t2} />
            <QueueData data={data['2t1']} lastUpdated={data.lastUpdated} label={label2t1} />
        </View>
    );
}
