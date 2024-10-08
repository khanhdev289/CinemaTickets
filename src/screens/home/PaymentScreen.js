import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';
import BackgroundTimer from 'react-native-background-timer';
import iconPlayVideo from '../../assets/icons/iconPlayVideo';
import iconLocation from '../../assets/icons/iconLocation';
import iconClock from '../../assets/icons/iconClock';
import iconDiscount from '../../assets/icons/iconDiscount';
import {useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import {
  IMAGE_API_URL,
  checkDiscount,
  fetchCinemaById,
  fetchCombo,
  fetchMovieById,
  fetchSeatById,
  fetchShowTimeById,
  fetchTimeById,
  updateTicket,
} from '../../../api';
import iconsBack from '../../assets/icons/iconsBack';
import {useAuth} from '../../components/AuthProvider ';
import HeaderComponent from '../../components/HeaderComponent';
import iconBack from '../../assets/icons/iconBack';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const POSTS_API_URL1 = 'http://139.180.132.97:3000/tickets/status';
const POSTS_API_URL = 'http://139.180.132.97:3000/tickets/payment';
const PaymentScreen = ({route}) => {
  const stripe = useStripe();
  const {user} = useAuth();
  const {ticketData} = route.params;

  const navigation = useNavigation();
  const [movieInfo, setMovieInfo] = useState([]);
  const [cinemaInfo, setCinemaInfo] = useState([]);
  const [dateInfo, setDateInfo] = useState([]);
  const [timeInfo, setTimeInfo] = useState([]);
  const [seatInfo, setSeatInfor] = useState([]);
  const [combo, setCombo] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmountT, setDiscountAmountT] = useState(0);
  const [discountAmountF, setDiscountAmountF] = useState(0);
  const [showAllItems, setShowAllItems] = useState(false);
  const [idDiscountTicket, setidDiscountTicket] = useState(null);
  const [idDiscountFood, setidDiscountFood] = useState(null);
  const [comboQuantities, setComboQuantities] = useState({
    combo1: 1,
    combo2: 1,
    combo3: 1,
  });
  const [comboChecked, setComboChecked] = useState({
    combo1: false,
    combo2: false,
    combo3: false,
  });
  const [countdown, setCountdown] = useState(60 * 10);
  useEffect(() => {
    fetchData();
  }, [ticketData]);
  useEffect(() => {
    fetchData();
  }, [ticketData]);

  // Thêm logic khởi tạo comboQuantities và comboChecked
  useEffect(() => {
    if (combo.length > 0) {
      const initialQuantities = {};
      const initialChecked = {};

      combo.forEach((item, index) => {
        const comboKey = `combo${index + 1}`;
        initialQuantities[comboKey] = 1; // Đặt số lượng mặc định là 1
        initialChecked[comboKey] = false; // Đặt trạng thái mặc định là chưa chọn
      });

      setComboQuantities(initialQuantities);
      setComboChecked(initialChecked);
    }
  }, [combo]);

  useEffect(() => {
    if (countdown > 0 && !countdownExpired) {
      const intervalId = BackgroundTimer.setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      return () => {
        BackgroundTimer.clearInterval(intervalId);
      };
    } else if (countdown == 0) {
      setCountdownExpired(true);
    }
  }, [countdownExpired, countdown]);
  const calculateTotalAmount = () => {
    const ticketTotal = parseFloat(ticketData.total - discountAmountT);
    const comboTotal = parseFloat(getTotalPrice() - discountAmountF);
    return ticketTotal + comboTotal;
  };
  const totalTicket = ticketData.total - discountAmountT;

  const fetchData = async () => {
    try {
      const movieResponse = await fetchMovieById(ticketData.movie);
      const cinemaResponse = await fetchCinemaById(ticketData.cinema);
      const showtimeResponse = await fetchShowTimeById(ticketData.showdate);
      const timeResponse = await fetchTimeById(ticketData.time);
      const seatResponses = await Promise.all(
        ticketData.seat.map(async seatId => {
          return await fetchSeatById(seatId);
        }),
      );
      const comboRespose = await fetchCombo();

      setCombo(comboRespose);
      setMovieInfo(movieResponse);
      setCinemaInfo(cinemaResponse);
      setDateInfo(showtimeResponse);
      setTimeInfo(timeResponse);
      setSeatInfor(seatResponses);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response && error.response.status === 500) {
        Alert.alert(
          'Thông báo',
          'Vé đã có người đặt. Vui lòng chọn vé khác.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
          {cancelable: false},
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const increaseQuantity = comboKey => {
    setComboQuantities(prevQuantities => ({
      ...prevQuantities,
      [comboKey]: prevQuantities[comboKey] + 1,
    }));
  };

  const decreaseQuantity = comboKey => {
    if (comboQuantities[comboKey] > 1) {
      setComboQuantities(prevQuantities => ({
        ...prevQuantities,
        [comboKey]: prevQuantities[comboKey] - 1,
      }));
    }
  };

  const toggleComboCheckbox = comboKey => {
    setComboChecked(prevChecked => ({
      ...prevChecked,
      [comboKey]: !prevChecked[comboKey],
    }));
  };

  const getTotalPrice = () => {
    let total = 0;
    combo.forEach((item, index) => {
      const comboKey = `combo${index + 1}`;
      if (comboChecked[comboKey]) {
        const totalPrice = comboQuantities[comboKey] * item.price;
        total += totalPrice;
      }
    });
    return total;
  };
  const totalFood = getTotalPrice() - discountAmountF;

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleContinue = async () => {
    try {
      const selectedCombos = Object.keys(comboChecked)
        .filter(comboKey => comboChecked[comboKey])
        .map(comboKey => {
          const comboIndex = parseInt(comboKey.replace('combo', '')) - 1;
          const item = combo[comboIndex];

          if (item) {
            return {
              foodId: item._id,
              quantity: comboQuantities[comboKey],
            };
          }

          return null;
        })
        .filter(combo => combo !== null);
      const discountIds = [idDiscountTicket, idDiscountFood].filter(
        id => id !== null && id !== undefined,
      );
      // Update ticket with new data
      await updateTicket(
        ticketData._id,
        discountIds,
        selectedCombos,
        getTotalPrice(),
        calculateTotalAmount(),
      );
      // Navigate to next screen or show a success message
      // navigation.navigate('NextScreen'); // Thay đổi tên màn hình tiếp theo
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleApplyDiscount = async () => {
    try {
      const discountData = await checkDiscount(discountCode, ticketData.cinema);
      console.log(discountData);
      if (discountData.type === 'ticket') {
        setDiscountAmountT(discountData.percent * parseFloat(ticketData.total));
        setidDiscountTicket(discountData._id);
      } else if (discountData.type === 'food') {
        setDiscountAmountF(discountData.percent * parseFloat(getTotalPrice()));
        setidDiscountFood(discountData._id);
      } else {
        Alert.alert('Thông báo', 'Mã code của bạn không hợp lệ');
      }
    } catch (error) {
      Alert.alert('Mã code của bạn không hợp lệ');
    }
  };

  const subscribe = async () => {
    try {
      handleContinue();
      const token = user.token.access_token;

      const response = await axios.post(
        `${POSTS_API_URL}/${ticketData._id}`,
        {
          name: 'khanh',
          amount: calculateTotalAmount(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Đảm bảo đúng loại dữ liệu gửi đi
          },
        },
      );

      if (!selectedPaymentMethod) {
        Alert.alert('Thông báo', 'Bạn cần chọn phương thức thanh toán');
        return;
      }
      if (countdownExpired) {
        Alert.alert('Thông báo', 'Thời gian thanh toán của bạn đã hết.');
        navigation.goBack();
        return;
      }

      const clientSecret = response.data;

      const {error: initError} = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        googlePay: true,
        merchantDisplayName: 'MD-Cinema',
      });

      if (initError) {
        console.error(initError);
        return Alert.alert('Lỗi', initError.message);
      }

      const {error: presentError} = await stripe.presentPaymentSheet({
        clientSecret,
      });

      if (presentError) {
        console.error(presentError);
        return Alert.alert('Lỗi', presentError.message);
      }

      Alert.alert('Thanh toán thành công, cảm ơn bạn!');
      paymentSuccess();
    } catch (err) {
      console.error(err);
      Alert.alert('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
  };
  const paymentSuccess = async () => {
    try {
      const token = user.token.access_token;

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = `${POSTS_API_URL1}/${ticketData._id}`;
      const response = await axiosInstance.put(url);

      const data = response.data;

      navigation.navigate('TicketScreen', {_id: ticketData._id, check: true});
    } catch (error) {
      console.error('Lỗi khi thanh toán: ', error);
    }
  };

  const toggleShowAllItems = () => {
    setShowAllItems(!showAllItems);
  };

  const handleBack = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    const backAction = () => {
      handleBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b731" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <HeaderComponent title="Thanh toán" navigation={navigation} /> */}
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleBack()}>
            <SvgXml xml={iconBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Thanh toán</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView>
        <View style={styles.movieInfo}>
          <Image
            style={styles.image}
            source={{uri: IMAGE_API_URL + movieInfo.image}}
          />
          <View style={{flexDirection: 'column', margin: 10}}>
            <Text numberOfLines={2} style={styles.movieTitle}>
              {movieInfo.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <SvgXml xml={iconPlayVideo()} width={16} height={16} />
              <Text style={styles.genre}>
                {' '}
                {movieInfo.genre?.map(genre => genre.name).join(', ')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <SvgXml xml={iconLocation()} width={16} height={16} />
              <Text style={styles.genre}> {cinemaInfo.name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <SvgXml xml={iconClock()} width={16} height={16} />
              <Text style={styles.genre}>
                {' '}
                {formatDate(dateInfo.date)} • {timeInfo.time}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.ticketInfo}>
          <Text style={styles.orderId}>
            Oder ID: {ticketData._id.slice(-8)}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.orderId}>Ghế: </Text>
            {seatInfo &&
              seatInfo.map((seat, index) => (
                <Text key={index} style={styles.orderId}>
                  {index > 0 ? ', ' : ''}
                  {seat.name}
                </Text>
              ))}
          </View>
        </View>
        <View style={styles.customInputContainer}>
          <SvgXml
            xml={iconDiscount()}
            width={24}
            height={24}
            style={styles.icon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={discountCode => setDiscountCode(discountCode)}
            placeholder="Mã khuyến mãi"
            value={discountCode}
            placeholderTextColor="#949494"
          />

          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyDiscount}>
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <Text style={{color: 'white'}}>Vé</Text>
          <Text style={{color: 'white', fontSize: 20}}>
            {totalTicket.toLocaleString('en-US')} VND
          </Text>
        </View>
        <View style={styles.line} />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.comboContainer}> Chọn combo</Text>
          <TouchableOpacity onPress={toggleShowAllItems}>
            <Text style={styles.viewAllText}>
              {showAllItems ? 'Ẩn đi' : 'Xem tất cả'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.combo}>
          <ComboList
            combo={combo}
            comboQuantities={comboQuantities}
            comboChecked={comboChecked}
            showAllItems={showAllItems}
            decreaseQuantity={decreaseQuantity}
            increaseQuantity={increaseQuantity}
            toggleComboCheckbox={toggleComboCheckbox}
            IMAGE_API_URL={IMAGE_API_URL}
            screenHeight={screenHeight}
            styles={styles}
          />
        </View>
        <View style={styles.line} />
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text style={styles.comboTotalPrice}>
            {totalFood.toLocaleString('en-US')} VND
          </Text>
        </View>
        <Text style={{color: 'white', margin: 5, fontSize: 20}}>
          Phương thức thanh toán
        </Text>
        <TouchableOpacity
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === 'visa' && {borderColor: '#FFD700'}, // Cập nhật màu viền nếu được chọn
          ]}
          onPress={() => setSelectedPaymentMethod('visa')} // Đặt phương thức thanh toán đã chọn
        >
          <Image
            source={require('../../assets/images/Visa.png')}
            style={{
              width: '30%',
              resizeMode: 'contain',
            }}
          />
          <View style={{marginLeft: 20}}>
            <Text style={{color: 'white'}}>VISA International payments </Text>
            <Text style={styles.paymentMethodValue}>
              (Visa, Master, JCB, Amex)
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10,
          }}>
          <Text style={{color: 'white'}}>Tổng</Text>
          <Text style={styles.totalAmountValue}>
            {calculateTotalAmount().toLocaleString('en-US')} VND
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'space-around',
            alignItems: 'center',
            margin: 10,
            backgroundColor: '#261D08',
          }}>
          <Text style={{color: 'white'}}>
            Hoàn thành thanh toán của bạn trong
          </Text>
          <Text style={styles.countdownValue}>
            {formatCountdown(countdown)}
          </Text>
        </View>
        <TouchableOpacity onPress={subscribe}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonLabel}>Tiếp tục</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const ComboList = ({
  combo,
  comboQuantities,
  comboChecked,
  showAllItems,
  decreaseQuantity,
  increaseQuantity,
  toggleComboCheckbox,
  IMAGE_API_URL,
  screenHeight,
  styles,
}) => {
  return (
    <ScrollView
      contentContainerStyle={[
        !showAllItems && {maxHeight: screenHeight * 0.5},
      ]}>
      {combo.map((item, index) => {
        const comboKey = `combo${index + 1}`;
        const totalPrice = comboQuantities[comboKey] * item.price;

        // Chỉ hiển thị mục đầu tiên và các mục thêm khi showAllItems là true
        if (!showAllItems && index > 0) {
          return null;
        }

        return (
          <View key={index} style={styles.comboModal}>
            <View style={styles.modalCombo}>
              <Image
                style={styles.imageCombo}
                source={{uri: IMAGE_API_URL + item.image}}
              />
              <View style={styles.comboItem}>
                <Text style={styles.comboTitle}>{item.name}</Text>
                <Text style={styles.comboPrice}>
                  {totalPrice.toLocaleString()} VND
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(comboKey)}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.comboQuantity}>
                    {comboQuantities[comboKey]}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(comboKey)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={() => toggleComboCheckbox(comboKey)}>
                  <View
                    style={[
                      styles.checkbox,
                      comboChecked[comboKey] && styles.checked,
                    ]}>
                    {comboChecked[comboKey] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backContainer: {
    position: 'absolute',
    left: 8,
    top: 5,
  },
  iconButton: {
    position: 'absolute',
    left: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  movieInfo: {
    flexDirection: 'row',
    height: screenHeight * 0.15,
    borderRadius: 16,
    backgroundColor: '#1C1C1C',
  },
  image: {
    width: '25%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 16,
  },
  imageCombo: {
    width: '20%',
    height: 80,
    objectFit: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  line: {
    height: 0.5,
    backgroundColor: 'white',
    marginVertical: 10,
  },

  comboTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comboPrice: {
    fontSize: 16,
    color: 'green',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderRadius: 5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  comboTotalPrice: {
    fontSize: 20,
    color: 'white',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FCC434',
  },
  genre: {
    fontSize: 10,
    color: '#E6E6E6',
  },
  comboContainer: {
    fontSize: 20,
    color: 'white',
  },

  ticketInfo: {
    marginTop: 10,
  },
  orderId: {
    fontSize: 14,
    color: '#F2F2F2',
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
    height: 'auto',
    width: '100%',
    margin: 10, // Adjust margin as neede
    // Optional: Add horizontal padding
  },
  comboModal: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'auto',
    marginTop: 10, // Adjust margin as neede
    // Optional: Add horizontal padding
  },
  comboItem: {
    width: '60%',
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  comboTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  comboPrice: {
    fontSize: 14,
    color: 'white',
  },
  comboQuantity: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checked: {
    backgroundColor: '#FCC434',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  paymentMethodValue: {
    fontSize: 10,
    fontStyle: 'italic',
    color: 'white',
  },
  paymentMethod: {
    height: 0.1 * screenHeight,
    backgroundColor: '#1C1C1C',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  totalAmountValue: {
    fontSize: 20,
    color: '#FCC434',
    fontWeight: 'bold',
  },
  countdownValue: {
    fontSize: 18,
    color: '#FCC434', // Thay đổi màu thời gian đếm ngược sang đỏ
  },
  confirmButton: {
    backgroundColor: '#FCC434', // Thay đổi màu nút xác nhận sang xanh lam
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonLabel: {
    color: 'black',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText1: {
    fontSize: 12,
    color: '#F2F2F2',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FCC434',
  },
  button: {
    backgroundColor: '#FCC434',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalCombo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',

    marginTop: 10,
  },
  modalTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  closeModalButton: {
    backgroundColor: '#FCC434',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: 'black',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
  },
});
export default PaymentScreen;
