import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {launchImageLibrary} from 'react-native-image-picker';

import iconEditProfile from '../../assets/icons/iconProfile/iconEditProfile';
import iconMyTicketProfile from '../../assets/icons/iconProfile/iconMyTicketProfile';
import iconChangePassProfile from '../../assets/icons/iconProfile/iconChangePassProfile';
import iconFaceIdProfile from '../../assets/icons/iconProfile/iconFaceIdProfile';
import {SvgXml} from 'react-native-svg';
import axios from 'axios';

const POSTS_API_URL = 'http://139.180.132.97:3000/users';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';

const ProfileScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [idUser, setIdUser] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDataUser();
  }, []);

  const fetchDataUser = async () => {
    try {
      setIsLoading(true);

      const userID = '666dd4cc2262470e147ad102';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZkZDRjYzIyNjI0NzBlMTQ3YWQxMDIiLCJyb2xlIjoidXNlciIsImVtYWlsIjoicXVhbmprbDk4QGdtYWlsLmNvbSIsImlhdCI6MTcxODU0NjE0NCwiZXhwIjoxNzE5MTUwOTQ0fQ.mmYibUvBFnwJ6upnaTQGBuZsnwB1a_pVOcj0ARwhH-I';

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = `${POSTS_API_URL}/${userID}`;
      const response = await axiosInstance.get(url);

      const userData = response.data.getUser;
      setProfileImage(userData.image);
      setProfileName(userData.name);
      setProfilePhone(userData.number_phone);
      setProfileEmail(userData.email);

      setIsLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu người dùng: ', error);
    }
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  const updateUserData = async () => {
    try {
      setIsLoading(true);

      const userID = '666dd4cc2262470e147ad102';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZkZDRjYzIyNjI0NzBlMTQ3YWQxMDIiLCJyb2xlIjoidXNlciIsImVtYWlsIjoicXVhbmprbDk4QGdtYWlsLmNvbSIsImlhdCI6MTcxODU0NjE0NCwiZXhwIjoxNzE5MTUwOTQ0fQ.mmYibUvBFnwJ6upnaTQGBuZsnwB1a_pVOcj0ARwhH-I';

      const formData = new FormData();
      formData.append('image', {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      });
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

      toggleModal();
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f7b731" />
        </View>
      )}
      <View style={styles.profileHeader}>
        <Image
          source={{uri: IMAGE_API_URL + profileImage}}
          style={styles.profileImage}
        />
        <View style={styles.profileContent}>
          <View style={styles.headerRow}>
            <Text style={styles.profileName}>{profileName}</Text>
            <TouchableOpacity style={styles.editButton} onPress={toggleModal}>
              <SvgXml xml={iconEditProfile()} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileInfo}>{profilePhone}</Text>
          <Text style={styles.profileInfo}>{profileEmail}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('TicketScreen');
        }}>
        <SvgXml xml={iconMyTicketProfile()} style={styles.menuIcon} />
        <Text style={styles.menuText}>Vé của tôi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate('ChangePassScreen');
        }}>
        <SvgXml xml={iconChangePassProfile()} style={styles.menuIcon} />
        <Text style={styles.menuText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
      <View style={styles.menuItem}>
        <SvgXml xml={iconFaceIdProfile()} style={styles.menuIcon} />
        <Text style={styles.menuText}>Face ID / Touch ID</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.switch}
        />
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng Xuất</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật thông tin cá nhân</Text>
          <TouchableOpacity onPress={selectImage}>
            <Image
              source={{uri: IMAGE_API_URL + profileImage}}
              style={styles.modalProfileImage}
            />
          </TouchableOpacity>
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
            <Text style={styles.logoutText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  profileContent: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    color: '#aaa',
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  menuIcon: {
    color: '#fff',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 20,
    flex: 1,
  },
  switch: {
    marginLeft: 'auto',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#f7b731',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  logoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#f7b731',
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 15,
  },
  editButton: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
});

export default ProfileScreen;
