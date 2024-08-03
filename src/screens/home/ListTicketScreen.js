import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconBack from '../../assets/icons/iconBack';
import iconClock from '../../assets/icons/iconClock';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import iconLocation from '../../assets/icons/iconLocation';
import {useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import {useAuth} from '../../components/AuthProvider ';

const POSTS_API_URL = 'http://139.180.132.97:3000/tickets/user/user';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const PAY_API_URL1 = 'http://139.180.132.97:3000/tickets/status';
const PAY_API_URL = 'http://139.180.132.97:3000/tickets/payment';

const ListTicketScreen = () => {
  const stripe = useStripe();
  const navigation = useNavigation();

  const [ticketData, setTicketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
  const {user} = useAuth();

  useEffect(() => {
    fetchDataUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDataUser();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Filter data based on search query
    const filtered = ticketData.filter(ticket =>
      ticket.movie.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  }, [searchQuery, ticketData]);

  const fetchDataUser = async () => {
    try {
      setIsLoading(true);

      const userID = user.user._id;
      const token = user.token.access_token;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = `${POSTS_API_URL}/${userID}`;
      const response = await axiosInstance.get(url);

      const userData = response.data;
      // Lưu dữ liệu từ API vào state
      setTicketData(
        userData.getTicket
          .map(item => ({
            ...item,
            date: item.showdate.date.split('T')[0],
          }))
          .reverse(),
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlePressTicket = item => {
    if (item.status === 'active' || item.status === 'complete') {
      navigation.navigate('TicketScreen', {_id: item._id});
    } else {
      Alert.alert(
        'Thông báo',
        'Vé chưa được thanh toán, bạn có muốn thanh toán không?',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('Đăng xuất bị hủy'),
            style: 'cancel',
          },
          {
            text: 'Có',
            onPress: () => {
              subscribe(item._id, item.total);
            },
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    }
  };

  const subscribe = async (ticketId, total) => {
    try {
      const token = user.token.access_token;

      const response = await axios.post(
        `${PAY_API_URL}/${ticketId}`,
        {
          name: 'khanh',
          amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(response.data);
      const clientSecret = response.data;

      const {error: initError} = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        googlePay: true,
        merchantDisplayName: 'MD-Cinema',
      });

      if (initError) {
        console.error(initError);
        return Alert.alert('Lỗi', initError.message);
      }

      const {error: presentError} = await stripe.presentPaymentSheet({
        clientSecret,
      });

      if (presentError) {
        console.error(presentError);
        return Alert.alert('Lỗi', presentError.message);
      }

      Alert.alert('Thanh toán thành công, cảm ơn bạn!');
      paymentSuccess(ticketId);
    } catch (err) {
      console.error(err);
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };

  const paymentSuccess = async ticketId => {
    try {
      const token = user.token.access_token;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = `${PAY_API_URL1}/${ticketId}`;
      const response = await axiosInstance.put(url);

      const data = response.data;
      console.log(data);
      navigation.navigate('TicketScreen', {_id: ticketId});
    } catch (error) {
      console.error('Lỗi khi thanh toán: ', error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Vui lòng đăng nhập</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.ticketContainer}
      onPress={() => handlePressTicket(item)}>
      <Image
        source={{uri: IMAGE_API_URL + item.movie.image}}
        style={styles.ticketImage}
      />
      <View style={styles.ticketDetails}>
        <Text style={styles.ticketTitle}>{item.movie.name}</Text>
        <Text style={styles.ticketTime}>
          <SvgXml xml={iconClock()} width={14} height={14} />{' '}
          {item.movie.duration} * {item.date}
        </Text>
        <Text style={styles.ticketLocation}>
          <SvgXml xml={iconLocation()} width={14} height={14} />{' '}
          {item.cinema.name}
        </Text>
        <View
          style={[
            styles.statusView,
            item.status === 'active' || item.status === 'complete'
              ? styles.activeStatus
              : styles.inactiveStatus,
          ]}>
          <Text
            style={[
              styles.statusProfileInfo,
              item.status === 'active' || item.status === 'complete'
                ? styles.activeText
                : styles.inactiveText,
            ]}>
            {item.status === 'active' || item.status === 'complete'
              ? 'Đã thanh toán'
              : 'Chưa thanh toán'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f7b731" />
        </View>
      )}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000"
        hidden={false}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tất cả vé</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên phim"
          placeholderTextColor="#C4C4C4"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <FlatList
          data={filteredData.reverse()}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{paddingBottom: 20}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  statusView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f7b731',
    width: 120,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  activeStatus: {
    backgroundColor: '#1e1e1e',
  },
  inactiveStatus: {
    backgroundColor: '#4d4d4d',
  },
  statusProfileInfo: {
    fontSize: 12,
    color: 'white',
  },
  activeText: {
    color: '#f7b731',
  },
  inactiveText: {
    color: '#ffffff',
  },
  searchInput: {
    height: 40,
    borderColor: '#C4C4C4',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 16,
    paddingHorizontal: 10,
    color: 'white',
  },
  ticketContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 8,
  },
  ticketImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  ticketDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  ticketTime: {
    fontSize: 14,
    color: '#C4C4C4',
    marginBottom: 4,
  },
  ticketLocation: {
    fontSize: 14,
    color: '#C4C4C4',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListTicketScreen;
