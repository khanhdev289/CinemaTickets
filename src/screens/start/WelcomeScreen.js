import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import SwiperFlatList from 'react-native-swiper-flatlist';
import iconLanguage from '../../assets/icons/iconLanguage';
import {useNavigation} from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleTest = () => {
    Alert.alert(
      'Ngôn ngữ',
      'chỉ vn thôi !',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: true},
    );
  };

  const handleRegistwer = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.imagelogo}
          source={require('../../assets/images/logo.png')}
        />
        <TouchableOpacity style={styles.buttonLg} onPress={handleTest}>
          <SvgXml style={styles.icon} xml={iconLanguage()} />
          <Text style={styles.buttonTextLg}>Vietnamese</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.slideshow}>
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={0}
          showPagination
          paginationActiveColor="#FCC434"
          paginationDefaultColor="#686868"
          paginationStyle={{width: 8, height: 8, borderRadius: 4}}
          data={[
            {image: require('../../assets/images/anh1.png')},
            {image: require('../../assets/images/a2.jpg')},
            {image: require('../../assets/images/bgLogin.png')},
          ]}
          renderItem={({item}) => (
            <Image style={styles.imageSlide} source={item.image} />
          )}
        />
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>MDCinema Xin Chào!</Text>
          <Text style={styles.enjoyText}>
            Tận hưởng những bộ phim yêu thích
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.buttonContainerSignIn}
        onPress={handleLogin}>
        <View style={styles.buttonSignIn}>
          <Text style={styles.buttonTextSignIn}>Đăng nhập</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainerSignUp}
        onPress={handleRegistwer}>
        <View style={styles.buttonSignUp}>
          <Text style={styles.buttonTextSignUp}>Đăng ký</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.termsText}>
        Bằng cách đăng nhập hoặc đăng ký, bạn đồng ý với Điều khoản dịch vụ của
        chúng tôi và Chính sách quyền riêng tư
      </Text>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imagelogo: {
    width: 150,
    height: 50,
  },
  spacer: {
    flex: 1,
  },
  buttonLg: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    borderRadius: 71,
  },
  icon: {
    marginRight: 5,
  },
  buttonTextLg: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  buttonContainerSignIn: {
    marginHorizontal: '2%',
    margin: '2%',
    marginTop: '5%',
  },
  buttonContainerSignUp: {
    marginHorizontal: '2%',
    margin: '2%',
  },

  buttonSignIn: {
    backgroundColor: '#FCC434',
    borderRadius: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FCC434',
    alignItems: 'center',
  },
  buttonTextSignIn: {
    color: '#000000',
    fontSize: 20,
  },

  buttonSignUp: {
    backgroundColor: '#000000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonTextSignUp: {
    color: '#F2F2F2',
    fontSize: 20,
  },

  slideshow: {
    marginTop: 30,
    flex: 1,
  },
  imageSlide: {
    width: 400,
    height: 329,
    resizeMode: 'contain',
  },
  termsText: {
    fontSize: 12,
    color: '#B3B3B3',
    textAlign: 'center',
    marginTop: '5%',
    margin: '2%',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '5%',
    color: '#F2F2F2',
  },
  enjoyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F2F2F2',
  },
  welcome: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 50,
  },
});
