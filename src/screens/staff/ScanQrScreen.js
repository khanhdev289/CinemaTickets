import React, {useState, useEffect, useRef} from 'react';
import {Alert, TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useNavigation} from '@react-navigation/native';

const ScanQrScreen = () => {
  const navigation = useNavigation();
  const scannerRef = useRef(null); // Ref for QRCodeScanner component
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleQRRead = ({data}) => {
    try {
      const jsonData = JSON.parse(data);
      if (jsonData && jsonData._id) {
        navigation.navigate('AuthScreen', {ticketId: jsonData._id});
        setScanned(true);
      } else {
        Alert.alert(
          'Invalid QR Code',
          'The scanned QR code is not valid for authentication.',
        );
        setScanned(false);
      }
    } catch (error) {
      Alert.alert('Invalid QR Code', 'The scanned QR code is not valid JSON.');
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    scannerRef.current.reactivate();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <QRCodeScanner
        ref={scannerRef}
        onRead={scanned ? undefined : handleQRRead}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
      />
      <TouchableOpacity style={styles.button} onPress={resetScanner}>
        <Text style={styles.buttonText}>Reset Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#f7b731',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScanQrScreen;
