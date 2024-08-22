import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

import HeaderComponent from '../../components/HeaderComponent';
import {useAuth} from '../../components/AuthProvider ';

const POSTS_API_URL = 'http://139.180.132.97:3000/users';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const placeholderImage = require('../../assets/images/logo.png');

const UpdateUserScreen = ({navigation, route}) => {
  const {dataUserImage, dataUserName, dataUserPhone} = route.params;
  const {user} = useAuth();

  const [profileImage, setProfileImage] = useState('');
  const [profileName, setProfileName] = useState(dataUserName);
  const [profilePhone, setProfilePhone] = useState(dataUserPhone);
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomName = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `${randomString}.jpg`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const validateInputs = () => {
    if (!profileName) {
      alert('Tên không được để trống.');
      return false;
    }

    if (profileName.length < 6 || profileName.length > 30) {
      alert('Tên phải từ 6 đến 30 ký tự và không chứa ký tự đặc biệt.');
      return false;
    }
    if (!profilePhone) {
      alert('Số điện thoại không được để trống.');
      return false;
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(profilePhone)) {
      alert('Số điện thoại phải chứa từ 10 đến 11 chữ số và chỉ chứa số.');
      return false;
    }

    return true;
  };

  const updateUserData = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);

      const userID = user.user._id;
      const token = user.token.access_token;
      const formData = new FormData();
      if (profileImage) {
        formData.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: generateRandomName(),
        });
      } else {
        formData.append('image', {
          uri: IMAGE_API_URL + dataUserImage,
          type: 'image/jpeg',
          name: dataUserImage,
        });
      }
      formData.append('name', profileName);
      formData.append('number_phone', profilePhone);

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = `${POSTS_API_URL}/${userID}`;
      const response = await axiosInstance.put(url, formData);

      const updatedUserData = response.data;
      setProfileName(updatedUserData.name);
      setProfilePhone(updatedUserData.number_phone);
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng: ', error);
      setIsLoading(false);
    }
  };

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('Cancelled');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const uri = response.assets[0].uri;
          setProfileImage(uri);
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Cập nhật thông tin" navigation={navigation} />

      <View style={{borderBottomColor: '#444', borderBottomWidth: 1}}></View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f7b731" />
        </View>
      )}
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Ảnh đại diện</Text>
          <TouchableOpacity onPress={selectImage}>
            <Text style={{textAlign: 'center', color: '#FCC434'}}>
              Chọn ảnh{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={{uri: profileImage || IMAGE_API_URL + dataUserImage}}
            style={styles.modalProfileImage}
          />
        </View>

        <View style={{borderBottomColor: '#444', borderBottomWidth: 1}}></View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Thông tin khác</Text>
        </View>

        <TextInput
          style={styles.modalInput}
          value={profileName}
          onChangeText={setProfileName}
          placeholder="Nhập tên"
        />

        <TextInput
          style={styles.modalInput}
          value={profilePhone}
          onChangeText={setProfilePhone}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />

        <View style={{borderBottomColor: '#444', borderBottomWidth: 1}}></View>

        <TouchableOpacity style={styles.modalButton} onPress={updateUserData}>
          <Text style={styles.logoutText}>Thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
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
    left: 5,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  categoryTitle: {
    marginVertical: 20,
    fontSize: 22,
    color: 'white',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'black',
    padding: 22,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  modalProfileImage: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    marginVertical: 20,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    color: '#FFFFFF',
    margin: 20,
  },
  modalButton: {
    backgroundColor: '#FCC434',
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 30,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateUserScreen;
