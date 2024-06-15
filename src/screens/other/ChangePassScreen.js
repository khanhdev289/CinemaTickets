import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import CheckBox from '@react-native-community/checkbox';

import {useNavigation} from '@react-navigation/native';

const ChangePassScreen = () => {
  const navigation = useNavigation();


  const handleOtp = () => {
    navigation.navigate('Otp');
  };

  const handleBack = () => {

    navigation.goBack();
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleBack}>
            <SvgXml style={styles.back} xml={iconsBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Đổi mật khẩu</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.inputForm}>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor="grey"
            secureTextEntry
          />
        </View>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="grey"
            secureTextEntry
          />
        </View>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="grey"
            secureTextEntry
          />
        </View>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleOtp}>
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
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonContainer: {
    marginHorizontal: '10%',
    margin: '5%',
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
    fontFamily: 'bold',
  },
});

export default ChangePassScreen;
