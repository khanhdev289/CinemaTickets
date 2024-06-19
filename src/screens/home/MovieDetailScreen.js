import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconStarWhite from '../../assets/icons/iconStarWhite';
import iconPlay from '../../assets/icons/iconPlay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGE_API_URL, fetchMovieById } from '../../../api';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MovieDetailScreen = ({ route }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await fetchMovieById(movieId);
        setMovie(movieResponse.getmovie);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [movieId]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderDirector = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.posterItem} source={{ uri: IMAGE_API_URL + item.image }} />
      <Text style={styles.itemTitle}>{item.name}</Text>
    </View>
  );

  const renderTheater = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedTheater(item.id)}
      style={[
        styles.theaterContainer,
        selectedTheater === item.id ? { borderColor: '#FFD700' } : null,
      ]}
    >
      <Text style={styles.theaterTitle}>{item.title}</Text>
      <Text style={styles.theaterAddress}>Đường Mễ Trì, Mễ Trì, Hà Nội</Text>
    </TouchableOpacity>
  );

  if (!movie) {
    return null; // Hoặc có thể hiển thị một loading indicator tại đây
  }

  const summaryText = movie.storyline;
  const truncatedSummary = summaryText.length > 100 ? summaryText.substring(0, 100) + '...' : summaryText;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image style={styles.poster} source={{ uri: IMAGE_API_URL + movie.image }} />
        <View style={styles.infoOverlay}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{movie.name}</Text>
            <Text style={styles.movieTime}>{movie.duration} • {new Date(movie.release_date).toLocaleDateString()}</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>Đánh giá</Text>
              <SvgXml xml={iconStar()} />
              <Text style={styles.reviewScore}>{movie.rate}.0/5</Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                {[...Array(5)].map((_, index) => (
                  <SvgXml
                    key={index}
                    xml={iconStarWhite()}
                    width={24}
                    height={24}
                    fill={index < movie.rate ? '#FFD700' : '#CCCCCC'}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.trailerButton} onPress={() => console.log('Watch Trailer')}>
                <SvgXml xml={iconPlay()} />
                <Text style={styles.trailerButtonText}>Xem Trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
          <Text style={styles.infoText}>Thể loại: {movie.genre.map(genre => genre.name).join(', ')}</Text>
          <Text style={styles.infoText}>Độ tuổi: {movie.censorship}</Text>
          <Text style={styles.infoText}>Ngôn ngữ: {movie.language}</Text>
        </View>

        <Text style={styles.summaryTitle}>Tóm tắt</Text>
        <Text style={styles.summaryText}>
          {isExpanded ? summaryText : truncatedSummary}
          {!isExpanded && summaryText.length > 100 && (
            <Text style={styles.readMoreText} onPress={handleToggleExpand}>
              {' '}
              Xem thêm
            </Text>
          )}
        </Text>
        {isExpanded && (
          <Text style={styles.readMoreText} onPress={handleToggleExpand}>
            {' '}
            Thu gọn
          </Text>
        )}

        <Text style={styles.summaryTitle}>Đạo diễn</Text>
        <FlatList
          data={movie.director}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <Text style={styles.summaryTitle}>Diễn viên</Text>
        <FlatList
          data={movie.actor}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <Text style={styles.summaryTitle}>Các rạp chiếu</Text>
        <FlatList
          data={movie.theaters}
          keyExtractor={(item) => item.id}
          renderItem={renderTheater}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <TouchableOpacity style={styles.button} onPress={() => console.log('Continue pressed')}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 8,
  },
  poster: {
    width: '100%',
    height: screenHeight * 0.25,
    resizeMode: 'cover',
  },
  infoOverlay: {
    marginTop: -50,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#1C1C1C',
    borderRadius: 20,
  },
  infoContainer: {
    backgroundColor: '#1C1C1C',
    marginTop: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  movieTime: {
    fontSize: 14,
    color: '#BFBFBF',
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  reviewScore: {
    color: 'white',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  rating: {
    flexDirection: 'row',
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  trailerButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#F2F2F2',
    marginBottom: 5,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#F2F2F2',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  readMoreText: {
    color: '#FFD700',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
borderRadius: 10,
marginHorizontal: 10,
padding: 10,
alignItems: 'center',
backgroundColor: '#1C1C1C',
  },
  posterItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 5,
    resizeMode:'stretch'
    },
    itemTitle: {
    color: 'white',
    textAlign: 'center',
    },eaterContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  theaterTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  theaterAddress: {
    color: '#BFBFBF',
    fontSize: 14,
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
});

export default MovieDetailScreen;
