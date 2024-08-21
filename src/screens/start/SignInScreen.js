import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useAuth} from '../../components/AuthProvider ';
import axios from 'axios';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import messaging from '@react-native-firebase/messaging';
import {getFcmToken} from '../../utils/firebase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const fetchStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');

        if (storedEmail && storedPassword) {
          setEmail(storedEmail);
          setPassword(storedPassword);
          setTermsAccepted(true);
        } else {
          console.log('Không tìm thấy email hoặc password trong AsyncStorage.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đã lưu:', error);
      }
    };

    fetchStoredCredentials();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const fcmToken = await AsyncStorage.getItem('fcmToken');
      if (fcmToken) {
        setFcmToken(fcmToken);
      }
    };

    getToken();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://139.180.132.97:3000/auth/login?tokendevice=${fcmToken}`,
        {
          email: email,
          password: password,
        },
      );
      if (!response.data || response.data.error) {
        console.error('Đăng nhập thất bại:', response.data.message);
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Đăng nhập thất bại',
          textBody: 'email và mật khẩu không trùng khớp',
          button: 'Đóng',
        });
      } else {
        console.log('Đăng nhập thành công:', response.data);
        const userData = response.data;
        login(userData);
        // if (fcmToken) {
        //   await axios.post(
        //     `http://139.180.132.97:3000/auth/login?tokendevice=${fcmToken}`,
        //   );
        // }

        if (termsAccepted) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }

        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Đăng nhập thất bại',
        textBody: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
        button: 'Đóng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('forgotPassword');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <AlertNotificationRoot style={styles.dialog_error}>
      <ImageBackground
        source={require('../../assets/images/bgLogin.png')}
        style={styles.background}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <SafeAreaView style={styles.container}>
            <View style={styles.overlay} />
            <View style={styles.welcome}>
              <Text style={styles.welcomeText}>Xin Chào,</Text>
              <Text style={styles.subWelcomeText}>Chào mừng bạn quay lại</Text>
            </View>
            <View style={styles.inputForm}>
              <View style={styles.inputEmail}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập Email"
                  placeholderTextColor="#FFFFFF"
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
              </View>
              <View style={styles.inputPass}>
                <Text style={styles.label}>Mật Khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập Mật Khẩu"
                  placeholderTextColor="#FFFFFF"
                  secureTextEntry
                  onChangeText={text => setPassword(text)}
                  value={password}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  value={termsAccepted}
                  onValueChange={setTermsAccepted}
                  style={styles.checkBox}
                  tintColors={{true: '#FFFFFF', false: '#FFFFFF'}}
                  boxType="circle"
                />
                <Text style={[styles.checkBoxText, {color: '#FF9C00'}]}>
                  Nhớ mật khẩu
                </Text>
              </View>
              <View style={styles.forgotPassword}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu ?</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogin}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Đăng Nhập</Text>
              </View>
            </TouchableOpacity>
            <Spinner visible={loading} color="#FCC434" />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </AlertNotificationRoot>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
  },
  background: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  welcome: {
    marginStart: '5%',
    marginEnd: '5%',
    marginTop: '20%',
    marginBottom: '20%',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subWelcomeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  inputForm: {
    marginStart: '5%',
    marginEnd: '5%',
  },
  inputEmail: {
    marginBottom: '10%',
  },
  inputPass: {
    marginBottom: '10%',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: '3%',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  forgotPassword: {
    alignItems: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF9C00',
    marginStart: '5%',
  },
  buttonContainer: {
    marginHorizontal: '5%',
    margin: '20%',
  },
  button: {
    backgroundColor: '#FCC434',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  },
  dialog_error: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
  },
});
