import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import iconsBack from '../../assets/icons/iconsBack';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {IMAGE_API_URL, fetchDiscountById} from '../../../api';
import Clipboard from '@react-native-clipboard/clipboard'; // Import thư viện clipboard
import HeaderComponent from '../../components/HeaderComponent';

const DiscountDetailScreen = ({route}) => {
  const navigation = useNavigation();
  const {discountId} = route.params;
  const [discount, setDiscount] = useState(null); // Khởi tạo là null
  const [copied, setCopied] = useState(false);

  // Hàm xử lý quay lại
  const handleBack = () => {
    navigation.goBack();
  };

  // Hàm xử lý sao chép mã
  const handleCopy = () => {
    if (discount && discount.code) {
      Clipboard.setString(discount.code); // Sao chép mã vào clipboard
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hiện thông báo đã sao chép trong 2 giây
    }
  };

  // Hàm lấy dữ liệu khuyến mại
  const fetchDiscount = async discountId => {
    try {
      const data = await fetchDiscountById(discountId);
      setDiscount(data);
      console.log(data);
    } catch (error) {
      console.error('Unable to fetch discount by id:', error);
    }
  };

  // Sử dụng useEffect để gọi API khi discountId thay đổi
  useEffect(() => {
    fetchDiscount(discountId);
  }, [discountId]);

  // Hàm định dạng ngày tháng năm
  const formatDate = date => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (!discount) {
    // Hiển thị thông báo hoặc một loader trong khi chờ dữ liệu
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderComponent title="Danh sách ưu đãi" navigation={navigation} />
      </View>
      <Image
        source={{uri: IMAGE_API_URL + discount.image}}
        style={styles.image}
      />
      <Text style={styles.discountTitle}>{discount.name}</Text>

      <View style={styles.details}>
        <Text style={styles.text}>Giảm giá: {discount.percent * 100}%</Text>
        <Text style={styles.text}>
          Thời gian áp dụng: {formatDate(discount.dayStart)} -{' '}
          {formatDate(discount.dayEnd)}
        </Text>
        <Text style={styles.text}>Rạp áp dụng:</Text>
        {discount.cinema.map((cinema, index) => (
          <Text key={index} style={styles.text}>
            {cinema.name} - {cinema.address}
          </Text>
        ))}
      </View>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <Text style={styles.code}>Code: {discount.code}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.button}>
          <Text style={styles.buttonText}>
            {copied ? 'Đã sao chép' : 'Sao chép mã'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Chúc các bạn xem phim vui vẻ</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
  loadingText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  discountTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  code: {
    fontSize: 18,
    color: 'white',
  },
  details: {
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'black',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 20,
  },
  buttonText: {
    color: '#FFCB46',
    fontWeight: 'bold',
  },
});

export default DiscountDetailScreen;
