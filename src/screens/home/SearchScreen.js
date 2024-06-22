import React, { useState } from 'react';
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
import axios from 'axios';  // Import axios for making HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';
import iconBack from '../../assets/icons/iconBack';
import iconSearch from '../../assets/icons/iconSearch';
import iconStar from '../../assets/icons/iconStar';
import iconVideo from '../../assets/icons/iconVideo';
import iconClock from '../../assets/icons/iconClock';
import { IMAGE_API_URL, fetchGenreById, searchMovie } from '../../../api';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const SearchScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Hàm xử lý tìm kiếm phim
  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      // Đường dẫn API để tìm kiếm phim theo tên
      const response = await searchMovie(query);
      setSearchResults(response.getmovie || []); // Đảm bảo searchResults luôn là một mảng
    } catch (error) {
      console.error('Error searching movies:', error);
      // Xử lý lỗi nếu cần
    } finally {
      setIsLoading(false);
    }
  };

  const renderSearchResult = async ({ item }) => {
    const nameGenre = await fetchGenreById(item.genre);
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
              borderRadius: 10,
              objectFit:'cover'
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
              {nameGenre.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <SvgXml xml={iconBack()} />
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
            onChangeText={text => setSearchQuery(text)}
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f7b731" />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultList}
          ListEmptyComponent={!searchQuery ? null : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>Không có kết quả</Text>
            </View>
          )}
        />
      )}
    </View>
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
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
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

export default SearchScreen;
