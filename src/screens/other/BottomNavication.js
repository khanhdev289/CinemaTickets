import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MyTicketScreen from '../home/MyTicketScreen';
import MovieScreen from '../home/MovieScreen';
import ProfileScreen from '../home/ProfileScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';

import {SvgXml} from 'react-native-svg';
import iconHome from '../../assets/icons/iconHome';
import iconTicket from '../../assets/icons/iconTicket';
import iconVideo from '../../assets/icons/iconVideo';
import iconUser from '../../assets/icons/iconUser';
import TicketScreen from '../home/TicketScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: 'black'},
        tabBarActiveTintColor: 'yellow',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang Chủ',
          tabBarIcon: ({color, size}) => (
            <SvgXml xml={iconHome()} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Vé"
        component={MyTicketScreen}
        options={{
          tabBarLabel: 'Vé',
          tabBarIcon: ({color, size}) => (
            <SvgXml xml={iconTicket()} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Phim"
        component={MovieScreen}
        options={{
          tabBarLabel: 'Phim',
          tabBarIcon: ({color, size}) => (
            <SvgXml xml={iconVideo()} fill={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cá Nhân"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá Nhân',
          tabBarIcon: ({color, size}) => (
            <SvgXml xml={iconUser()} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
