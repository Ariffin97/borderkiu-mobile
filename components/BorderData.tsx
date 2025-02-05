import { BorderDataMap } from "@/app";
import { Text, View } from "react-native";

export default function BorderData({ data }: BorderDataMap) {

    const QueueData = ({ data }: any) => (
        <View className="flex-1 mr-2 p-4 bg-white rounded-lg shadow">
            <Text className="text-sm">{data.direction}</Text>
            <Text className="text-sm">Queue Time: {data.queueTime}</Text>
            <Text className="text-sm">Queue Length: {data.queueLength}</Text>
            <Text className="text-sm">Last Updated: {data.lastUpdated}</Text>
        </View>
    )

    return (
        <View className="flex-row justify-between my-2">
            <QueueData data={data['1t2']}/>
            <QueueData data={data['2t1']}/>
        </View>
    );
}
