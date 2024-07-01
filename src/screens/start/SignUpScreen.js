import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-modern-datepicker';
import {useForm, Controller} from 'react-hook-form';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [selectedGender, setSelectedGender] = useState('Chọn giới tính');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = data => {
    console.log(data); // Handle form submission here
    navigation.navigate('Otp'); // Navigate to OTP screen after successful submission
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const genderOptions = ['Nam', 'Nữ', 'Khác'];

  const handleOptionSelect = (index, value) => {
    setSelectedGender(value);
  };
  const handleDateChange = date => {
    setBirthDate(date);
    setShowDatePicker(false);
  };

  return (
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
              render={({field}) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Nhập Tên tài khoản"
                  placeholderTextColor="#FFFFFF"
                  onChangeText={text => {
                    setUsername(text);
                    field.onChange(text);
                  }}
                />
              )}
              name="username"
              rules={{required: 'Bạn cần nhập tên tài khoản'}}
              defaultValue=""
            />
            {errors.username && (
              <Text style={styles.texterr}>{errors.username.message}</Text>
            )}
          </View>

          <View style={styles.inputRegister}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              render={({field}) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Nhập Email"
                  placeholderTextColor="#FFFFFF"
                  onChangeText={text => {
                    setEmail(text);
                    field.onChange(text);
                  }}
                />
              )}
              name="email"
              rules={{
                required: 'Email không hợp lệ',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Email không hợp lệ',
                },
              }}
              defaultValue=""
            />
            {errors.email && (
              <Text style={styles.texterr}>{errors.email.message}</Text>
            )}
          </View>

          <View style={styles.inputRegister}>
            <Text style={styles.label}>Số điện thoại</Text>
            <Controller
              control={control}
              render={({field}) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#FFFFFF"
                  onChangeText={text => {
                    setPhone(text);
                    field.onChange(text);
                  }}
                />
              )}
              name="phone"
              rules={{required: 'Bạn cần nhập số điện thoại'}}
              defaultValue=""
            />
            {errors.phone && (
              <Text style={styles.texterr}>{errors.phone.message}</Text>
            )}
          </View>

          <View style={styles.inputRegister}>
            <Text style={styles.label}>Mật Khẩu</Text>
            <Controller
              control={control}
              render={({field}) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Nhập Mật khẩu"
                  placeholderTextColor="#FFFFFF"
                  secureTextEntry
                  onChangeText={text => {
                    setPassword(text);
                    field.onChange(text);
                  }}
                />
              )}
              name="password"
              rules={{
                required: 'Mật khẩu cần ít nhất 6 ký tự',
                minLength: {value: 6, message: 'Mật khẩu cần ít nhất 6 ký tự'},
              }}
              defaultValue=""
            />
            {errors.password && (
              <Text style={styles.texterr}>{errors.password.message}</Text>
            )}
          </View>

          <View style={styles.inputRegister}>
            <Text style={styles.label}>Ngày tháng năm sinh</Text>
            <Controller
              control={control}
              render={({field}) => (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(!showDatePicker)}
                  style={styles.input}>
                  <Text style={{color: '#FFFFFF'}}>
                    {birthDate || 'Chọn ngày tháng năm sinh'}
                  </Text>
                </TouchableOpacity>
              )}
              name="birthDate"
              rules={{required: 'Bạn cần chọn ngày tháng năm sinh'}}
              defaultValue=""
            />
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DatePicker
                  mode="calendar"
                  onDateChange={handleDateChange}
                  options={{
                    backgroundColor: '#FFFFFF',
                    textHeaderColor: '#000000',
                    textDefaultColor: '#000000',
                    selectedTextColor: '#000000',
                    mainColor: '#D9D9D9',
                    textSecondaryColor: '#D9D9D9',
                  }}
                  style={styles.datePicker}
                />
              </View>
            )}
            {errors.birthDate && (
              <Text style={styles.texterr}>{errors.birthDate.message}</Text>
            )}
          </View>

          <View style={styles.inputRegister}>
            <Text style={styles.label}>Giới tính</Text>
            <Controller
              control={control}
              render={({field}) => (
                <ModalDropdown
                  options={genderOptions}
                  onSelect={(index, value) => {
                    setSelectedGender(value);
                    field.onChange(value);
                  }}
                  defaultValue={selectedGender}
                  textStyle={styles.dropdownText}
                  dropdownStyle={styles.dropdownStyle}
                  saveScrollPosition={false}
                />
              )}
              name="selectedGender"
              rules={{required: 'Bạn cần chọn giới tính'}}
              defaultValue=""
            />
            {errors.selectedGender && (
              <Text style={styles.texterr}>
                {errors.selectedGender.message}
              </Text>
            )}
          </View>

          <View style={styles.checkBoxContainer}>
            <CheckBox
              value={isChecked}
              onValueChange={() => setIsChecked(!isChecked)}
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
      </SafeAreaView>
    </ScrollView>
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
    height: '80%', // Adjust the width
    alignSelf: 'center',
  },
  texterr: {
    marginTop: '2%',
    color: 'red',
    fontSize: 14,
  },
});
