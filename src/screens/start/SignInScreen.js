import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const SignInScreen = () => {
  const navigation = useNavigation();

  const handleHome = () => {
    navigation.navigate('Home');
  };
  return (
    <ImageBackground
      source={require('../../assets/images/bgLogin.png')}
      style={styles.background}>
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
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
            />
          </View>
          <View style={styles.inputPass}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập Mật Khẩu"
              placeholderTextColor="#FFFFFF"
              secureTextEntry
            />
          </View>
        </View>
        <View style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu ?</Text>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleHome}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative', // Đặt vị trí của container là tương đối
  },
  background: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Làm cho View này chiếm toàn bộ không gian của ImageBackground
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu đen với độ trong suốt 40%
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
    color: '#FFFFFF', // Đặt màu văn bản là trắng
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
    paddingVertical: 15, // Đặt khoảng cách dọc giữa các yếu tố của nút
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  },
});
