import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import iconsBack from '../../assets/icons/iconsBack';
import {SvgXml} from 'react-native-svg';
import {ScrollView} from 'react-native-virtualized-view';
import AuthScreen from './AuthScreen';
import AuthScreenFood from './AuthScreenFood';
import HeaderComponent from '../../components/HeaderComponent';

const Tab = createMaterialTopTabNavigator();

const TabBarLabel = ({focused, label}) => (
  <View style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
    <Text style={{color: focused ? 'black' : 'white', fontSize: 18}}>
      {label}
    </Text>
  </View>
);

const CheckSuccess = ({route}) => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const {_id} = route.params;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <HeaderComponent title="Vé của tôi" navigation={navigation} />
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
            if (route.name === 'AuthScreen') {
              label = 'Vé của tôi';
            } else if (route.name === 'AuthScreenFood') {
              label = 'Đồ ăn';
            }
            return <TabBarLabel focused={focused} label={label} />;
          },
        })}>
        <Tab.Screen
          name="AuthScreen"
          component={AuthScreen}
          initialParams={{_id}}
        />

        <Tab.Screen
          name="AuthScreenFood"
          component={AuthScreenFood}
          initialParams={{_id}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default CheckSuccess;

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
