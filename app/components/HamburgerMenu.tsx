import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProps } from '@/types';

type Props = {
  navigation: DrawerNavigationProps;
};

export const HamburgerMenu: React.FC<Props> = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
};
