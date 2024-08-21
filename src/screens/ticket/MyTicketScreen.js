import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
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

const MyTicketScreen = () => {
  const route = useRoute();
  const [ticketData, setTicketData] = useState(null);
  const {user} = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const qrData = JSON.stringify({
    auth: ticketData.auth,
    _id: ticketData._id,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.ticketContainer}>
          <View style={styles.movieContainer}>
            <Image
              source={{uri: IMAGE_API_URL + ticketData.movie.image}}
              style={styles.moviePoster}
            />
            <View style={styles.movieDetailsContainer}>
              <Text style={styles.movieTitle}>{ticketData.movie.name}</Text>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml xml={iconClockMyTicket()} />
                <Text style={styles.movieDetails}>
                  {ticketData.movie.duration}
                </Text>
              </View>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml xml={iconMovieMyTicket()} />
                <Text style={styles.movieDetails}>
                  {ticketData.movie.genre.map(g => g.name).join(', ')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timeLocationContainer}>
            <SvgXml xml={iconCalendarBlack()} />
            <View style={styles.dateTimeContainer}>
              <Text style={styles.timeText}>{ticketData.time.time}</Text>
              <Text style={styles.dateText}>{ticketData.showdate.date}</Text>
            </View>
            <SvgXml xml={iconSetMyTicket()} />
            <View style={styles.locationContainer}>
              <Text style={styles.rapText}>{ticketData.room.name}</Text>
              <View style={{width: 150}}>
                <Text style={styles.seatText}>
                  {ticketData.seat.map(s => s.name).join(', ')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.qrCodeContainer}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <QRCode value={qrData} size={200} />
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml xml={iconMoneyMyTicket()} />
              <Text style={styles.priceText}>{ticketData.total} VND</Text>
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
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <QRCode value={qrData} size={250} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginTop: 50,
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  rapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  seatText: {
    width: '50%',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flexWrap: 'wrap',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FCC434',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default MyTicketScreen;
