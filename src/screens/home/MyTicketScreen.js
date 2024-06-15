import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Line, SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import iconsBack from '../../assets/icons/iconsBack';
import {SafeAreaView} from 'react-native-safe-area-context';
import iconCalendar from '../../assets/icons/iconCalendar';
import iconHome from '../../assets/icons/iconHome';
import iconCalendarBlack from '../../assets/icons/iconMyTicket/iconCalendarBlack';
import iconSetMyTicket from '../../assets/icons/iconMyTicket/iconSetMyTicket';
import iconClockMyTicket from '../../assets/icons/iconMyTicket/iconClockMyTicket';
import iconMovieMyTicket from '../../assets/icons/iconMyTicket/iconMovieMyTicket';
import iconMoneyMyTicket from '../../assets/icons/iconMyTicket/iconMoneyMyTicket';
import iconLocationMyTicket from '../../assets/icons/iconMyTicket/iconLocationMyTicket';
import iconNoteMyTicket from '../../assets/icons/iconMyTicket/iconNoteMyTicket';

const MyTicketScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={handleBack}>
              <SvgXml style={styles.back} xml={iconsBack()} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Vé của tôi</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.ticketContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Image
              source={{
                uri: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg',
              }}
              style={styles.moviePoster}
            />

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Text style={styles.movieTitle}>Avengers: Infinity War </Text>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml style={{color: 'black'}} xml={iconClockMyTicket()} />
                <Text style={styles.movieDetails}>2 Tiếng 29 phút</Text>
              </View>
              <View style={styles.detailsContainerAndIcon}>
                <SvgXml style={{color: 'black'}} xml={iconMovieMyTicket()} />
                <Text style={styles.movieDetails}>
                  Hành động, Phiêu lưu, sci-fi
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.timeLocationContainer}>
            <SvgXml style={{color: 'black'}} xml={iconCalendarBlack()} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.timeText}>14h15</Text>
              <Text style={styles.dateText}>10.12.2022</Text>
            </View>
            <SvgXml style={{color: 'black'}} xml={iconSetMyTicket()} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.rapText}>Rạp 4</Text>
              <Text style={styles.seatText}>Ghế H7, H8</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.qrCodeContainer}>
            <QRCode value="https://your-qr-code-url.com" size={200} />
          </View>
          <View style={styles.line} />
          <View style={styles.detailsContainer}>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconMoneyMyTicket()} />
              <Text style={styles.priceText}>210.000 VND</Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconLocationMyTicket()} />
              <Text style={styles.locationText}>
                Vincom Ocean Park{'\n'}
                4th floor, Vincom Ocean Park, Đa Tốn, Gia Lâm, Hà Nội
              </Text>
            </View>
            <View style={styles.detailsContainerAndIcon}>
              <SvgXml style={{color: 'black'}} xml={iconNoteMyTicket()} />
              <Text style={styles.instructionText}>
                Xuất trình mã QR này cho quầy vé để nhận vé
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
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: '10%',
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
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  moviePoster: {
    width: 130,
    height: 200,
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
    alignItems: 'center', // Center QR code horizontally
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
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: 'black',
    marginLeft: 10,
  },
});

export default MyTicketScreen;
