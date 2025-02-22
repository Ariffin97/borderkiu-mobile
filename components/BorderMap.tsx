import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

interface BorderMapProps {
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export default function BorderMap({ coordinates }: BorderMapProps) {
    const [region, setRegion] = useState({
        ...coordinates,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
    });

    useEffect(() => {
        setRegion({
            ...coordinates,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    }, [coordinates]);

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            showsTraffic={true}
        />
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
