import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TextInput,
  RefreshControl,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconClock from '../../assets/icons/iconClock';
import iconLocation from '../../assets/icons/iconLocation';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

import iconHome from '../../assets/icons/iconHome';
import iconUser from '../../assets/icons/iconUser';
import {useAuth} from '../../components/AuthProvider ';

const POSTS_API_URL = 'http://139.180.132.97:3000/tickets/staff/';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';

const ListCheckTicket = () => {
  const navigation = useNavigation();

  const [ticketData, setTicketData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {user} = useAuth();

  useEffect(() => {
    fetchDataUser();
  }, []);

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

      const url = `${POSTS_API_URL}${userID}`;
      const response = await axiosInstance.get(url);

      const userData = response.data;
      setTicketData(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu: ', error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchDataUser();
    setIsRefreshing(false);
  };

  const formatDateTime = dateString => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const renderItem = ({item}) => {
    const showDate = item.showdate.date.split('T')[0]; // Cắt chuỗi để lấy ngày
    const seatNames = item.seat.map(seat => seat.name).join(', ');

    return (
      <TouchableOpacity key={item._id} style={styles.ticketContainer}>
        <Image
          source={{uri: IMAGE_API_URL + item.movie.image}}
          style={styles.ticketImage}
        />
        <View style={styles.ticketDetails}>
          <Text style={styles.ticketTitle}>{item.movie.name}</Text>
          <Text style={styles.ticketLocation}>
            <SvgXml xml={iconUser()} width={14} height={14} /> {item.user.name}
          </Text>
          <Text style={styles.ticketTime}>
            <SvgXml xml={iconHome()} width={14} height={14} /> {seatNames} *{' '}
            {item.room.name} * {item.cinema.name}
          </Text>
          <Text style={styles.ticketTime}>
            <SvgXml xml={iconClock()} width={14} height={14} /> {item.time.time}{' '}
            * {showDate}
          </Text>
          <Text style={styles.ticketLocation}>
            <SvgXml xml={iconLocation()} width={14} height={14} />{' '}
            {formatDateTime(item.time_check)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredData = ticketData.filter(item =>
    item.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading && !isRefreshing) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      {isLoading && !isRefreshing && (
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
          <Text style={styles.headerTitle}>Lịch sử quét</Text>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm theo tên người dùng"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#f7b731']}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ListCheckTicket;

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
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#1C1C1C',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  ticketContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    marginVertical: 8,
    overflow: 'hidden',
  },
  ticketImage: {
    width: 80,
    height: 120,
  },
  ticketDetails: {
    flex: 1,
    padding: 10,
  },
  ticketTitle: {
    fontSize: 16,
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
});
