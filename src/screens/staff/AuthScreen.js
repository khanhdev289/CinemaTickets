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

import RNPrint from 'react-native-print';
import {useAuth} from '../../components/AuthProvider ';

const placeholderImage = require('../../assets/images/image.png');
const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
const POSTS_API_URL = 'http://139.180.132.97:3000/tickets';

const AuthScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const createPdf = async data => {
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .container {
            max-width: 300px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
          .header, .footer {
            text-align: center;
            margin-bottom: 20px;
          }
          .movie-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
          }
          .movie-details {
            font-size: 16px;
            margin-bottom: 5px;
          }
          .ticket-info {
            margin-top: 20px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .info-item p {
            margin: 0;
          }
          .qr-code {
            text-align: center;
            margin-top: 30px;
          }
          .success-message {
            font-size: 18px;
            font-weight: bold;
            color: green;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VÉ XEM PHIM</h1>
          </div>
          <div class="ticket-info">
            <div class="movie-title">${data.movie.name}</div>
            <div class="info-item">
              <p>Thời lượng:</p>
              <p>${data.movie.duration}</p>
            </div>
            <div class="info-item">
              <p>Thể loại:</p>
              <p>${data.movie.genre.map(item => item.name).join(', ')}</p>
            </div>
            <div class="info-item">
              <p>Thời gian:</p>
              <p>${data.time.time}</p>
            </div>
            <div class="info-item">
              <p>Ngày:</p>
              <p>${new Date(data.showdate.date).toLocaleDateString()}</p>
            </div>
            <div class="info-item">
              <p>Phòng:</p>
              <p>${data.room.name}</p>
            </div>
            <div class="info-item">
              <p>Ghế:</p>
              <p>${data.seat.map(item => item.name).join(', ')}</p>
            </div>
            <div class="info-item">
              <p>Tổng tiền:</p>
              <p>${data.total} VND</p>
            </div>
            <div class="info-item">
              <p>Rạp:</p>
              <p>${data.cinema.name}<br>${data.cinema.address}</p>
            </div>
          </div>
                 <div class="movie-title">----------------------</div>
          <div class="qr-code">
            <div class="success-message">Kiểm tra vé thành công<br>Nhân viên hướng dẫn khách vào rạp</div>
          </div>
          <div class="footer">
                 <p>MD-Cinema Enjoy your movie!</p>
          </div>
        </div>
      </body>
    </html>
  `;

    await RNPrint.print({html});
  };

  if (!ticketData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Vé đã được quét hoặc không có dữ liệu
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.ticketContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
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
                  {ticketData.movie.genre.map((item, index) => (
                    <React.Fragment key={item._id}>
                      {index > 0 && ', '}
                      {item.name}
                    </React.Fragment>
                  ))}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timeLocationContainer}>
            <SvgXml style={{color: 'black'}} xml={iconCalendarBlack()} />
            <View style={styles.dateTimeContainer}>
              <Text style={styles.timeText}>{ticketData.time.time}</Text>
              <Text style={styles.dateText}>
                {new Date(ticketData.showdate.date).toLocaleDateString()}
              </Text>
            </View>
            <SvgXml style={{color: 'black'}} xml={iconSetMyTicket()} />
            <View style={styles.locationContainer}>
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
              <Text style={styles.priceText}>
                {ticketData.total
                  .toLocaleString('en-US')}{' '}
                VND
              </Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconLocationMyTicket()} />
              <Text style={styles.locationText}>
                {ticketData.cinema.name}
                {'\n'}
                {ticketData.cinema.address}
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
        <TouchableOpacity
          style={styles.printButton}
          onPress={() => createPdf(ticketData)}>
          <Text style={styles.printText}>Xuất Vé</Text>
        </TouchableOpacity>
      </ScrollView>
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
    flex: 1,
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
  loadingText: {
    fontSize: 18,
    color: 'white',
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
    marginTop: 20,
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
    width: 200,
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
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 5,
    color: 'black',
    marginHorizontal: 5,
  },
  timeLocationContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateTimeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginRight: 20,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 20,
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
    width: '80%',
    fontSize: 14,
    textAlign: 'start',
    color: 'black',
    marginLeft: 10,
  },
  printButton: {
    marginTop: 10,
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
