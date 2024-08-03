import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MyTicketScreen from './MyTicketScreen';

import iconsBack from '../../assets/icons/iconsBack';
import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-virtualized-view';
import {da} from 'date-fns/locale';
import MyTicketScreenFood from './MyTicketScreenFood';

const Tab = createMaterialTopTabNavigator();

const TabBarLabel = ({focused, label}) => (
  <View style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
    <Text style={{color: focused ? 'black' : 'white', fontSize: 18}}>
      {label}
    </Text>
  </View>
);

const TicketScreen = ({route}) => {
  const navigation = useNavigation();
  const {check} = route.params;
  const {_id} = route.params;

  const handleBack = () => {
    if (check) {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleBack}>
            <SvgXml style={styles.back} xml={iconsBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Vé của tôi</Text>
        <View style={styles.placeholder} />
      </View>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIndicatorStyle: {backgroundColor: 'transparent'},

          tabBarStyle: {
            backgroundColor: '#1C1C1C',
            marginHorizontal: 20,
            marginBottom: -50,
            borderRadius: 10,
          },
          tabBarLabel: ({focused}) => {
            let label;
            if (route.name === 'MyTicketScreen') {
              label = 'Vé của tôi';
            } else if (route.name === 'MyTicketScreenFood') {
              label = 'Đồ ăn';
            }
            return <TabBarLabel focused={focused} label={label} />;
          },
        })}>
        <Tab.Screen
          name="MyTicketScreen"
          component={MyTicketScreen}
          initialParams={{_id}}
        />

        <Tab.Screen
          name="MyTicketScreenFood"
          component={MyTicketScreenFood}
          initialParams={{_id}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TicketScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: '5%',
  },
  backContainer: {
    position: 'absolute',
    left: 8,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  tabBarLabel: {
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 8,
  },
  tabBarLabelFocused: {
    backgroundColor: '#FCC434',
  },
});
