import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import iconBack from '../../assets/icons/iconBack';
import { SvgXml } from 'react-native-svg';
import iconPlay from '../../assets/icons/iconPlay';
import iconPlayVideo from '../../assets/icons/iconPlayVideo';
import iconLocation from '../../assets/icons/iconLocation';
import iconClock from '../../assets/icons/iconClock';
import iconDiscount from '../../assets/icons/iconDiscount';
import { ScrollView } from 'react-native-virtualized-view';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const PaymentScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <SvgXml xml={iconBack()} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Thanh Toán</Text>
        </View>
      </View>
      <View style={styles.movieInfo}>
        <Image
          style={styles.image}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
        <View style={{ flexDirection: 'column', margin: 10 }}>
          <Text style={styles.movieTitle}>Avengers: Infinity War</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <SvgXml xml={iconPlayVideo()} width={16} height={16} />
            <Text style={styles.genre}> Acton, adventure, sci-fi</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <SvgXml xml={iconLocation()} width={16} height={16} />
            <Text style={styles.genre}> Vincom Ocean Park CGV</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <SvgXml xml={iconClock()} width={16} height={16} />
            <Text style={styles.genre}> 10.12.2022 • 14:15</Text>
          </View>
        </View>
      </View>
      <View style={styles.ticketInfo}>
        <Text style={styles.orderId}>Oder ID: 78889377726</Text>
        <Text style={styles.orderId}>Ghé: H7, H8</Text>
      </View>
      <View style={styles.customInputContainer}>
        <SvgXml xml={iconDiscount()} width={24} height={24} style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="Mã khuyến mãi"
          placeholderTextColor="#949494"
        />
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
        <Text style={{ color: 'white' }}>Vé</Text>
        <Text style={{ color: 'white', fontSize: 22 }}>89.000 VND</Text>
      </View>
      <View style={styles.line} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <Text style={styles.comboTitle}>Combo</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Xem tất cả </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.combo}>
        <Image
          style={styles.imageCombo}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
        <View style={styles.comboItem}>
          <Text style={styles.comboTitle}>Combo 1</Text>
          <Text style={styles.comboPrice}>87.000 ₫</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.comboQuantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={styles.comboTotalPrice}>{(87000 * quantity).toLocaleString()} VND</Text>
      </View>
      <Text style={{color:'white',margin:5,fontSize:20}}>Phương Thức Thanh Toán</Text>
      <View style={styles.paymentMethod}>
        <Image
          source={require('../../assets/images/Visa.png')}
          style={{
           width:'30%',
            resizeMode: 'contain',

          }}
        />
        <View style={{marginLeft:20}}>
          <Text style={{ color: 'white' }}>VISA International payments </Text>
          <Text style={styles.paymentMethodValue}>(Visa, Master, JCB, Amex)</Text>
        </View>
      </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center', margin: 10 }}>
        <Text style={{color:'white'}}>Tổng</Text>
        <Text style={styles.totalAmountValue}>176.000 VND</Text>
      </View>
      <View style={{ flexDirection: 'row', padding:10,borderRadius:5,
      justifyContent: 'space-around',alignItems:'center', margin: 10,backgroundColor:'#261D08'
     }}>
        <Text style={{color:'white'}}>Hoàn thành thanh toán của bạn trong</Text>
        <Text style={styles.countdownValue}>15:00</Text>
      </View>
      <View style={styles.confirmButton}>
        <Text style={styles.confirmButtonLabel}>Tiếp tục</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black'
  },
  header: {
    height: screenHeight * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 5,
  },
  titleContainer: {
    width: screenWidth - 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  movieInfo: {

    flexDirection: 'row',
    height: screenHeight * 0.15,
    borderRadius: 16,
    backgroundColor: '#1C1C1C'
  },
  image: {
    width: '25%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 16
  },
  imageCombo: {
    width: '20%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 8
  }, 
  line: {
    height: 0.5,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  comboItem: {

    alignItems: 'center',
  },
  comboTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comboPrice: {
    fontSize: 16,
    color: 'green',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityButton: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  comboTotalPrice: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FCC434',
  },
  genre: {
    fontSize: 10,
    color: '#E6E6E6'
  },

  ticketInfo: {
    marginTop: 10,
  },
  orderId: {
    fontSize: 14,
    color: '#F2F2F2'
  },

  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#1C1C1C',
  },
  icon: {
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: '#949494',
  },
  applyButton: {
    backgroundColor: '#FCC434',
    paddingHorizontal: 20,
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  applyButtonText: {
    color: 'black',
    fontSize: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: 'orange',
    textAlign: 'right',
  },
  combo: {
    flexDirection: 'row',
    height: screenHeight * 0.1,
    alignItems: 'center',

    margin: 10, // Adjust margin as neede
    // Optional: Add horizontal padding
  },
  comboItem: {
    marginLeft: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  comboTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  comboPrice: {
    fontSize: 14,
    color: 'white'
  },
  comboQuantity: {
    fontSize: 14,
    color: 'white'
  },

  paymentMethodValue: {
    fontSize: 10,
    fontStyle: 'italic',
    color: 'white'
  },
  paymentMethod: {
    height: 0.1 * screenHeight,
    backgroundColor: '#1C1C1C',
    margin:5, padding:5,
    borderRadius:10,flexDirection:'row',
    alignItems:'center'

  },
  totalAmountValue: {
    fontSize: 20,
    color: '#FCC434', // Thay đổi màu tổng thành tiền sang đỏ
  },
  countdownValue: {
    fontSize: 18,
 
    color: '#FCC434', // Thay đổi màu thời gian đếm ngược sang đỏ
  },
  confirmButton: {
    backgroundColor: '#FCC434', // Thay đổi màu nút xác nhận sang xanh lam
    padding: 10,
    margin:10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonLabel: {
    color: 'black',
    fontSize: 18,

  },

});
export default PaymentScreen;