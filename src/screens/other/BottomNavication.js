import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MyTicketScreen from '../home/MyTicketScreen';
import MovieScreen from '../home/MovieScreen';
import ProfileScreen from '../home/ProfileScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/HomeScreen';

import { SvgXml } from 'react-native-svg';
import iconHome from '../../assets/icons/iconHome';
import iconTicket from '../../assets/icons/iconTicket';
import iconVideo from '../../assets/icons/iconVideo';
import iconUser from '../../assets/icons/iconUser';

const Tab = createBottomTabNavigator();

const BottomNavication = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Trang Chủ',
          title: 'Tất cả bài viết',
          tabBarIcon: ({ color, size }) => (
            <SvgXml xml={iconHome()} />
          ),
        }}
      />
        <Tab.Screen
          name="Vé"
          component={MyTicketScreen}
          options={{
            headerShown: true,
            tabBarLabel: 'Vé',
            title: 'Vé',
            tabBarIcon: ({ color, size }) => (
              <SvgXml xml={iconTicket()} />
            ),
          }}
        />
        <Tab.Screen
          name="Phim"
          component={MovieScreen}
          options={{
            headerShown: true,
            tabBarLabel: 'Phim',
            title: 'Phim',
            tabBarIcon: ({ color, size }) => (
              <SvgXml xml={iconVideo()} />
            ),
          }}
        />
        <Tab.Screen
          name="Cá Nhân"
          component={ProfileScreen}
          options={{
            headerShown: true,
            tabBarLabel: 'Cá Nhân',
            title: 'Cá Nhân',
            tabBarIcon: ({ color, size }) => (
              <SvgXml xml={iconUser()} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavication;
