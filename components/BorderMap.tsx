import { useEffect, useState } from "react";
import { Image, View } from "react-native";

interface BorderMapProps {
    border: string
}

export default function BorderMap({ border }: BorderMapProps) {
    const [mapUrl, setMapUrl] = useState<string | null>(null)

    useEffect(() => {
        fetch(`https://www.borderkiu.com/api/latest-map/${border}`)
            .then(response => response.json())
            .then(result => setMapUrl(`https://www.borderkiu.com${result.imagePath}`))
            .catch(error => console.error('Error fetching data:', error));
    }, [border])

    return (
        <View className='bg-white rounded-lg shadowflex-1 mx-2 bg-white'>
            {mapUrl && <Image className='rounded-lg shadow' source={{ uri: mapUrl }} style={{ width: '100%', aspectRatio: 1 }}
            />}
        </View>
    )
}