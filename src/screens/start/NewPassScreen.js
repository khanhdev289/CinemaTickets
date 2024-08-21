import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation, useRoute} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const NEW_PASSWORD_API_URL =
  'http://139.180.132.97:3000/users/forgot-passowrd/?password=';

const NewPassScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {token} = route.params;
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = async data => {
    setLoading(true);
    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const url = `${NEW_PASSWORD_API_URL}${data.newPassword}`;
    axiosInstance
      .put(url, {
        params: {
          password: data.newPassword,
        },
      })
      .then(response => {
        setLoading(false);
        Alert.alert(
          'Thành công',
          'Mật khẩu của bạn đã được thay đổi thành công.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      })
      .catch(error => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập Mật khẩu mới',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập Mật khẩu mới"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="newPassword"
              />
              {errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword.message}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nhập lại mật khẩu</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập lại Mật khẩu',
                  validate: value =>
                    value === watch('newPassword') || 'Mật khẩu không khớp',
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập lại Mật khẩu"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <Text style={styles.error}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Hoàn Thành</Text>
            </View>
          </TouchableOpacity>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default NewPassScreen;

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
    marginBottom: 10,
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
  inputGroup: {
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
    fontSize: 20,
    color: '#000000',
  },
  error: {
    marginTop: '3%',
    color: 'red',
    fontSize: 14,
  },
});
