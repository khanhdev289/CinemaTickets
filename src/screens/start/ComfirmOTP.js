import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {SvgXml} from 'react-native-svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {format} from 'date-fns';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import iconsBack from '../../assets/icons/iconsBack';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const CELL_COUNT = 6;
const PUT_API_URL = 'http://139.180.132.97:3000/auth/register/verify';

const ConfirmOTP = () => {
  const route = useRoute();
  const {token, email} = route.params;

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [timeLeft, setTimeLeft] = useState(60);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      navigation.goBack();
    }
  }, [timeLeft, navigation]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return format(new Date(0, 0, 0, 0, minutes, seconds), 'mm:ss');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const onOtpChange = enteredValue => {
    const filteredValue = enteredValue.replace(/[^\d]/g, '');
    setValue(filteredValue);
    if (enteredValue.length === CELL_COUNT) {
      fetchOtp(enteredValue);
    }
  };

  const fetchOtp = async code => {
    try {
      setIsLoading(true);

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.put(PUT_API_URL, {
        email: email,
        code: code,
      });
      setIsLoading(false);

      if (response.status === 200) {
        navigation.navigate('Ss');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Lỗi',
          textBody: 'Mã OTP không đúng. Vui lòng kiểm tra và nhập lại.',
          button: 'Thử lại',
        });
        setValue('');
      } else {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Lỗi',
          textBody: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
          button: 'Đóng',
        });
        setValue('');
      }
      console.error('Fetch OTP Error:', error);
    }
  };

  return (
    <AlertNotificationRoot style={styles.dialog_error}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={handleBack}>
          <SvgXml style={styles.back} xml={iconsBack()} />
        </TouchableOpacity>
        <Text style={styles.titleBig}>Nhập mã OTP</Text>
        <Text style={styles.titleSmall}>
          Bạn hãy nhập mã OTP đã được gửi về số điện thoại mà bạn đã đăng ký.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          autoFocus={true}
          onChangeText={onOtpChange}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.select({
            android: 'sms-otp',
            default: 'one-time-code',
          })}
          testID="my-code-input"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol !== undefined ? symbol : isFocused ? <Cursor /> : ''}
            </Text>
          )}
        />
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Spinner
          visible={isLoading}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default ConfirmOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 5,
  },
  titleBig: {
    fontSize: 32,
    marginTop: '10%',
    marginBottom: '10%',
    color: '#FCC434',
  },
  titleSmall: {
    fontSize: 16,
    marginBottom: 20,
    color: '#F2F2F2',
    marginBottom: '10%',
  },
  cell: {
    width: 52,
    height: 72,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#FCC434',
    backgroundColor: '#261D08',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#F2F2F2',
  },
  focusCell: {
    borderColor: '#F2F2F2',
    backgroundColor: '#5e4915',
  },
  timer: {
    textAlign: 'right',
    color: '#F2F2F2',
    marginTop: 20,
    fontSize: 20,
  },
  back: {
    width: 24,
    height: 24,
    marginTop: 10,
    marginLeft: 10,
    color: '#FCC434',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  error: {
    marginTop: '3%',
    color: 'red',
    fontSize: 14,
  },
  dialog_error: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
