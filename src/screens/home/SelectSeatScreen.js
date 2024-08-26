import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import io from 'socket.io-client';

import {
  createTicket,
  fetchRoom,
  fetchRoombyMovie,
  fetchSeatByRoom,
  fetchShowTimeById,
  fetchStatusSeats,
  fetchTimeByShowTime,
} from '../../../api';
import iconBack from '../../assets/icons/iconBack';
import iconLine from '../../assets/icons/iconLine';
import iconsBack from '../../assets/icons/iconsBack';

import HeaderComponent from '../../components/HeaderComponent';
import {useAuth} from '../../components/AuthProvider ';

const rows = 'ABCDEFGH'.split('');
const cols = Array.from({length: 8}, (_, i) => i + 1);
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const SelectSeatScreen = ({route}) => {
  const navigation = useNavigation();
  const {rooms, movieId, cinemaId} = route.params;
  const [message, setMessage] = useState();
  const socket = io('http://139.180.132.97:3000');
  const [dateArray, setDateArray] = useState([]);
  const [timeArray, setTimeArray] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  const {user} = useAuth();
  const userID = user.user._id;

  useEffect(() => {
    fetchRoomData(rooms);
  }, [rooms]);
  
console.log(rooms);

  useEffect(() => {
    if (message) {
      updateSeatStatus(message);
    }
  }, [message]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Đã kết nối tới server');
    });

    socket.on('statusseat', message => {
      console.log('statusseat socket:', message);
      setMessage(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedDateIndex !== null) {
      fetchTimeData(dateArray[selectedDateIndex]._id);
    }
  }, [selectedDateIndex, dateArray]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (selectedDateIndex !== null && selectedTimeIndex !== null) {
        const showtimeId = dateArray[selectedDateIndex]?._id;
        const timeId = timeArray[selectedTimeIndex]?._id;
        try {
          const data = await fetchRoombyMovie(
            cinemaId,
            movieId,
            showtimeId,
            timeId,
          );
          setRoomId(data._id);
        } catch (error) {
          console.error('Error fetching room data:', error);
          Alert.alert('Error', 'Unable to fetch room data');
        }
      }
    };

    fetchRoomData();
  }, [
    selectedDateIndex,
    selectedTimeIndex,
    dateArray,
    timeArray,
    movieId,
    cinemaId,
  ]);

  useEffect(() => {
    const fetchSeatData = async () => {
      if (roomId && selectedDateIndex !== null && selectedTimeIndex !== null) {
        setIsLoadingSeats(true);
        try {
          const showtimeId = dateArray[selectedDateIndex]._id;
          const timeId = timeArray[selectedTimeIndex]._id;

          const seatData = await fetchSeatByRoom(roomId);

          const formattedSeats = seatData.map(seat => ({
            _id: seat._id,
            name: seat.name,
            price: seat.price,
            status: 'available',
          }));
          formattedSeats.sort((a, b) => a.name.localeCompare(b.name));

          setSeats(formattedSeats);

          const statusData = await fetchStatusSeats(roomId, showtimeId, timeId);
          const updatedSeats = formattedSeats.map(seat => {
            const statusSeat = statusData.find(s => s.seat._id === seat._id);
            return statusSeat ? {...seat, status: statusSeat.status} : seat;
          });

          setSeats(updatedSeats);
        } catch (error) {
          console.error('Error fetching seat data:', error);
          Alert.alert('Error', 'Unable to fetch seat data');
        } finally {
          setIsLoadingSeats(false);
        }
      }
    };

    fetchSeatData();
  }, [roomId, selectedDateIndex, selectedTimeIndex, dateArray, timeArray]);

  const fetchRoomData = async rooms => {
    try {
      const showtimesIds = rooms.map(room => room.showtimes).flat();

      const fetchShowtimeData = async id => {
        const response = await fetchShowTimeById(id);
        return response;
      };

      const showtimesData = await Promise.all(
        showtimesIds.map(id => fetchShowtimeData(id)),
      );
      const showtimes = showtimesData.flat().map(show => ({
        ...show,
        date: new Date(show.date),
      }));
      showtimes.sort((a, b) => a.date - b.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeekDate = new Date(today);
      nextWeekDate.setDate(today.getDate() + 7);

      const filteredShowtimes = showtimes.filter(showtime => {
        const showtimeDate = showtime.date;
        showtimeDate.setHours(0, 0, 0, 0);
        return showtimeDate >= today && showtimeDate <= nextWeekDate;
      });

      setDateArray(filteredShowtimes);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to fetch room data');
    }
  };

  const fetchTimeData = async showtimeId => {
    try {
      const timeData = await fetchTimeByShowTime(showtimeId);
      setTimeArray(timeData.getShowtime.time);
    } catch (error) {
      console.error('Error fetching time data:', error);
      throw new Error('Unable to fetch time data');
    }
  };

  const handleSeatPress = seatId => {
    const seat = seats.find(seat => seat._id === seatId);
    if (seat.status === 'close') {
      Alert.alert('Thông báo', 'Ghế đang bảo trì. Vui lòng chọn ghế khác.');
      return;
    }
    if (selectedDateIndex === null || selectedTimeIndex === null) {
      Alert.alert('Thông báo', 'Vui lòng chọn suất chiếu trước khi chọn ghế');
      return;
    }

    const selectedDate = dateArray[selectedDateIndex].date;
    const selectedTime = timeArray[selectedTimeIndex].time;
    const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
    const currentDate = new Date();

    const selectedShowtime = new Date(selectedDate);
    selectedShowtime.setHours(selectedHour, selectedMinute, 0);

    if (selectedShowtime <= currentDate) {
      Alert.alert(
        'Thông báo',
        'Suất chiếu đã qua, vui lòng chọn suất chiếu khác',
      );
      return;
    }

    const checkContiguousSelection = (seat, selectedSeats) => {
      if (selectedSeats.length === 0) {
        // First seat selection, always allowed
        return true;
      }

      for (const selectedSeat of selectedSeats) {
        const selectedSeatRow = selectedSeat.name.charAt(0);
        const selectedSeatCol = parseInt(selectedSeat.name.slice(1));
        const newSeatRow = seat.name.charAt(0);
        const newSeatCol = parseInt(seat.name.slice(1));

        if (
          (selectedSeatRow === newSeatRow &&
            Math.abs(selectedSeatCol - newSeatCol) <= 1) ||
          (selectedSeatCol === newSeatCol &&
            Math.abs(
              selectedSeatRow.charCodeAt(0) - newSeatRow.charCodeAt(0),
            ) === 1)
        ) {
          return true; // Seat is contiguous with at least one selected seat
        }
      }

      // No contiguous seat found
      return false;
    };
    // Lấy trạng thái hiện tại của ghế được bấm
    const selectedSeat = seats.find(seat => seat._id === seatId);
    const canSelectSeat = checkContiguousSelection(seat, selectedSeats);
    if (!canSelectSeat) {
      Alert.alert('Thông báo', 'Vui lòng chọn ghế sát nhau');
      return;
    }

    if (selectedSeats.length >= 6 && selectedSeat.status === 'available') {
      Alert.alert(
        'Thông báo',
        'Bạn chỉ có thể chọn tối đa 6 ghế cho mỗi lần đặt vé',
      );
      return;
    }

    const updatedSeats = seats.map(seat =>
      seat._id === seatId
        ? {
            ...seat,
            status: seat.status === 'available' ? 'select' : 'available',
          }
        : seat,
    );

    setSeats(updatedSeats);
    if (selectedSeat.status === 'available') {
      setSelectedSeats([...selectedSeats, selectedSeat]);
    } else {
      setSelectedSeats(selectedSeats.filter(seat => seat._id !== seatId));
    }
  };

  const handleTicket = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ghế trước khi tiếp tục');
      return;
    }
    const seatIds = selectedSeats.map(seat => seat._id);
    const showtimeId = dateArray[selectedDateIndex]._id;
    const timeId = timeArray[selectedTimeIndex]._id;
    const ticketData = await createTicket(
      seatIds,
      userID,
      showtimeId,
      timeId,
      calculateTotal(),
    );
    if (ticketData) {
      console.log('Ticket created successfully:', ticketData);
      navigation.navigate('PaymentScreen', {ticketData: ticketData.create});
    }
  };

  const renderSeat = seat => {
    let seatStyle;
    let seatTextStyle = styles.seatText;
    switch (seat.status) {
      case 'available':
        seatStyle = styles.availableSeat;
        break;
      case 'waiting':
        seatStyle = styles.pendingSeat;
        seatTextStyle = [styles.seatText, {color: '#FCC434'}];
        break;
      case 'reserved':
        seatStyle = styles.bookedSeat;
        seatTextStyle = [styles.seatText, {color: '#FCC434'}];
        break;
      case 'select':
        seatStyle = styles.selectedSeat;
        seatTextStyle = [styles.seatText, {color: 'black'}];
        break;
      case 'close':
        seatStyle = styles.brokenSeat;
        seatTextStyle = [
          styles.seatText,
          {color: 'gray', fontWeight: 'medium'},
        ];
        break;
      default:
        seatStyle = styles.availableSeat;
    }

    return (
      <TouchableOpacity
        key={seat._id}
        style={[styles.seat, seatStyle]}
        onPress={() => handleSeatPress(seat._id)}
        disabled={
          seat.status !== 'available' &&
          seat.status !== 'select' &&
          seat.status !== 'close'
        }>
        <Text style={seatTextStyle}>{seat.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderSeatGrid = () => {
    if (isLoadingSeats) {
      return <ActivityIndicator size="large" color="#FCC434" />;
    }

    if (seats.length === 0) {
      return <Text style={styles.noSeatsText}>Không có dữ liệu ghế</Text>;
    }

    const seatGrid = [];
    for (let i = 0; i < rows.length; i++) {
      const rowSeats = seats.slice(i * cols.length, (i + 1) * cols.length);
      seatGrid.push(
        <View key={i} style={styles.row}>
          {rowSeats.map(seat => renderSeat(seat))}
        </View>,
      );
    }
    return seatGrid;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const updateSeatStatus = message => {
    const {seat, showday, showtime, status} = message;
    const updatedSeats = seats.map(seatItem => {
      const seatMatches = seatItem._id === seat;
      const dateMatches =
        selectedDateIndex !== null &&
        dateArray[selectedDateIndex]._id === showday;
      const timeMatches =
        selectedTimeIndex !== null &&
        timeArray[selectedTimeIndex]._id === showtime;
      if (seatMatches && dateMatches && timeMatches) {
        return {...seatItem, status};
      }
      return seatItem;
    });
    setSeats(updatedSeats);
  };

  const SeatStatus = seatStatusData => {
    setSeats(prevSeats => {
      const updatedSeats = prevSeats.map(seat => {
        const seatData = seatStatusData.find(s => s.seat._id === seat._id);
        if (seatData) {
          return {...seat, status: seatData.status};
        }
        return seat;
      });
      return updatedSeats;
    });
  };

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.availableSeat]} />
        <Text style={styles.legendText}>Có sẵn</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.pendingSeat]} />
        <Text style={styles.legendText}>Đang chờ</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.bookedSeat]} />
        <Text style={styles.legendText}>Đã đặt</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.selectedSeat]} />
        <Text style={styles.legendText}>Bạn đã chọn</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Chọn ghế" navigation={navigation} />

      <ScrollView>
        <View style={styles.screenContainer}>
          <SvgXml xml={iconLine()} />
          <LinearGradient
            colors={['#FCC434', '#00000000']}
            style={styles.gradientLine}
          />
        </View>

        <View style={styles.seatContainer}>{renderSeatGrid()}</View>

        {renderLegend()}

        <Text style={styles.selectedDateText}>{selectedDate}</Text>

        <FlatList
          data={dateArray}
          keyExtractor={item => item._id}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedDateIndex(dateArray.indexOf(item));
                setSelectedTimeIndex(null);
                setSelectedDate(
                  item.date.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                );
              }}>
              <View
                style={[
                  styles.dateContainer,
                  index === 0
                    ? {marginLeft: 12}
                    : index === dateArray.length - 1
                    ? {marginRight: 12}
                    : {},
                  item._id === dateArray[selectedDateIndex]?._id
                    ? {backgroundColor: '#FCC434'}
                    : {},
                ]}
                key={item._id}>
                <Text
                  style={[
                    styles.dayText,
                    item._id === dateArray[selectedDateIndex]?._id
                      ? {color: 'black'}
                      : {color: 'white'},
                  ]}>
                  {item.date.toLocaleDateString('vi-VN', {weekday: 'long'})}
                </Text>
                <View style={styles.dateCircle}>
                  <Text style={styles.dateText}>{item.date.getDate()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={styles.OutterContainer}>
          <FlatList
            data={timeArray}
            keyExtractor={item => item._id}
            horizontal
            bounces={false}
            contentContainerStyle={styles.containerGap24}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => setSelectedTimeIndex(timeArray.indexOf(item))}>
                <View
                  style={[
                    styles.timeContainer,
                    index === 0
                      ? {marginLeft: 12}
                      : index === timeArray.length - 1
                      ? {marginRight: 12}
                      : {},
                    item._id === timeArray[selectedTimeIndex]?._id
                      ? {backgroundColor: '#261D08', borderColor: '#FCC434'}
                      : {},
                  ]}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText1}>Tổng:</Text>
            <Text style={styles.totalText}>{calculateTotal()} VND</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedSeats.length === 0 ? '#999' : '#FCC434',
              },
            ]}
            onPress={handleTicket}>
            <Text style={styles.buttonText}>Mua Vé</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  screenContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 8,
    alignSelf: 'center',
    height: screenHeight * 0.1,
  },
  gradientLine: {
    height: screenHeight * 0.08,
  },
  seatContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  seat: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    margin: screenWidth * 0.01,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  availableSeat: {
    backgroundColor: '#1C1C1C',
  },
  pendingSeat: {
    backgroundColor: '#261D08',
  },
  bookedSeat: {
    backgroundColor: '#970404',
  },
  selectedSeat: {
    backgroundColor: '#FCC434',
  },
  brokenSeat: {
    backgroundColor: '#333333',
  },
  seatText: {
    fontSize: 12,
    color: '#BFBFBF',
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 5,
  },
  legendText: {
    color: 'white',
    fontSize: 14,
  },
  selectedDateText: {
    color: 'white',
    margin: 5,
    textAlign: 'center',
  },
  containerGap24: {
    gap: screenWidth * 0.04,
  },
  dateContainer: {
    paddingVertical: 8,
    width: screenWidth * 0.13,
    height: screenHeight * 0.13,
    borderRadius: 20,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateCircle: {
    width: screenHeight * 0.04,
    height: screenHeight * 0.04,
    borderRadius: screenHeight * 0.02,
    backgroundColor: '#3B3B3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#F2F2F2',
  },
  dayText: {
    fontSize: 12,
    color: '#000000',
  },
  OutterContainer: {
    marginVertical: 12,
  },
  timeContainer: {
    paddingVertical: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#F2F2F2',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalContainer: {
    flexDirection: 'column',
  },
  totalText1: {
    fontSize: 16,
    color: '#F2F2F2',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FCC434',
  },
  button: {
    backgroundColor: '#FCC434',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
  },
  noSeatsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SelectSeatScreen;
