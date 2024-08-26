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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // State to manage filter status
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
    // Filter data based on search query and filter status
    let filtered = ticketData.filter(ticket =>
      ticket.movie.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (filterStatus === 'paid') {
      filtered = filtered.filter(
        ticket => ticket.status === 'active' || ticket.status === 'complete',
      );
    } else if (filterStatus === 'unpaid') {
      filtered = filtered.filter(
        ticket => ticket.status !== 'active' && ticket.status !== 'complete',
      );
    }

    setFilteredData(filtered);
  }, [searchQuery, ticketData, filterStatus]);

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
      console.log(userData);

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
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('all')}>
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'all' && styles.activeFilterText,
              ]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'paid' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('paid')}>
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'paid' && styles.activeFilterText,
              ]}>
              Đã thanh toán
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'unpaid' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('unpaid')}>
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'unpaid' && styles.activeFilterText,
              ]}>
              Chưa thanh toán
            </Text>
          </TouchableOpacity>
        </View>

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
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    marginHorizontal: 5,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#C4C4C4',
  },
  activeFilter: {
    backgroundColor: '#f7b731',
  },
  activeFilterText: {
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 16,
  },
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  ticketImage: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  ticketDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  ticketTime: {
    color: '#C4C4C4',
    marginVertical: 4,
  },
  ticketLocation: {
    color: '#C4C4C4',
    marginVertical: 4,
  },
  statusView: {
    marginTop: 8,
    padding: 4,
    borderRadius: 4,
    width: 100,
  },
  activeStatus: {
    backgroundColor: '#4CAF50',
  },
  inactiveStatus: {
    backgroundColor: '#F44336',
  },
  statusProfileInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListTicketScreen;
