import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import axios from 'axios'; // Import axios
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../components/AuthProvider ';
import HeaderComponent from '../../components/HeaderComponent';

const CHANGE_PASS_API_URL = 'http://139.180.132.97:3000/users/password';

const ChangePassScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {user} = useAuth();

  const updateUserPassData = async () => {
    try {
      if (currentPassword.trim() === '') {
        Alert.alert('Vui lòng nhập mật khẩu hiện tại');
        return;
      }

      if (newPassword.length < 6 || newPassword.length > 30) {
        Alert.alert('Mật khẩu mới phải có ít nhất 6 kí tự và tối đa 30 kí tự');
        return;
      }
      if (newPassword.trim() === '') {
        Alert.alert('Mật khẩu mới phải không được để trống');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Mật khẩu mới và nhập lại mật khẩu mới không khớp');
        return;
      }

      const userID = user.user._id;
      const token = user.token.access_token;

      const requestData = {
        passwordOld: currentPassword,
        passwordNew: newPassword,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const url = `${CHANGE_PASS_API_URL}/${userID}`;
      const response = await axios.put(url, requestData, config);

      Alert.alert(response.data);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Lỗi khi cập nhật mật khẩu người dùng: ', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Đổi mật khẩu" navigation={navigation} />
      <View style={styles.inputForm}>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor="grey"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="grey"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="grey"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={updateUserPassData}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: '10%',
  },
  backContainer: {
    position: 'absolute',
    left: 5,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  inputForm: {
    marginStart: '10%',
    marginEnd: '10%',
  },
  inputRegister: {
    marginBottom: '8%',
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
  buttonContainer: {
    marginHorizontal: '10%',
    margin: '5%',
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
    fontFamily: 'bold',
  },
});

export default ChangePassScreen;
