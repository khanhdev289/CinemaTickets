import React, {useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconBack from '../../assets/icons/iconBack';
import iconClock from '../../assets/icons/iconClock';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import iconLocation from '../../assets/icons/iconLocation';
import {useAuth} from '../../components/AuthProvider ';

const POSTS_API_URL = 'http://139.180.132.97:3000/tickets/user';
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';

const ListTicketScreen = () => {
  const navigation = useNavigation();

  const [ticketData, setTicketData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

      const url = `${POSTS_API_URL}/${userID}`;
      const response = await axiosInstance.get(url);

      const userData = response.data;
      // Lưu dữ liệu từ API vào state
      setTicketData(
        userData.getTicket.map(item => ({
          ...item,
          // Lấy ngày từ phần date và chỉ lấy phần đầu tiên (ngày)
          date: item.showdate.date.split('T')[0],
        })),
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu: ', error);
      setIsLoading(false);
    }
  };

  const navigateToTicketDetail = _id => {
    navigation.navigate('TicketScreen', {_id});
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
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
            onPress={() => navigateToTicketDetail(item._id)}>
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
});
