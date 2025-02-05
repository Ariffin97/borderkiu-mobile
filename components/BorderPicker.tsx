import { Text, View } from "react-native";
import {Picker} from '@react-native-picker/picker';

type BorderSelectorProps = {
    borders: string[] | null,
    selectedBorder: string,
    setSelectedBorder: React.Dispatch<React.SetStateAction<string>>
}

export default function BorderPicker({ borders, selectedBorder,setSelectedBorder }: BorderSelectorProps) {
    return (
        <View className='bg-white shadow mx-2 rounded-lg'>
            <Picker
                selectedValue={selectedBorder}
                onValueChange={(value) => setSelectedBorder(value)}
            >
                {borders && borders.map((item, index) => (
                    <Picker.Item 
                        label={item}
                        value={item}
                        key={index}
                    />
                ))}
            </Picker>
        </View>
    )
}