import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconSs from '../../assets/icons/iconSs';

import {useNavigation, CommonActions} from '@react-navigation/native';

const SuccessScreen = ({route}) => {
  const navigation = useNavigation();
  const movieId = route.params?.movieId || '';

  console.log('id mv ss:', movieId);

  const handleLogin = () => {
    if (movieId) {
      navigation.navigate('Login', {movieId: movieId});
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [{name: 'Home'}, {name: 'Welcome'}, {name: 'Login'}],
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainer}>
        <View style={styles.icon}>
          <SvgXml style={styles.back} xml={iconSs()} />
        </View>
        <Text style={styles.successText}>
          Chúc mừng bạn đã đăng ký thành công !
        </Text>
        <Text style={styles.infoText}>
          Hãy tới màn hình đăng nhập và tìm kiếm bộ phim mà bạn yêu thích !
        </Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Đi tới màn hình đăng nhập</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  mainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '5%',
  },
  icon: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
    marginHorizontal: '5%',
  },

  buttonContainer: {
    marginHorizontal: '5%',
    margin: '2%',
  },
  button: {
    backgroundColor: '#FCC434',
    borderRadius: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FCC434',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  },
});

export default SuccessScreen;
