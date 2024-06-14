import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MyTicketScreen from '../home/MyTicketScreen';
import MovieScreen from '../home/MovieScreen';
import ProfileScreen from '../home/ProfileScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomNavication = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Trang Chủ',
          title: 'Tất cả bài viết',
        }}
      />
      <Tab.Screen
        name="Vé"
        component={MyTicketScreen}
        options={{
          headerShown: true,
          tabBarLabel: 'Vé',
          title: 'Vé',
        }}
      />
      <Tab.Screen
        name="Phim"
        component={MovieScreen}
        options={{
          headerShown: true,
          tabBarLabel: 'Phim',
          title: 'Phim',
        }}
      />
      <Tab.Screen
        name="Cá Nhân"
        component={ProfileScreen}
        options={{
          headerShown: true,
          tabBarLabel: 'Cá Nhân',
          title: 'Cá Nhân',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavication;
