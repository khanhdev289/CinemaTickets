import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {SvgXml} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

import iconCalendarBlack from '../../assets/icons/iconMyTicket/iconCalendarBlack';
import iconSetMyTicket from '../../assets/icons/iconMyTicket/iconSetMyTicket';
import iconClockMyTicket from '../../assets/icons/iconMyTicket/iconClockMyTicket';
import iconMovieMyTicket from '../../assets/icons/iconMyTicket/iconMovieMyTicket';
import iconMoneyMyTicket from '../../assets/icons/iconMyTicket/iconMoneyMyTicket';
import iconLocationMyTicket from '../../assets/icons/iconMyTicket/iconLocationMyTicket';
import iconNoteMyTicket from '../../assets/icons/iconMyTicket/iconNoteMyTicket';

import {useRoute} from '@react-navigation/native';
import {useAuth} from '../../components/AuthProvider ';

const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const POSTS_API_URL = 'http://139.180.132.97:3000/tickets';

const MyTicketScreenFood = () => {
  const route = useRoute();
  const [ticketData, setTicketData] = useState(null);
  const {user} = useAuth();

  useEffect(() => {
    if (route.params && route.params._id) {
      fetchTicketData(route.params._id);
    }
  }, [route.params]);

  const fetchTicketData = async ticketId => {
    try {
      const token = user.token.access_token;
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const url = `${POSTS_API_URL}/${ticketId}`;
      const response = await axiosInstance.get(url);
      const data = response.data.getTicket;
      setTicketData({
        ...data,
        showdate: {
          ...data.showdate,
          date: data.showdate.date.split('T')[0],
        },
      });
    } catch (error) {
      console.error('Error fetching ticket data: ', error);
    }
  };

  if (!ticketData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.ticketContainer}>
          <Text style={styles.movieTitle}>{ticketData.name}</Text>
          <View style={styles.foodItem1}>
            <Text style={styles.foodName}>Tên</Text>
            <Text style={styles.foodQuantity}>Số lượng</Text>
            <Text style={styles.foodPrice}>Đơn giá</Text>
          </View>
          <FlatList
            data={ticketData.food}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.foodItem}>
                <Text style={styles.foodName}>{item.foodId.name}</Text>
                <Text style={styles.foodQuantity}>x{item.quantity}</Text>
                <Text style={styles.foodPrice}>{item.foodId.price} VND</Text>
              </View>
            )}
          />

          <View style={styles.line} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml xml={iconMoneyMyTicket()} />
              <Text style={styles.priceText}>{ticketData.total_food} VND</Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml xml={iconLocationMyTicket()} />
              <Text style={styles.locationText}>
                {ticketData.cinema.address}
              </Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml xml={iconNoteMyTicket()} />
              <Text style={styles.instructionText}>
                Vui lòng đưa mã QR cho nhân viên để kiểm tra vé.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
  },
  ticketContainer: {
    marginTop: 50,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  movieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  moviePoster: {
    width: 130,
    height: 200,
    borderRadius: 10,
  },
  movieDetailsContainer: {
    marginLeft: 10,
    flex: 1,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsContainerAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  movieDetails: {
    fontSize: 14,
    color: 'black',
    marginLeft: 5,
  },
  timeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  locationContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  rapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  seatText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    marginLeft: 10,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
    marginLeft: 10,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    alignItems: 'center',
  },
  foodName: {
    width: '30%',
    flexDirection: 'row',
    textAlign: 'center',
    marginVertical: 10,
  },
  foodQuantity: {
    width: '30%',
    flexDirection: 'row',
    textAlign: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  foodPrice: {
    width: '30%',
    flexDirection: 'row',
    marginVertical: 10,
    textAlign: 'center',
  },

  foodItem1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
  },
});

export default MyTicketScreenFood;
