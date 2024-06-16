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
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-modern-datepicker';

const SignUpScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  const [selectedGender, setSelectedGender] = useState('Chọn giới tính');

  const [birthDate, setBirthDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleOtp = () => {
    navigation.navigate('Otp');
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
          <TextInput
            style={styles.input}
            placeholder="Nhập Tên tài khoản"
            placeholderTextColor="#FFFFFF"
          />
        </View>

        <View style={styles.inputRegister}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập Email"
            placeholderTextColor="#FFFFFF"
          />
        </View>

        <View style={styles.inputRegister}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#FFFFFF"
          />
        </View>

        <View style={styles.inputRegister}>
          <Text style={styles.label}>Mật Khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập Mật Khẩu"
            placeholderTextColor="#FFFFFF"
            secureTextEntry
          />
        </View>

        <View style={styles.inputRegister}>
          <Text style={styles.label}>Ngày tháng năm sinh</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(!showDatePicker)}
            style={styles.input}>
            <Text style={{color: '#FFFFFF'}}>
              {birthDate || 'Chọn ngày tháng năm sinh'}
            </Text>
          </TouchableOpacity>
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
        </View>
        <View style={styles.inputRegister}>
          <Text style={styles.label}>Giới tính</Text>
          <ModalDropdown
            options={genderOptions}
            onSelect={handleOptionSelect}
            defaultValue={selectedGender}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            saveScrollPosition={false}
          />
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
      <TouchableOpacity style={styles.buttonContainer} onPress={handleOtp}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Hoàn thành</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
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
  },
  datePickerContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  datePicker: {
    borderRadius: 10,
    marginTop: 10,
  },
});
