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
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import {useForm, Controller} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import HeaderComponent from '../../components/HeaderComponent';

const FORGOT_PASSWORD_API_URL =
  'http://139.180.132.97:3000/auth/forgot-password?email=';

const ForgotPassScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const onSubmit = async data => {
    setLoading(true);
    const email = data.email;
    const url = `${FORGOT_PASSWORD_API_URL}${email}`;

    axios
      .post(url, data)
      .then(response => {
        const {access_token} = response.data.token;
        const {email} = response.data.user;

        navigation.navigate('Otp', {
          token: access_token,
          email,
          action: 'forgotPassword',
        });
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
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
          <HeaderComponent title="Quên mật khẩu" navigation={navigation} />
          <View style={styles.inputForm}>
            <View style={styles.inputRegister}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập Email',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'Email không hợp lệ',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập Email của bạn"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>
          </View>
          <Text style={styles.text_instruct}>
            Nhập đúng email mà bạn đã đăng ký, mã OTP sẽ được gửi về email mà
            bạn đã đăng ký.
          </Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gửi</Text>
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

export default ForgotPassScreen;

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
    marginStart: '5%',
    marginEnd: '5%',
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
    fontSize: 20,
    color: '#000000',
  },
  error: {
    marginTop: '3%',
    color: 'red',
    fontSize: 14,
  },
  text_instruct: {
    fontSize: 16,
    color: '#F2F2F2',
    marginStart: '5%',
    marginEnd: '5%',
    marginBottom: '3%',
  },
});
