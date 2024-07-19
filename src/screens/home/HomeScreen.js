import React, { useEffect, useRef, useState } from 'react';
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
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import iconNotification from '../../assets/icons/iconNotification';
import iconSearch from '../../assets/icons/iconSearch';
import iconStar from '../../assets/icons/iconStar';
import iconVideo from '../../assets/icons/iconVideo';
import iconCalendar from '../../assets/icons/iconCalendar';
import { IMAGE_API_URL, fetchDiscounts, fetchGenres, fetchMovies } from '../../../api';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { useAuth } from '../../components/AuthProvider ';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;



const newsList = [
  { id: '7', title: 'News 1', poster: 'https://via.placeholder.com/150' },
  { id: '8', title: 'News 2', poster: 'https://via.placeholder.com/150' },
  { id: '9', title: 'News 3', poster: 'https://via.placeholder.com/150' },
];

const HomeScreen = () => {
  const {user} = useAuth();
  
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState([]);
  const [comingMoviesList, setcomingMoviesList] = useState([]);
  const [discountList, setDiscountList] = useState([]);
  const [genreList, setGenreList] = useState([]);

  const [visibleIndex, setVisibleIndex] = useState(0);
  const flatListRef = useRef(null);


  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 }).current;

  const fetchData = async () => {
    try {
      const nowPlayingResponse = await fetchMovies();
      const discountsReponse = await fetchDiscounts();
      const genreReponse=await fetchGenres();

      const allMovies = nowPlayingResponse.getall;

      const nowPlaying = allMovies.filter(movie => movie.release_status === 'dc');
      const comingSoon = allMovies.filter(movie => movie.release_status === 'sc');

      setNowPlayingMoviesList(nowPlaying);
      setcomingMoviesList(comingSoon);
      setDiscountList(discountsReponse.getall);
      setGenreList(genreReponse)
   
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b731" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} bounces={false}>
        <StatusBar hidden />
        <Header user={user} />
        <SearchBar navigation={navigation} />
        <Section title="Phim đang chiếu" onPress={() => {navigation.navigate('MovieScreen')}} />
        <MovieList
          data={nowPlayingMoviesList}
          flatListRef={flatListRef}
          renderItem={({ item, index }) => (
            <MovieItem
              item={item}
              index={index}
              visibleIndex={visibleIndex}
              navigation={navigation}
            />
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewConfigRef={viewConfigRef}
        />

        <Section title="Phim sắp chiếu" onPress={() => {navigation.navigate('MovieScreen')}} />
        <FlatList
          data={comingMoviesList}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}

          renderItem={({ item }) => <UpcomingMovieItem item={item}    navigation={navigation} />}

        />

        <Section title="Khuyến mãi" onPress={() => alert('Xem tất cả clicked!')} />
        
          <SwiperFlatList
           keyExtractor={item =>item._id}
            autoplay
            autoplayDelay={2}
            autoplayLoop
            showPagination={false}
            data={discountList}
           renderItem={({ item }) => <DiscountItem item={item}/> }
          />
  
        <Section title="Thể Loại" onPress={() => alert('Xem tất cả clicked!')} />
        <FlatList
          data={genreList}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <CategoryItem item={item} navigation={navigation}/>}
        />
{/* 
        <Section title="Tin mới" onPress={() => alert('Xem tất cả clicked!')} />
        <FlatList
          data={newsList}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <NewsItem item={item} />}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const Header = ({user}) => (
  <View style={styles.headerContainer}>
    <Text style={styles.greetingText}>Xin Chào, {user.user.name} 👋</Text>
    <TouchableOpacity onPress={() => alert('Notification clicked!')}>
      <SvgXml xml={iconNotification()} />
    </TouchableOpacity>
  </View>
);

const SearchBar = ({ navigation }) => (
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
);

const Section = ({ title, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.categoryTitle}>{title}</Text>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.viewAllText}>Xem tất cả</Text>
    </TouchableOpacity>
  </View>
);

const MovieList = ({ data, flatListRef, renderItem, onViewableItemsChanged, viewConfigRef }) => (
  <FlatList
    ref={flatListRef}
    data={data}
    keyExtractor={item => item._id}
    snapToAlignment="start"
    snapToInterval={0.6 * screenWidth} // 
    decelerationRate="fast"
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: screenWidth * 0.15 }} // Padding to center the first and last item
    renderItem={renderItem}
    onViewableItemsChanged={onViewableItemsChanged}
    viewabilityConfig={viewConfigRef}
    snapToEnd={false}
  />
);


const MovieItem = ({ item, index, visibleIndex, navigation }) => {
  const scale = index === visibleIndex ? 1.2 : 1;
  return (
    <TouchableOpacity
      onPress={() => {

        navigation.navigate('MovieDetailScreen', { movieId: item._id });

      }}>
      <View
        style={[
          styles.movieItemNowPlaying,
          {
            transform: [{ scale }],
          },
        ]}>
        <Image
          style={styles.movieImage}
          source={{ uri: IMAGE_API_URL + item.image }}
        />
        <Text
          numberOfLines={1}
          style={styles.movieTitle}>
          {item.name}
        </Text>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.movieCategory}>
              {item.duration} • </Text>
         
            <Text style={styles.movieCategory}>{item.genre.map(g => g.name).join(', ')}</Text>
          
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgXml xml={iconStar()} />
            <Text style={styles.movieStar}>{item.rate}.0/5</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const formatDate = (dateString) => {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};


const UpcomingMovieItem = ({ item,navigation }) => {
  const formattedDate = formatDate(item.release_date);
  return(
  <View style={styles.movieItem}>
   <TouchableOpacity
      onPress={() => {
        navigation.navigate('MovieDetailScreen', { movieId: item._id });
      }}>

      <Image
        style={styles.upcomingMovieImage}
        source={{ uri: IMAGE_API_URL + item.image }}
      />
      <Text style={styles.movieTitle2}>{item.name}</Text>
      <View style={styles.movieDetailRow}>
        <SvgXml xml={iconVideo()} width={14} height={14} />
        <Text style={styles.movieDetailText}> {item.duration} • </Text>
        <Text style={styles.movieDetailText}>{item.genre.map(g => g.name).join(', ')}</Text>
      </View>
      <View style={styles.movieDetailRow}>
        <SvgXml xml={iconCalendar()} width={14} height={14} />
        <Text style={styles.movieDetailText}> {formattedDate}</Text>
      </View>
    </TouchableOpacity>
  </View>)
};
const DiscountItem = ({ item }) => (
  <View style={styles.discountItem}>
    <TouchableOpacity onPress={() => alert(`Movie ID: ${item._id}`)}>
      <Image
        style={styles.discountImage}
        source={{ uri: IMAGE_API_URL + item.image }}
      />
    </TouchableOpacity>
  </View>
);

const CategoryItem = ({ item,navigation }) => (
  <View style={styles.categoryItem}>
    <TouchableOpacity  onPress={() => {
        navigation.navigate('MovieByGenre', { genreId: item._id });
      }}>
      <Image
        style={styles.categoryImage}
        source={{ uri: IMAGE_API_URL+item.image }}
      />
      <Text numberOfLines={1} style={{fontSize:14,color:"#F2F2F2",textAlign:'center',margin:5}}>
        {item.name}
      </Text>
    </TouchableOpacity>
  </View>
);

// const NewsItem = ({ item }) => (
//   <View style={styles.movieItemNew}>
//     <TouchableOpacity onPress={() => alert(`News ID: ${item.id}`)}>
//       <Image
//         style={styles.newsImage}
//         source={{ uri: item.poster }}
//       />
//       <Text style={styles.newsTitle}>
//         When The Batman 2 Starts Filming Reportedly Revealed
//       </Text>
//     </TouchableOpacity>
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greetingText: {
    fontSize: 16,
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
  sectionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  movieItemNowPlaying: {
    marginTop: 20,
    marginHorizontal: 20,
    display: 'flex',
    flex: 1,
    backgroundColor: 'black',
    maxWidth: 0.5 * screenWidth,
    height: 0.5 * screenHeight
  },
  movieImage: {
    marginTop: 20,
    aspectRatio: 2 / 3,
    borderRadius: 20,
    width: 0.5 * screenWidth,
  },
  movieTitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#F2F2F2',
    textAlign: 'center',
  },
  movieCategory: {
    color: '#BFBFBF',
    textAlign: 'center',
    fontSize: 12,

  },
  movieStar: {
    color: '#BFBFBF',
    textAlign: 'center',
    fontSize: 10,
  },
  movieInfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movieItem: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 5,
  },
  discountItem: {
    width: screenWidth*0.9 ,
    height: screenHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    padding:5,
    margin:5
   
  },
  upcomingMovieImage: {
    width: '100%',
    height: '75%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
  },
  discountImage: {
    width: '100%',
    height: '100%',
    resizeMode:'cover',
    aspectRatio: 2,
    borderRadius: 10,
   
  },
  movieTitle2: {
    color: '#FCC434',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  movieDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieDetailText: {
    fontSize: 10,
    marginLeft: 5,
    color: '#DEDEDE',
  },
  promotionImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    resizeMode:'cover',
    borderRadius:10
  },
  categoryItem: {
    padding:5,
    margin:5,
    height: screenHeight * 0.11,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: screenHeight * 0.08,
    height: screenHeight * 0.08,
    backgroundColor: 'gray',
    borderRadius: screenHeight * 0.04,
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
  newsImage: {
    width: '100%',
    height: '75%',
    aspectRatio: 3 / 2,
    borderRadius: 10,
  },
  newsTitle: {
    color: '#F2F2F2',
    fontSize: 12,
    marginTop: 10,
  },
});

export default HomeScreen;
