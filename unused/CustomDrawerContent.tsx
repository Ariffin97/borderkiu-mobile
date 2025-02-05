import React, { useState } from 'react';
import { View } from 'react-native';
import { 
    DrawerContentScrollView,
    DrawerContentComponentProps,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';

// Dummy content
const borders = [
    'border1',
    'border2',
    'border3'
]
export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
                <DrawerItem label='Borders' onPress={() => setIsExpanded(!isExpanded)}/>
            {isExpanded && borders && borders.map((border, index) => (
                <View>
                    <DrawerItem label={border} onPress={() => null} key={index}/>
                </View>
            ))}
        </DrawerContentScrollView>
    );
}
