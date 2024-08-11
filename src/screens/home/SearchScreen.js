
import React, { useEffect, useState } from 'react';

import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import iconBack from '../../assets/icons/iconBack';
import iconSearch from '../../assets/icons/iconSearch';
import iconStar from '../../assets/icons/iconStar';
import iconVideo from '../../assets/icons/iconVideo';
import iconClock from '../../assets/icons/iconClock';

import { IMAGE_API_URL, fetchGenreById, fetchMovies, movieByGenre, searchMovie } from '../../../api';
import iconCalendar from '../../assets/icons/iconCalendar';

import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import iconsBack from '../../assets/icons/iconsBack';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;


const MovieByGenre = () => {

  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [filteredMovieList, setFilteredMovieList] = useState([]);


  // Hàm lấy danh sách phim theo thể loại
  const fetchData = async () => {
    try {
      const response = await fetchMovies(); // Gọi API lấy danh sách phim theo thể loại

      setMovieList(response); // Lưu danh sách phim vào state movieList
      setFilteredMovieList(response); // Khởi tạo danh sách phim tìm kiếm với toàn bộ danh sách ban đầu

    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      // Xử lý lỗi nếu cần
    }
  };

  useEffect(() => {
    fetchData(); // Load danh sách phim khi component được mount và khi genreId thay đổi
  }, []);

  // Hàm xử lý tìm kiếm phim
  const handleSearch = (query) => {
    const normalizedQuery = query.toLowerCase(); // Chuẩn hóa chuỗi tìm kiếm thành chữ thường
    const filteredData = movieList.filter((item) => {
      const itemName = item.name.toLowerCase();
      return itemName.includes(normalizedQuery); // Kiểm tra xem tên phim có chứa chuỗi tìm kiếm không
    });
    setFilteredMovieList(filteredData); // Cập nhật danh sách phim tìm kiếm
    setSearchQuery(query); // Cập nhật nội dung tìm kiếm hiển thị trên giao diện
  };

  // Render mỗi item phim trong danh sách
  const renderItem = ({ item }) => {

    return (
      <View style={styles.resultItem}>
        <TouchableOpacity
          onPress={() => {
            navigation.push('MovieDetailScreen', { movieId: item._id });
          }}>

          <Image
            style={{
              width: '100%',
              height: '75%',

              objectFit: 'cover',
              borderRadius: 10,

            }}
            source={{ uri: IMAGE_API_URL + item.image }}
          />
          <Text numberOfLines={1} style={styles.titleItem}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgXml xml={iconStar()} width={14} height={14} />
            <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>
              {item.rate}.0/5
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgXml xml={iconClock()} width={14} height={14} />
            <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>
              {item.duration}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgXml xml={iconVideo()} width={14} height={14} />
            <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>

              <Text style={styles.infoText}>{item.genre?.map(genre => genre.name).join(', ')}</Text>

            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <SvgXml xml={iconsBack()} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tìm kiếm</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <SvgXml xml={iconSearch()} onPress={() => handleSearch(searchQuery)} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phim..."
            placeholderTextColor="#8C8C8C"
            value={searchQuery}

            onChangeText={handleSearch} // Xử lý thay đổi nội dung tìm kiếm
          />
        </View>
      </View>
      <FlatList
        data={filteredMovieList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} // KeyExtractor phải trả về một string hoặc number duy nhất
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.resultList}
      />

    </SafeAreaView>
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
    padding: 16,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
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
  searchContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
  },
  searchInput: {
    backgroundColor: '#1C1C1C',
    padding: 5,
    marginLeft: 10,
    color: 'white',
    flex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  resultList: {
    paddingBottom: 16,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultItem: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.3,
    flexDirection: 'column',
    backgroundColor: 'black',
    margin: 12,
  },
  titleItem: {
    fontSize: 14,
    color: '#FCC434',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#DEDEDE',
  },
});


export default MovieByGenre;

