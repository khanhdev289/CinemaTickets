import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const MyTicketScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Vé của tôi</Text>
      <View style={styles.ticketContainer}>
        <Image
          source={{uri: 'https://your-image-url.com/avengers.jpg'}}
          style={styles.moviePoster}
        />
        <Text style={styles.movieTitle}>Avengers: Infinity War</Text>
        <Text style={styles.movieDetails}>2 Tiếng 29 phút</Text>
        <Text style={styles.movieDetails}>Hành động, Phiêu lưu, sci-fi</Text>
        <View style={styles.timeLocationContainer}>
          <Text style={styles.timeText}>14h15</Text>
          <Text style={styles.dateText}>10.12.2022</Text>
          <Text style={styles.rapText}>Rạp 4</Text>
          <Text style={styles.seatText}>Ghế H7, H8</Text>
        </View>
        <QRCode value="https://your-qr-code-url.com" size={150} />
        <Text style={styles.priceText}>210.000 VND</Text>
        <Text style={styles.locationText}>
          Vincom Ocean Park{'\n'}
          4th floor, Vincom Ocean Park, Đa Tốn, Gia Lâm, Hà Nội
        </Text>
        <Text style={styles.instructionText}>
          Show this QR code to the ticket counter to receive your ticket
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  ticketContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  moviePoster: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  movieDetails: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  timeLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rapText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
  },
});

export default MyTicketScreen;
