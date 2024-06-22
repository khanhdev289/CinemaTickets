import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgXml} from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconCalendar from '../../assets/icons/iconCalendar';
import iconVideo from '../../assets/icons/iconVideo';
import iconClock from '../../assets/icons/iconClock';
import { IMAGE_API_URL, fetchMovies } from '../../../api';
import { useNavigation } from '@react-navigation/native';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const NowPlayingScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [listMovie, setListMovie] = useState([]);
 const fetchData =async ()=>{
  try {
    const movieResponse=await fetchMovies();
    const allMovies = movieResponse.getall;
    const nowPlaying = allMovies.filter(movie => movie.release_status === 'dc');
    setListMovie(nowPlaying);

  } catch (error) {
    
  }
 finally {
  setIsLoading(false);
}
 }
 useEffect(() => {
  fetchData();
}, []);

  const renderItem = ({item}) => (

    <View style={styles.item}>
       <TouchableOpacity
          onPress={() => {
            navigation.navigate('MovieDetailScreen', { movieId: item._id });
          }}>
      <Image
        style={{
          width: '100%',
          height: '75%',
          objectFit:'cover',
          borderRadius: 10,
        }}
        source={{uri: IMAGE_API_URL+item.image}}
      />
      <Text numberOfLines={1} style={styles.titleItem}>
        {item.name}
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SvgXml xml={iconStar()} width={14} height={14} />
        <Text style={{fontSize: 12, marginLeft: 5, color: '#DEDEDE'}}>
         {item.rate}.0/5
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SvgXml xml={iconClock()} width={14} height={14} />
        <Text style={{fontSize: 12, marginLeft: 5, color: '#DEDEDE'}}>
      {item.duration}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SvgXml xml={iconVideo()} width={14} height={14} />
        <Text style={{fontSize: 12, marginLeft: 5, color: '#DEDEDE'}}>
        {item.genre.map(g => g.name).join(', ')}
        </Text>
      </View>
      </TouchableOpacity>
    </View>
  );
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b731" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listMovie}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.resultList}
      />
    </SafeAreaView>
  );
};

export default NowPlayingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingLeft: 25,
    backgroundColor: 'black',
  },
  item: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.3,
    flexDirection: 'column',
    backgroundColor: 'black',
    margin: 10,
  },
  titleItem: {
    marginTop:10,
    fontSize: 14,
    color: '#FCC434',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultList: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});
