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
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SvgXml} from 'react-native-svg';
import axios from 'axios';
import iconsBack from '../../assets/icons/iconsBack';

const POSTS_API_URL = 'http://139.180.132.97:3000/users';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const placeholderImage = require('../../assets/images/logo.png');

const UpdateUserScreen = ({navigation, route}) => {
  const {dataUserImage, dataUserName, dataUserPhone} = route.params;

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

  const updateUserData = async () => {
    try {
      setIsLoading(true);

      const userID = '666fe9e1f0849a6a8a904a4c';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZmZTllMWYwODQ5YTZhOGE5MDRhNGMiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiZHV5a2hhbmhzdDFAZ21haWwuY29tIiwiaWF0IjoxNzE4NjEwNTUwLCJleHAiOjE3MTkyMTUzNTB9.V3N_5YzfYE5TtSPAlnm8MrK9rSza77ZhjpiAqhjkEQU';
      const formData = new FormData();
      if (profileImage) {
        formData.append('image', {
          uri: profileImage,
          type: 'image/jpeg',
          name: generateRandomName(),
        });
      } else {
        // Nếu profileImage rỗng, sử dụng ảnh cũ (dataUserImage)
        formData.append('image', {
          uri: IMAGE_API_URL + dataUserImage,
          type: 'image/jpeg',
          name: dataUserImage, // Đặt tên ảnh là tên hiện tại
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
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleBack}>
            <SvgXml style={styles.back} xml={iconsBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Cập nhật thông tin</Text>
        <View style={styles.placeholder} />
      </View>
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
            <Text style={{textAlign: 'center', color: 'white'}}>Chọn ảnh </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={{uri: profileImage || IMAGE_API_URL + dataUserImage}}
            style={styles.modalProfileImage}
          />
        </View>

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
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateUserScreen;
