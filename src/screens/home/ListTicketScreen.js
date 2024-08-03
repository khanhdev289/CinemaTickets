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
  const [total, setTotal] = useState(0); // Ensure this is initialized to 0
  const [isLoading, setIsLoading] = useState(false);
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
            // Lấy ngày từ phần date và chỉ lấy phần đầu tiên (ngày)
            date: item.showdate.date.split('T')[0],
          }))
          .reverse(),
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu: ', error);
      setIsLoading(false);
    }
  };

  const handlePressTicket = item => {
    if (item.status === 'active') {
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
              subscribe(item._id, item.total); // Truyền thêm giá trị total vào hàm subscribe
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
          amount: total, // Sử dụng giá trị total từ item
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Đảm bảo đúng loại dữ liệu gửi đi
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
        {ticketData.map(item => (
          <TouchableOpacity
            key={item._id}
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
                  item.status === 'active'
                    ? styles.activeStatus
                    : styles.inactiveStatus,
                ]}>
                <Text
                  style={[
                    styles.statusProfileInfo,
                    item.status === 'active'
                      ? styles.activeText
                      : styles.inactiveText,
                  ]}>
                  {item.status === 'active'
                    ? 'Đã thanh toán'
                    : 'Chưa thanh toán'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ListTicketScreen;

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
    borderWidth: 2,
    padding: 3,
    marginTop: 5,
    borderRadius: 10,
    width: 170,
    marginTop: 20,
  },
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  ticketImage: {
    width: 100,
    height: 150,
  },
  ticketDetails: {
    flex: 1,
    padding: 10,
    marginVertical: 10,
  },
  ticketTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  ticketTime: {
    fontSize: 14,
    color: 'white',
    marginVertical: 4,
  },
  ticketLocation: {
    fontSize: 14,
    color: 'white',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  statusProfileInfo: {
    color: '#f7b731',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStatus: {
    borderColor: 'green',
  },
  inactiveStatus: {
    borderColor: 'red',
  },
  activeText: {
    color: 'green',
  },
  inactiveText: {
    color: 'red',
  },
});
