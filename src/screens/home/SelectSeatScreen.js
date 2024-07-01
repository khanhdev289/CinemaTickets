import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert, SafeAreaView, ScrollView, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import iconBack from '../../assets/icons/iconBack';
import { SvgXml } from 'react-native-svg';
import iconLine from '../../assets/icons/iconLine';
const rows = 'ABCDEFGHIJ'.split('');
const cols = Array.from({ length: 12 }, (_, i) => i + 1);
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const generateDate = () => {
  const date = new Date();
  let weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  let weekdays = [];
  for (let i = 0; i < 7; i++) {
    let tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
      fullDate: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};
const timeArray = [
  '10:30',
  '12:30',
  '14:30',
  '15:00',
  '19:30',
  '21:00',
];


const SelectSeatScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const [dateArray, setDateArray] = useState(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [seats, setSeats] = useState(
    Array(10).fill().map((_, row) =>
      Array(12).fill().map((_, col) => {
        if (row === 0 && col < 3) return 'booked';
        if (row === 1 && col < 2) return 'pending';
        return 'available';
      })
    )
  );

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatPress = (row, col) => {
    const updatedSeats = seats.map((seatRow, r) =>
      seatRow.map((seat, c) => {
        if (r === row && c === col && seat === 'available') {
          setSelectedSeats([...selectedSeats, { row, col }]);
          return 'selected';
        } else if (r === row && c === col && seat === 'selected') {
          setSelectedSeats(selectedSeats.filter(s => s.row !== row || s.col !== col));
          return 'available';
        }
        return seat;
      })
    );
    setSeats(updatedSeats);
  };

  const renderSeat = (seat, row, col) => {
    let seatStyle;
    let seatTextStyle = styles.seatText;
    switch (seat) {
      case 'available':
        seatStyle = styles.availableSeat;
        break;
      case 'pending':
        seatStyle = styles.pendingSeat;
        seatTextStyle = [styles.seatText, { color: '#FCC434' }];
        break;
      case 'booked':
        seatStyle = styles.bookedSeat;
        seatTextStyle = [styles.seatText, { color: '#FCC434' }];
        break;
      case 'selected':
        seatStyle = styles.selectedSeat;
        seatTextStyle = [styles.seatText, { color: 'black' }];
        break;
      default:
        seatStyle = styles.availableSeat;
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[styles.seat, seatStyle]}
        onPress={() => handleSeatPress(row, col)}
        disabled={seat !== 'available'}
      >
      <Text style={seatTextStyle}>{`${rows[row]}${cols[col]}`}</Text>
      </TouchableOpacity>
    );
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

  const calculateTotal = () => {
    const pricePerSeat = 100; // giả sử giá vé là 100
    return selectedSeats.length * pricePerSeat;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <SvgXml xml={iconBack()} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Chọn Ghế</Text>
          </View>
        </View>

        {/* Gradient Line */}
        <View style={{ flexDirection: 'column', justifyContent: 'center', margin: 16, alignSelf: 'center', height: screenHeight * 0.1 }}>
          <SvgXml xml={iconLine()} />
          <LinearGradient
            colors={['#FCC434', '#00000000']}
            style={styles.gradientLine}
          />
        </View>
        {/* Seat selection */}
        <View style={styles.seatContainer}>
          {seats.map((seatRow, row) => (
            <View key={row} style={styles.row}>
              {seatRow.map((seat, col) => renderSeat(seat, row, col))}
            </View>
          ))}
        </View>

        {/* Legend */}
        {renderLegend()}

        {/* Show Time Info */}
       
          <Text style={{ color: 'white', marginVertical: 15, textAlign: 'center' }}>{selectedDate}</Text>
    
        <FlatList
          data={dateArray}
          keyExtractor={item => item.date.toString()}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => (
            <TouchableOpacity
            onPress={() => {
              setSelectedDateIndex(index);
              setSelectedDate(`${item.day} Ngày ${item.fullDate}`);
            }}
          >
              <View
                style={[
                  styles.dateContainer,
                  index === 0 ? { marginLeft: screenWidth * 0.03 } : index === dateArray.length - 1 ? { marginRight: screenWidth * 0.03 } : {},
                  index === selectedDateIndex ? { backgroundColor: "#FCC434" } : {},
                ]}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={{
                  width: screenHeight * 0.04, height: screenHeight * 0.04, borderRadius: screenHeight * 0.02, backgroundColor: '#3B3B3B',
                  justifyContent: 'center', alignItems: 'center'
                }} >
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles.OutterContainer}>
          <FlatList
            data={timeArray}
            keyExtractor={item => item}
            horizontal
            bounces={false}
            contentContainerStyle={styles.containerGap24}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index === 0 ? { marginLeft: 24 } : index === timeArray.length - 1 ? { marginRight: 24 } : {},
                    index === selectedTimeIndex ? { backgroundColor: '#261D08', borderColor: '#FCC434' } : {},
                  ]}>
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          /></View>


        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.totalText1}>Tổng:</Text>
            <Text style={styles.totalText}>{calculateTotal()} VND</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('PaymentScreen')}} >
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
  gradientLine: {
    height: screenHeight * 0.08,
  },
  seatContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    padding: 5
  },
  row: {
    flexDirection: 'row',
  },
  seat: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
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
    color:'black'
  },
  seatText: {
    fontSize: 10,
   
    color: '#BFBFBF'
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
  legendText: {
    color: 'white', fontSize: 14,
   
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 5,
  },
  containerGap24: {
    gap: screenWidth * 0.04,
  },
  dateContainer: {
    width: screenWidth * 0.1,
    height: screenHeight * 0.1,
    borderRadius: 20,
    backgroundColor: "#1C1C1C",
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateText: {
    fontSize: 16,
    color: "#F2F2F2",
  },
  dayText: {
    fontSize: 12,
    color: "#F2F2F2"
  },
  OutterContainer: {
    marginVertical: 12,
  },
  timeContainer: {
    paddingVertical: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#1C1C1C",
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#F2F2F2',
  },
  showTimeContainer: {
    padding: 5,
    alignItems: 'center',
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
  totalText1: {
    fontSize: 16,
    color: '#F2F2F2'
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FCC434'
  },
  button: {
    backgroundColor: '#FCC434', // màu nền
    paddingHorizontal:32,
    paddingVertical:12,
    borderRadius: 10, // bo góc
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', // màu chữ
    fontSize: 18,
  },
});

export default SelectSeatScreen;
