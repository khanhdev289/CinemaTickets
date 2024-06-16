import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import iconsBack from '../../assets/icons/iconsBack';

const CELL_COUNT = 6;

const ConfirmOTP = () => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [timeLeft, setTimeLeft] = useState(60); // Initialize countdown timer to 60 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000); // Update time every second

    // Clear timeout when component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft]);

  // Format the time into "00:00" format
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
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
        onChangeText={setValue}
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
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
    </SafeAreaView>
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
});
