import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  RefreshControl,
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
const placeholderImage = require('../../assets/images/logo.png');

const ProfileScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDataUser();
  }, []);

  const fetchDataUser = async () => {
    try {
      setIsLoading(true);

      const userID = '666fe9e1f0849a6a8a904a4c';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZmZTllMWYwODQ5YTZhOGE5MDRhNGMiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiZHV5a2hhbmhzdDFAZ21haWwuY29tIiwiaWF0IjoxNzE4NjEwNTUwLCJleHAiOjE3MTkyMTUzNTB9.V3N_5YzfYE5TtSPAlnm8MrK9rSza77ZhjpiAqhjkEQU';

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
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataUser();
    setRefreshing(false);
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleUpdateUser = () => {
    navigation.navigate('UpdateUserScreen', {
      dataUserImage: profileImage,
      dataUserName: profileName,
      dataUserPhone: profilePhone,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDataUser();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
        hidden={false}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f7b731" />
        </View>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.profileHeader}>
          <Image
            source={
              profileImage
                ? {uri: IMAGE_API_URL + profileImage}
                : placeholderImage
            }
            style={styles.profileImage}
          />
          <View style={styles.profileContent}>
            <View style={styles.headerRow}>
              <Text style={styles.profileName}>
                {profileName || 'Tên người dùng'}
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={toggleUpdateUser}>
                <SvgXml xml={iconEditProfile()} />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileInfo}>
              {profilePhone || 'Số điện thoại'}
            </Text>
            <Text style={styles.profileInfo}>{profileEmail || 'Email'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('AuthScreen');
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
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
