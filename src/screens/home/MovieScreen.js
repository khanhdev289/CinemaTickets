import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NowPlayingScreen from '../other/NowPlayingScreen';
import ComingSoonScreen from '../other/ComingSoonScreen';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const TabBarLabel = ({focused, label}) => (
  <View style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
    <Text style={{color: focused ? 'black' : 'white', fontSize: 18}}>
      {label}
    </Text>
  </View>
);

const MovieScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIndicatorStyle: {backgroundColor: 'transparent'},
          tabBarStyle: {
            backgroundColor: '#1C1C1C',
            borderRadius: 10,
            marginHorizontal:10
          },
          tabBarLabel: ({focused}) => {
            let label;
            if (route.name === 'NowPlayingScreen') {
              label = 'Phim đang chiếu';
            } else if (route.name === 'ComingSoonScreen') {
              label = 'Phim sắp chiếu';
            }
            return <TabBarLabel focused={focused} label={label} />;
          },
        })}>
        <Tab.Screen name="NowPlayingScreen" component={NowPlayingScreen} />
        <Tab.Screen name="ComingSoonScreen" component={ComingSoonScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  tabBarLabel: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 8,
  },
  tabBarLabelFocused: {
    backgroundColor: '#FCC434',
  },
});
