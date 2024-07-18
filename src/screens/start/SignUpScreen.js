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
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import {useForm, Controller} from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalSelector from 'react-native-modal-selector';

const POSTS_API_URL = 'http://139.180.132.97:3000/auth/register';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    if (!termsAccepted) {
      alert('Bạn phải chấp nhận các điều khoản và điều kiện');
      return;
    }

    const formattedData = {
      ...data,
      date_of_birth: format(new Date(data.date_of_birth), 'dd-MM-yyyy'),
    };

    setLoading(true);

    axios
      .post(POSTS_API_URL, formattedData)
      .then(response => {
        console.log('Success:', response.data);
        const {access_token} = response.data.token;
        const {email} = response.data.user;

        navigation.navigate('Otp', {
          token: access_token,
          email,
          action: 'register',
        });
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
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
            <Text style={styles.title}>Đăng ký</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={styles.inputForm}>
            <View style={styles.inputRegister}>
              <Text style={styles.label}>Tên tài khoản</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập Tên tài khoản',
                  minLength: {
                    value: 6,
                    message: 'Tên tài khoản phải có ít nhất 6 ký tự',
                  },
                  maxLength: {
                    value: 30,
                    message: 'Tên tài khoản không được vượt quá 30 ký tự',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập Tên tài khoản"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
              />
              {errors.name && (
                <Text style={styles.error}>{errors.name.message}</Text>
              )}
            </View>

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
                    placeholder="Nhập Email"
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

            <View style={styles.inputRegister}>
              <Text style={styles.label}>Số điện thoại</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập Số điện thoại',
                  pattern: {
                    value: /^[0-9+-]*$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập Số điện thoại"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                  />
                )}
                name="number_phone"
              />
              {errors.number_phone && (
                <Text style={styles.error}>{errors.number_phone.message}</Text>
              )}
            </View>

            <View style={styles.inputRegister}>
              <Text style={styles.label}>Mật khẩu</Text>
              <Controller
                control={control}
                rules={{
                  required: 'Vui lòng nhập Mật khẩu ',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập Mật khẩu"
                    placeholderTextColor="#FFFFFF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
                name="password"
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </View>

            <View style={styles.inputRegister}>
              <Text style={styles.label}>Ngày tháng năm sinh</Text>
              <Controller
                control={control}
                name="date_of_birth"
                rules={{required: 'Vui lòng chọn ngày tháng năm sinh'}}
                render={({field: {onChange, value}}) => (
                  <>
                    <TouchableOpacity
                      onPress={handleDatePress}
                      style={styles.input}>
                      <Text style={styles.datePickerText}>
                        {value
                          ? format(new Date(value), 'dd-MM-yyyy')
                          : 'Chọn ngày tháng năm sinh'}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            onChange(selectedDate.toISOString());
                          }
                        }}
                      />
                    )}
                  </>
                )}
              />
              {errors.date_of_birth && (
                <Text style={styles.error}>{errors.date_of_birth.message}</Text>
              )}
            </View>

            <View style={styles.inputRegister}>
              <Text style={styles.label}>Giới tính</Text>
              <Controller
                control={control}
                name="gender"
                defaultValue=""
                render={({field: {onChange, value}}) => (
                  <ModalSelector
                    data={[
                      {key: 1, label: 'Nam', value: 'Nam'},
                      {key: 2, label: 'Nữ', value: 'Nữ'},
                    ]}
                    initValue={value ? value : 'Chọn Giới Tính'}
                    onChange={option => {
                      setValue('gender', option.value);
                      onChange(option.value);
                    }}
                    style={styles.pickerContainer}
                    cancelText="Huỷ"
                    optionTextStyle={styles.optionText}
                    optionContainerStyle={styles.optionContainer}
                    cancelStyle={styles.cancelButton}
                  />
                )}
                rules={{required: 'Vui lòng chọn giới tính'}}
              />
              {errors.gender && (
                <Text style={styles.error}>{errors.gender.message}</Text>
              )}
            </View>

            <View style={styles.checkBoxContainer}>
              <CheckBox
                value={termsAccepted}
                onValueChange={setTermsAccepted}
                style={styles.checkBox}
                tintColors={{true: '#FFFFFF', false: '#FFFFFF'}}
                boxType="circle"
              />
              <Text style={[styles.checkBoxText, {color: '#FF9C00'}]}>
                Chấp nhận các quyền riêng tư
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit(onSubmit)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Hoàn thành</Text>
            </View>
          </TouchableOpacity>
          <Spinner visible={loading} color="#FCC434" />
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

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
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  },

  checkBox: {
    marginRight: 10,
  },
  checkBoxText: {
    color: '#FFFFFF',
  },

  dropdownText: {
    fontSize: 14,
    color: '#FFFFFF',
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    width: '100%',
  },
  dropdownStyle: {
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#FCC434',
    borderRadius: 10,
    width: '75%',
    height: '150',
    alignSelf: 'center',
    position: 'absolute',
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  datePicker: {
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    height: '80%',
    alignSelf: 'center',
  },
  error: {
    marginTop: '3%',
    color: 'red',
    fontSize: 14,
  },
  datePickerText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 10,
  },
  optionContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
  cancelButton: {
    backgroundColor: '#FCC434',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
