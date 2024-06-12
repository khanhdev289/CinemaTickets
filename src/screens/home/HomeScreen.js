import React from 'react';
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

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

// Sample data
const nowPlayingMoviesList = [
  {
    id: '1',
    title: 'AvengersAvengers - Infinity War',
    poster: 'https://via.placeholder.com/150',
  },
  {id: '2', title: 'Movie 2', poster: 'https://via.placeholder.com/150'},
  {id: '3', title: 'Movie 3', poster: 'https://via.placeholder.com/150'},
];

const upcomingMoviesList = [
  {
    id: '4',
    title: 'Avatar 2: The Way Of Water',
    poster: 'https://via.placeholder.com/150',
  },
  {id: '5', title: 'Movie 5', poster: 'https://via.placeholder.com/150'},
  {id: '6', title: 'Movie 6', poster: 'https://via.placeholder.com/150'},
];
const categoryList = [
  {
    id: '1',
    title: 'Item 1',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    title: 'Item 2',
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Item 3',
    imageUrl: 'https://via.placeholder.com/150',
  },
];
const newsList = [
  {id: '7', title: 'News 1', poster: 'https://via.placeholder.com/150'},
  {id: '8', title: 'News 2', poster: 'https://via.placeholder.com/150'},
  {id: '9', title: 'News 3', poster: 'https://via.placeholder.com/150'},
];

const HomeScreen = ({navigation}) => {
  const searchMoviesFunction = () => {
    navigation.navigate('MyTickets');
  };

  return (
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
            placeholderTextColor="#1C1C1C"
            onFocus={searchMoviesFunction}
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
        data={nowPlayingMoviesList}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={styles.movieItemNowPlaying}>
            <TouchableOpacity>
              <Image
                style={{
                  width: '100%',
                  height: '80%',
                  borderRadius: 10,
                  backgroundColor: 'gray',
                }}
                source={{uri: item.poster}}
              />
              <Text numberOfLines={1} style={styles.movieTitle}>
                {item.title}
              </Text>
              <Text style={styles.moviecategory1}>
                2h29m • Hành động, Phiêu lưu, sci-fi
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <SvgXml xml={iconStar()} />
                <Text style={styles.movieStar}>4.8 (1.222)</Text>
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
                  borderRadius: 10,
                  backgroundColor: 'gray',
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
      <Image
        style={{
          width: '100%',
          height: screenHeight * 0.2,
          borderRadius: 10,
          margin: 16,
        }}
        source={{uri: 'https://via.placeholder.com/150'}}
      />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Text style={styles.categoryTitle}>Thể Loại</Text>
        <TouchableOpacity onPress={() => alert('Xem tất cả clicked!')}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          height: screenHeight * 0.1,
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
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: 'gray',
                    borderRadius: 30,
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
      <Text style={styles.categoryTitle}>Tin mới</Text>
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
                  height: '70%',
                  borderRadius: 10,
                  backgroundColor: 'gray',
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'darkgray',
    borderRadius: 10,
    padding: 5,
    color: 'white',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'darkgray',
    borderRadius: 10,
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
    backgroundColor: 'gray',
    borderRadius: 10,
    margin: 12,
  },
  movieItemNew: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
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
