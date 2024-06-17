import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import iconsBack from '../../assets/icons/iconsBack';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import iconCalendarBlack from '../../assets/icons/iconMyTicket/iconCalendarBlack';
import iconSetMyTicket from '../../assets/icons/iconMyTicket/iconSetMyTicket';
import iconClockMyTicket from '../../assets/icons/iconMyTicket/iconClockMyTicket';
import iconMovieMyTicket from '../../assets/icons/iconMyTicket/iconMovieMyTicket';
import iconMoneyMyTicket from '../../assets/icons/iconMyTicket/iconMoneyMyTicket';
import iconLocationMyTicket from '../../assets/icons/iconMyTicket/iconLocationMyTicket';
import iconNoteMyTicket from '../../assets/icons/iconMyTicket/iconNoteMyTicket';
import iconSuccess from '../../assets/icons/iconMyTicket/iconSuccess';

const placeholderImage = require('../../assets/images/image.png');
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const POSTS_API_URL = 'http://139.180.132.97:3000/tickets';

const AuthScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (route.params && route.params.ticketId) {
    //   fetchTicketData(route.params.ticketId);
    // }
    fetchTicketData('66700c16f4605faf50aa72c3');
  }, [route.params]);

  const fetchTicketData = async ticketId => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZmZTllMWYwODQ5YTZhOGE5MDRhNGMiLCJyb2xlIjoidXNlciIsImVtYWlsIjoiZHV5a2hhbmhzdDFAZ21haWwuY29tIiwiaWF0IjoxNzE4NjEwNTUwLCJleHAiOjE3MTkyMTUzNTB9.V3N_5YzfYE5TtSPAlnm8MrK9rSza77ZhjpiAqhjkEQU';

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const url = `${POSTS_API_URL}/${ticketId}`;
      const response = await axiosInstance.get(url);
      const data = response.data.getTicket;
      if (data && data.movie) {
        setTicketData(data);
      } else {
        console.error('Dữ liệu vé không có thuộc tính `movie`');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket data: ', error);
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigation.goBack();
  };
  const handlePrintTicket = () => {
    Alert.alert('Chức năng này cập nhật sau');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleBack}>
            <SvgXml style={styles.back} xml={iconsBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Kiểm tra vé</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        <View style={styles.ticketContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 20,
            }}>
            <Image
              source={{uri: IMAGE_API_URL + ticketData.movie.image}}
              style={styles.moviePoster}
            />

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Text style={styles.movieTitle}>{ticketData.movie.name}</Text>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml style={{color: 'black'}} xml={iconClockMyTicket()} />
                <Text style={styles.movieDetails}>
                  {ticketData.movie.duration}
                </Text>
              </View>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml style={{color: 'black'}} xml={iconMovieMyTicket()} />
                <Text style={styles.movieDetails}>
                  {ticketData.movie.genre}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timeLocationContainer}>
            <SvgXml style={{color: 'black'}} xml={iconCalendarBlack()} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.timeText}>{ticketData.time.time}</Text>
              <Text style={styles.dateText}>
                {new Date(ticketData.showdate.date).toLocaleDateString()}
              </Text>
            </View>
            <SvgXml style={{color: 'black'}} xml={iconSetMyTicket()} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.rapText}>{ticketData.room.name}</Text>
              <Text style={styles.seatText}>
                {ticketData.seat.map(item => item.name).join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.line} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconMoneyMyTicket()} />
              <Text style={styles.priceText}>{ticketData.total} VND</Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconLocationMyTicket()} />
              <Text style={styles.locationText}>
                {ticketData.cinema.name}
                {'\n'}
                {ticketData.cinema.address}
              </Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconNoteMyTicket()} />
              <Text style={styles.instructionText}>
                Xuất trình mã QR này cho quầy vé để nhận vé
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.qrCodeContainer}>
            <SvgXml style={{color: 'black'}} xml={iconSuccess()} />
            <Text style={styles.checkTicketsSuccess}>
              Kiểm tra vé thành công
              {'\n'}
              Nhân viên hướng dẫn khách vào rạp
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.printButton} onPress={handlePrintTicket}>
        <Text style={styles.printText}>Xuất Vé</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: '5%',
  },
  backContainer: {
    position: 'absolute',
    left: 5,
  },
  ticketContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  moviePoster: {
    width: 100,
    height: 170,
    marginBottom: 20,
    borderRadius: 10,
  },
  movieTitle: {
    alignItems: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  movieDetails: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
  },
  timeLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
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
  detailsContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  detailsContainerAndIcon: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
    marginBottom: 20,
  },
  checkTicketsSuccess: {
    marginTop: 20,
    fontSize: 20,
    marginLeft: 10,
    color: 'black',
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
    marginLeft: 10,
  },
  printButton: {
    marginTop: 30,
    backgroundColor: '#f7b731',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  printText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
