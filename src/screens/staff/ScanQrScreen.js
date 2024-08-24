import React, {useState, useEffect, useRef} from 'react';
import {Alert, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

import {PERMISSIONS, request} from 'react-native-permissions';
import {useAuth} from '../../components/AuthProvider ';

const POSTS_API_URL = 'http://139.180.132.97:3000/tickets/status/';
const POSTS_API_URL_STATUS = 'http://139.180.132.97:3000/users';

const ScanQrScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const scannerRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {logout} = useAuth();
  const [userDataStatus, setUserDataStatus] = useState('');

  const fetchDataUserStatus = async () => {
    try {
      const userID = user.user._id;
      const token = user.token.access_token;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = `${POSTS_API_URL_STATUS}/${userID}`;
      const response = await axiosInstance.get(url);

      const userData = response.data.getUser;
      setUserDataStatus(userData.status);
      if (user) {
        if (userData.status === 'inactive') {
          Alert.alert('Tài khoản đã bị vô hiệu hóa');
          navigation.navigate('Welcome');
          logout();
        }
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataUserStatus();
  }, [user]);

  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    if (result !== 'granted') {
      // Alert.alert(
      //   'Quyền Truy Cập Máy Ảnh',
      //   'Quyền truy cập máy ảnh là cần thiết để quét mã QR.',
      // );
    }
  };

  useEffect(() => {
    requestCameraPermission();

    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
    });

    return unsubscribe;
  }, [navigation]);

  const fetchDataUser = async id => {
    try {
      setIsLoading(true);

      const userID = user.user._id;
      const token = user.token.access_token;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const currentDate = new Date().toISOString();

      const url = `${POSTS_API_URL}${id}/complete?staffId=${userID}&time_check=${currentDate}`;

      const response = await axiosInstance.put(url);

      const userData = response.data;

      Alert.alert('Thông báo', `Đã quét xong!`);
      navigation.navigate('CheckSuccess', {_id: userData._id});
      setScanned(true);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu: ', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý mã QR.');
      setScanned(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRRead = ({data}) => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData && jsonData._id && jsonData.auth === 'mdticket') {
        fetchDataUser(jsonData._id);
      } else {
        Alert.alert(
          'Mã QR Không Hợp Lệ',
          'Mã QR đã quét không hợp lệ để xác thực.',
        );
        setScanned(false);
      }
    } catch (error) {
      Alert.alert(
        'Mã QR Không Hợp Lệ',
        'Mã QR đã quét không phải là JSON hợp lệ.',
      );
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    scannerRef.current.reactivate();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <QRCodeScanner
        ref={scannerRef}
        onRead={scanned ? undefined : handleQRRead}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
      />
      <TouchableOpacity style={styles.button} onPress={resetScanner}>
        <Text style={styles.buttonText}>Quét lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#f7b731',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScanQrScreen;
