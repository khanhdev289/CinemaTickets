import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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

import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, request} from 'react-native-permissions';
import NotificationScreen from './src/screens/other/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
          // First launch
          await AsyncStorage.setItem('isFirstLaunch', 'false');
          setInitialRoute('WelComeNew');
        } else {
          // Not the first launch
          setInitialRoute('Home');
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };
    checkFirstLaunch();

    const fetchToken = async () => {
      const token = await getFcmToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        console.log('FCM Token stored:', token);
      }
    };
    fetchToken();

    const createNotificationChannel = async () => {
      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          sound: 'default',
          vibration: true,
        });
        console.log('Notification channel created');
      } catch (error) {
        console.error('Error creating notification channel:', error);
      }
    };

    createNotificationChannel();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      if (
        remoteMessage?.notification?.title &&
        remoteMessage?.notification?.body
      ) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
          },
        });
      }
    });

    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'onNotificationOpenedApp Received',
        JSON.stringify(remoteMessage),
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  if (initialRoute === null) {
    return null; // or a loading spinner
  }

  return (
    <AuthProvider>
      <NavigationContainer>
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
