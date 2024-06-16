import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import {launchImageLibrary} from 'react-native-image-picker';

import iconEditProfile from '../../assets/icons/iconProfile/iconEditProfile';
import iconMyTicketProfile from '../../assets/icons/iconProfile/iconMyTicketProfile';
import iconChangePassProfile from '../../assets/icons/iconProfile/iconChangePassProfile';
import iconFaceIdProfile from '../../assets/icons/iconProfile/iconFaceIdProfile';
import {SvgXml} from 'react-native-svg';

const ProfileScreen = ({navigation}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(
    'https://via.placeholder.com/150',
  );
  const [profileName, setProfileName] = useState('Johnny Bá Khánh');
  const [profilePhone, setProfilePhone] = useState('(084) 378-332-809');

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
          console.log('out');
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
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image source={{uri: profileImage}} style={styles.profileImage} />
          <View style={styles.profileContent}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={styles.profileName}>{profileName}</Text>

              <TouchableOpacity
                style={{marginLeft: 40, alignContent: 'flex-end'}}
                onPress={toggleModal}>
                <SvgXml style={{color: 'black'}} xml={iconEditProfile()} />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileInfo}>{profilePhone}</Text>
            <Text style={styles.profileInfo}>khanhngphq051@example.com</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('TicketScreen');
          }}>
          <SvgXml style={{color: 'black'}} xml={iconMyTicketProfile()} />

          <Text style={styles.menuText}>Vé của tôi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate('ChangePassScreen');
          }}>
          <SvgXml style={{color: 'black'}} xml={iconChangePassProfile()} />

          <Text style={styles.menuText}>Đổi mật khẩu</Text>
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <SvgXml style={{color: 'black'}} xml={iconFaceIdProfile()} />

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
                source={{uri: profileImage}}
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
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.logoutText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
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
});

export default ProfileScreen;
