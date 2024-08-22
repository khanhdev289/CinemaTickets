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
  Alert,
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
import {useAuth} from '../../components/AuthProvider ';

import iconMailProfile from '../../assets/icons/iconProfile/iconMailProfile';
import iconPhoneProfile from '../../assets/icons/iconProfile/iconPhoneProfile';

const POSTS_API_URL = 'http://139.180.132.97:3000/users';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const placeholderImage = require('../../assets/images/logo.png');

const ProfileScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  const [profileRole, setProfileRole] = useState('');

  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {user} = useAuth();
  const {logout} = useAuth();

  useEffect(() => {
    if (user) {
      fetchDataUser();
    }
  }, [user]);

  const fetchDataUser = async () => {
    try {
      setIsLoading(true);

      const userID = user.user._id;
      const token = user.token.access_token;

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
      setProfileRole(userData.role);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getRoleText = () => {
    if (profileRole === 'user') {
      return 'Người dùng';
    } else if (profileRole === 'staff') {
      return 'Nhân viên';
    } else {
      return 'Null';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDataUser();
    setRefreshing(false);
  };

  const tapOnLogOut = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Đăng xuất bị hủy'),
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileHeader1}>
          <View>
            <Image
              source={
                profileImage
                  ? {uri: IMAGE_API_URL + profileImage}
                  : placeholderImage
              }
              style={styles.profileImage}
            />
            <View style={styles.roleView}>
              <Text style={styles.roleProfileInfo}>Khách</Text>
            </View>
          </View>

          <View style={styles.profileContent}>
            <View style={styles.headerRow}>
              <Text style={styles.profileName}>Khách</Text>
            </View>
            <View style={styles.headerRow}>
              <SvgXml xml={iconPhoneProfile()} style={styles.menuIcon} />
              <Text style={styles.profileInfo}>
                {profilePhone || 'Số điện thoại'}
              </Text>
            </View>

            <View style={styles.headerRow}>
              <SvgXml xml={iconMailProfile()} style={styles.menuIcon} />
              <Text style={styles.profileInfo}>{profileEmail || 'Email'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileHeader2}>
          <View
            style={{borderBottomColor: '#444', borderBottomWidth: 1}}></View>
          <TouchableOpacity style={styles.menuItem}>
            <SvgXml xml={iconMyTicketProfile()} style={styles.menuIcon} />
            <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <SvgXml xml={iconChangePassProfile()} style={styles.menuIcon} />
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Vui lòng đăng nhập</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View>
            <Image
              source={
                profileImage
                  ? {uri: IMAGE_API_URL + profileImage}
                  : placeholderImage
              }
              style={styles.profileImage}
            />
            <View style={styles.roleView}>
              <Text style={styles.roleProfileInfo}>{getRoleText()}</Text>
            </View>
          </View>

          <View style={styles.profileContent}>
            <View style={styles.headerRow}>
              <Text style={styles.profileName}>
                {profileName || 'Tên người dùng'}
              </Text>
            </View>
            <View style={styles.headerRow}>
              <SvgXml xml={iconPhoneProfile()} style={styles.menuIcon} />
              <Text style={styles.profileInfo}>
                {profilePhone || 'Số điện thoại'}
              </Text>
            </View>

            <View style={styles.headerRow}>
              <SvgXml xml={iconMailProfile()} style={styles.menuIcon} />
              <Text style={styles.profileInfo}>{profileEmail || 'Email'}</Text>
            </View>
          </View>
        </View>
        <View style={{borderBottomColor: '#444', borderBottomWidth: 1}}></View>
        <TouchableOpacity style={styles.menuItem} onPress={toggleUpdateUser}>
          <SvgXml xml={iconMyTicketProfile()} style={styles.menuIcon} />
          <Text style={styles.menuText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('ChangePassScreen');
          }}>
          <SvgXml xml={iconChangePassProfile()} style={styles.menuIcon} />
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={tapOnLogOut}>
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
    marginTop: 30,
  },
  profileHeader1: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    marginTop: 30,
    opacity: 0.5,
  },
  profileHeader2: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'column',
    marginTop: 30,
    opacity: 0.5,
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

  roleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#f7b731',
    borderWidth: 2,
    padding: 3,
    marginTop: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#f7b731',
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
  roleProfileInfo: {
    color: '#f7b731',
    fontSize: 14,
    fontWeight: 'bold',
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
  loginContainer: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#f7b731',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ProfileScreen;
