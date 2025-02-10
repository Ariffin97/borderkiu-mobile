import { BorderDataMap, QueueData } from "@/app";
import { formatUnixTimestamp, millisecondsToHHMM } from "@/utils/time-utils";
import { Text, View } from "react-native";

export default function BorderData({ data }: BorderDataMap) {

    const QueueData = ({ data, lastUpdated }: any) => {
        const formattedQueueTime = millisecondsToHHMM(data.queueTime);
        const formattedQueueLength = (data.queueLength / 1000).toFixed(1);

        return (
            <View className="flex-1 mx-2 p-4 bg-white rounded-lg shadow">
                <Text className="text-md text-center font-bold">{data.direction}</Text>
                <Text className="text-sm text-center">{formattedQueueTime}</Text>
                <Text className="text-sm text-center">{formattedQueueLength}km</Text>
                <Text className="text-xs text-center">{lastUpdated}</Text>
            </View>
        )
    }
    return (
        <View className='flex-row justify-between my-2'>
            <QueueData data={data['1t2']} lastUpdated={data.lastUpdated}/>
            <QueueData data={data['2t1']} lastUpdated={data.lastUpdated}/>
        </View>
    );
}
