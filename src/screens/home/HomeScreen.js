import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

import iconNotification from '../../assets/icons/iconNotification';
import iconSearch from '../../assets/icons/iconSearch';
import iconStar from '../../assets/icons/iconStar';
import iconVideo from '../../assets/icons/iconVideo';
import iconCalendar from '../../assets/icons/iconCalendar';

import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { fetchMovies } from '../../../api';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;



const HomeScreen = () => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState([]);
  const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nowPlayingResponse = await fetchMovies();
        setNowPlayingMoviesList(nowPlayingResponse.data);
        console.log(nowPlayingMoviesList.data)

        // const categoriesResponse = await fetchCategories();
        // setCategoryList(categoriesResponse.data);

        // const newsResponse = await fetchNews();
        // setNewsList(newsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 30}).current;

  const renderMovieItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.push('MovieDetailScreen', {movieid: item.id});
      }}>
      <View
        style={{
          marginTop: 50,
          margin: 10,
          display: 'flex',
          flex: 1,
          backgroundColor: 'black',
          maxWidth: 0.5 * screenWidth,
          height: 0.5 * screenHeight,
        }}>
        <Image
          style={{
            aspectRatio: 2 / 3,
            borderRadius: 20,
            width: 0.5 * screenWidth,
          }}
          source={{uri: item.image}}
        />
        <Text
          numberOfLines={1}
          style={{
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
          }}>
          {item.title}
        </Text>
        <View>
          <Text style={styles.moviecategory1}>
            2h29m • Hành động, Phiêu lưu, sci-fi
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgXml xml={iconStar()} />
            <Text style={styles.movieStar}>4.8 (1.222)</Text>

            <Text
              style={{
                fontSize: 14,
                color: 'white',
              }}></Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} bounces={false}>
        <StatusBar hidden />
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Xin Chào, Khải Lê 👋</Text>
          <TouchableOpacity onPress={() => alert('Notification clicked!')}>
            <SvgXml xml={iconNotification()} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <SvgXml xml={iconSearch()} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm phim..."
              placeholderTextColor="#8C8C8C"
              onFocus={() => navigation.navigate('SearchScreeen')}
            />
          </View>
        </View>
        {/* Phim dang chiếu */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Phim đang chiếu</Text>
          <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={nowPlayingMoviesList}
          keyExtractor={item => item.id}
          bounces={false}
          snapToInterval={0.5 * screenWidth}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          contentContainerStyle={{paddingHorizontal: 10}}
          renderItem={({item, index}) => {
            const scale = index === visibleIndex ? 1.2 : 1; // Điều chỉnh kích thước dựa trên khả năng hiển thị
            return (
              <View style={{transform: [{scale}], marginHorizontal: 18}}>
                {renderMovieItem({item})}
              </View>
            );
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Phim sắp chiếu</Text>
          <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={upcomingMoviesList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={styles.movieItem}>
              <TouchableOpacity onPress={() => alert(`Movie ID: ${item.id}`)}>
                <Image
                  style={{
                    width: '100%',
                    height: '75%',
                    aspectRatio: 3 / 4,
                    borderRadius: 10,
                  }}
                  source={{uri: item.poster}}
                />
                <Text style={styles.movieTitle2}>{item.title}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SvgXml xml={iconVideo()} width={14} height={14} />
                  <Text style={{fontSize: 10, marginLeft: 5, color: '#DEDEDE'}}>
                    Adventure, Sci-fi
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <SvgXml xml={iconCalendar()} width={14} height={14} />
                  <Text style={{fontSize: 10, marginLeft: 5, color: '#DEDEDE'}}>
                    20.12.2022
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Khuyến mãi</Text>
          <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            style={{
              width: '90%',
              height: screenHeight * 0.2,
              borderRadius: 10,
            }}
            source={{uri: 'https://via.placeholder.com/150'}}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            margin: 10,
          }}>
          <Text style={styles.categoryTitle}>Thể Loại</Text>
          <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: screenHeight * 0.15,
            backgroundColor: 'black',
            marginLeft: 10,
          }}>
          <FlatList
            data={categoryList}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginLeft: 15,
                  height: screenHeight * 0.15,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity>
                  <Image
                    style={{
                      width: screenHeight * 0.1,
                      height: screenHeight * 0.1,
                      backgroundColor: 'gray',
                      borderRadius: screenHeight * 0.05,
                    }}
                    source={{uri: item.imageUrl}}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#F2F2F2',
                      textAlign: 'center',
                      fontSize: 10,
                      marginTop: 10,
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={styles.categoryTitle}>Tin mới</Text>
          <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={newsList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <View style={styles.movieItemNew}>
              <TouchableOpacity onPress={() => alert(`News ID: ${item.id}`)}>
                <Image
                  style={{
                    width: '100%',
                    height: '75%',
                    aspectRatio: 3 / 2,
                    borderRadius: 10,
                  }}
                  source={{uri: item.poster}}
                />
                <Text
                  style={{
                    color: '#F2F2F2',
                    fontSize: 12,
                    marginTop: 10,
                  }}>
                  When The Batman 2 Starts Filming Reportedly Revealed
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greetingText: {
    fontSize: 20,
    color: '#F2F2F2',
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
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  viewAllText: {
    fontSize: 14,
    color: 'orange',
    textAlign: 'right',
  },
  categoryTitle: {
    fontSize: 22,
    color: 'white',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  movieItemNowPlaying: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    margin: 12,
    marginHorizontal: 24,
  },
  movieItem: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 12,
  },
  movieItemNew: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 12,
  },
  movieTitle: {
    color: '#F2F2F2',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  movieTitle2: {
    color: '#FCC434',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  moviecategory1: {
    color: '#F2F2F2',
    textAlign: 'center',
    fontSize: 12,
  },
  movieStar: {
    color: '#F2F2F2',
    textAlign: 'center',
    fontSize: 10,
  },
});

export default HomeScreen;
