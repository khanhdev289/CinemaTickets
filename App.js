import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Linking, Platform} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavication from './src/screens/other/BottomNavication';
import SignInScreen from './src/screens/start/SignInScreen';
import SearchScreen from './src/screens/home/SearchScreen';
import MovieDetailScreen from './src/screens/home/MovieDetailScreen';
import MyTicketScreen from './src/screens/ticket/MyTicketScreen';
import SignUpScreen from './src/screens/start/SignUpScreen';
import ComfirmOTP from './src/screens/start/ComfirmOTP';
import WelcomeScreen from './src/screens/start/WelcomeScreen';
import ChangePassScreen from './src/screens/other/ChangePassScreen';
import ProfileScreen from './src/screens/home/ProfileScreen';
import MovieScreen from './src/screens/home/MovieScreen';
import MovieByGenre from './src/screens/home/MovieByGenre';
import SuccessScreen from './src/screens/start/SuccessScreen ';

import ScanQrScreen from './src/screens/staff/ScanQrScreen';
import AuthScreen from './src/screens/staff/AuthScreen';
import UpdateUserScreen from './src/screens/other/UpdateUserScreen';
import ForgotPassScreen from './src/screens/start/ForgotPassScreen';
import NewPassScreen from './src/screens/start/NewPassScreen';
import TicketScreen from './src/screens/ticket/TicketsScreen';
import CheckSuccess from './src/screens/staff/CheckSuccess';
import SelectSeatScreen from './src/screens/home/SelectSeatScreen';
import PaymentScreen from './src/screens/home/PaymentScreen';
import {StripeProvider} from '@stripe/stripe-react-native';
import {AuthProvider} from './src/components/AuthProvider ';

import WelComeNew from './src/screens/start/WelComeNew';
import DiscountDetailScreen from './src/screens/home/DiscountDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, request} from 'react-native-permissions';
import NotificationScreen from './src/screens/other/NotificationScreen';
import linking from './src/utils/linking';
import axios from 'axios';
const Stack = createNativeStackNavigator();

const UPDATE_NOTIFI_API_URL = 'http://139.180.132.97:3000/notification';

const updateNotificationStatus = async notifiId => {
  try {
    await axios.put(`${UPDATE_NOTIFI_API_URL}/${notifiId}`, {status: false});
    console.log('Notification status updated successfully');
  } catch (error) {
    console.error('Error updating notification status:', error);
  }
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
          await AsyncStorage.setItem('isFirstLaunch', 'false');
          setInitialRoute('WelComeNew');
        } else {
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    const fetchToken = async () => {
      try {
        const token = await getFcmToken();
        if (token) {
          await AsyncStorage.setItem('fcmToken', token);
          console.log('FCM Token stored:', token);
        }
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    const createNotificationChannel = async () => {
      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          sound: 'default',
          importance: AndroidImportance.HIGH,
        });
        console.log('Notification channel created');
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    };

    const handleNotificationPress = async (data, isTokenAvailable) => {
      if (data && data.ticketId && data.notifiId) {
        await updateNotificationStatus(data.notifiId);
        const url = isTokenAvailable
          ? `mychat://ticket/${data.ticketId}`
          : `mychat://home`;
        Linking.openURL(url);
      } else {
        console.log('Data is missing in the notification');
      }
    };

    const setupForegroundNotificationListener = () => {
      notifee.onForegroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log('Foreground Event Detail:', detail);
          const token = await AsyncStorage.getItem('token');
          await handleNotificationPress(detail.notification?.data, !!token);
        }
      });
    };

    const setupBackgroundNotificationListener = () => {
      notifee.onBackgroundEvent(async ({type, detail}) => {
        if (type === EventType.PRESS && detail.pressAction.id === 'default') {
          const token = await AsyncStorage.getItem('token');
          await handleNotificationPress(detail.notification?.data, !!token);
        }
      });
    };

    const setupMessagingListeners = () => {
      messaging().onMessage(async remoteMessage => {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );

        if (
          remoteMessage?.notification?.title &&
          remoteMessage?.notification?.body
        ) {
          await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data,
            android: {
              channelId: 'default',
              pressAction: {
                id: 'default',
              },
              importance: AndroidImportance.HIGH,
              smallIcon: 'ic_mess_noti',
              color: '#ef5455',
            },
          });
        }
      });

      messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        await handleNotificationPress(remoteMessage.data, true);
      });

      messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state:',
              remoteMessage.notification,
            );
            await handleNotificationPress(remoteMessage.data, true);
          }
        });
    };

    checkFirstLaunch();

    if (Platform.OS === 'android') {
      fetchToken();
      createNotificationChannel();
      setupForegroundNotificationListener();
      setupBackgroundNotificationListener();
      setupMessagingListeners();
    }

    return () => {
      messaging().onMessage(() => {}); // Unsubscribe on cleanup
    };
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer linking={linking}>
        <StripeProvider publishableKey="pk_test_51PNdpDDbcfrQz51XX1abFbkrZH4yagcpYDWPNRrA8ursSgjR1LCRAPh5TFqjPsYKcgsnSPEu5BWMSvW20lYqwVEy00ludlggnR">
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="Home"
              component={BottomNavication}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={SignInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchScreeen"
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieDetailScreen"
              component={MovieDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DiscountDetailScreen"
              component={DiscountDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SelectSeatScreen"
              component={SelectSeatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangePassScreen"
              component={ChangePassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MyTickets"
              component={MyTicketScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="TicketScreen"
              component={TicketScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieByGenre"
              component={MovieByGenre}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Ss"
              component={SuccessScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Otp"
              component={ComfirmOTP}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ScanQrScreen"
              component={ScanQrScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AuthScreen"
              component={AuthScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UpdateUserScreen"
              component={UpdateUserScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="forgotPassword"
              component={ForgotPassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NewPassScreen"
              component={NewPassScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CheckSuccess"
              component={CheckSuccess}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MovieScreen"
              component={MovieScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WelComeNew"
              component={WelComeNew}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </StripeProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}

export const getFcmToken = async () => {
  let token = null;
  await checkApplicationNotificationPermission();
  await registerAppWithFCM();
  try {
    token = await messaging().getToken();
    console.log('getFcmToken-->', token);
  } catch (error) {
    console.log('getFcmToken Device Token error ', error);
  }
  return token;
};

export async function registerAppWithFCM() {
  console.log(
    'registerAppWithFCM status',
    messaging().isDeviceRegisteredForRemoteMessages,
  );
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging()
      .registerDeviceForRemoteMessages()
      .then(status => {
        console.log('registerDeviceForRemoteMessages status', status);
      })
      .catch(error => {
        console.log('registerDeviceForRemoteMessages error ', error);
      });
  }
}

export const checkApplicationNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
    .then(result => {
      console.log('POST_NOTIFICATIONS status:', result);
    })
    .catch(error => {
      console.log('POST_NOTIFICATIONS error ', error);
    });
};
