import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

type HamburgerMenuProps = {
  navigation: DrawerNavigationProp<ParamListBase>;
};

export default function HamburgerMenu({ navigation }: HamburgerMenuProps) {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="menu" size={24} color="white" />
    </TouchableOpacity>
  );
};
