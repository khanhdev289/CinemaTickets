import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, Modal, Alert } from 'react-native';

import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import iconStar from '../../assets/icons/iconStar';
import iconStarWhite from '../../assets/icons/iconStarWhite';
import iconPlay from '../../assets/icons/iconPlay';

import { ScrollView } from 'react-native-virtualized-view'
import { IMAGE_API_URL, VIDEO_API_URL, fetchCinemaByMovie, fetchMovieById } from '../../../api';
import iconBack from '../../assets/icons/iconBack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../components/AuthProvider ';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MovieDetailScreen = ({ route }) => {
  const { movieId } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const navigation = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieResponse = await fetchMovieById(movieId);
        const theaterResponse = await fetchCinemaByMovie(movieId);
        setMovie(movieResponse);
        setTheaters(theaterResponse);
        console.log(movieResponse + "kkk" + theaterResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

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
      onPress={() => setSelectedTheater(item._id)}
      style={[
        styles.theaterContainer,
        selectedTheater === item._id ? { borderColor: '#FFD700' } : null,
      ]}
    ><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.theaterTitle}>{item.cinema.name}</Text>
          <Text style={styles.theaterAddress}>{item.cinema.address}</Text>
        </View>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: 80, // Điều chỉnh kích thước hình ảnh theo nhu cầu của bạn
            height: 80, // Điều chỉnh kích thước hình ảnh theo nhu cầu của bạn
            resizeMode: 'stretch',

          }}
        />
      </View>
    </TouchableOpacity>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b731" />
      </View>
    );
  }

  if (!movie) {
    return null; // Or display a message indicating no movie data available
  }

  const summaryText = movie.storyline || '';
  const truncatedSummary = summaryText.length > 100 ? `${summaryText.substring(0, 100)}...` : summaryText;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <SvgXml xml={iconBack()} />
        </TouchableOpacity>

        <Image style={styles.poster} source={{ uri: IMAGE_API_URL + movie.image }} />
        <View style={styles.infoOverlay}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{movie.name}</Text>
            <Text style={styles.movieTime}>{movie.duration} • {formatDate(movie.release_date)}</Text>
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
                    xml={index < movie.rate ? iconStar() : iconStarWhite()}
                    width={24}
                    height={24}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.trailerButton} onPress={() => setIsModalVisible(true)}>
                <SvgXml xml={iconPlay()} />
                <Text style={styles.trailerButtonText}>Xem Trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>Thể loại: {movie.genre?.map(genre => genre.name).join(', ')}</Text>
          <Text style={styles.infoText}>Độ tuổi: {movie.censorship}</Text>
          <Text style={styles.infoText}>Ngôn ngữ: {movie.language}</Text>
        </View>
        <Text style={styles.summaryTitle}>Tóm tắt</Text>
        <Text style={styles.summaryText}>
          {isExpanded ? summaryText : truncatedSummary}
          {!isExpanded && summaryText.length > 100 && (
            <Text style={styles.readMoreText} onPress={handleToggleExpand}>
              {' '} Xem thêm
            </Text>
          )}
        </Text>
        {isExpanded && (
          <Text style={styles.readMoreText} onPress={handleToggleExpand}>
            {' '} Thu gọn
          </Text>
        )}
        <Text style={styles.summaryTitle}>Đạo diễn</Text>
        <FlatList
          data={movie.director || []}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
        <Text style={styles.summaryTitle}>Diễn viên</Text>
        <FlatList
          data={movie.actor || []}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
        {movie.release_status !== 'sc' && (
          <>
            <Text style={styles.summaryTitle}>Các rạp chiếu</Text>
            <FlatList
              data={theaters || []}
              keyExtractor={(item) => item._id}
              renderItem={renderTheater}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (!user) {
                  // Nếu chưa đăng nhập, điều hướng tới màn hình đăng nhập
                  navigation.navigate('Login');
                  return;
                }

                if (selectedTheater) {
                  // Nếu đã chọn rạp chiếu, điều hướng tới màn hình chọn ghế
                  navigation.navigate('SelectSeatScreen', { roomId: selectedTheater });
                } else {
                  // Xử lý trường hợp không có rạp nào được chọn
                  Alert.alert('Thông báo', 'Vui lòng chọn một rạp chiếu');
                }
              }}
            >
              <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>

          </>
        )}


      </ScrollView>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Video
              source={{ uri: VIDEO_API_URL + movie.trailer }}
              style={styles.video}
              controls={true}
              resizeMode="stretch"
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    resizeMode: 'stretch',

  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,

    zIndex: 1,

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
  additionalInfo: {
    marginVertical: 10,
    paddingHorizontal: 10,
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
    resizeMode: 'stretch',
  },
  itemTitle: {
    color: 'white',
    textAlign: 'center',
  },
  theaterContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,

    margin: 16,

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: screenWidth * 0.9,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  video: {
    width: '100%',
    height: screenHeight * 0.3,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#FCC434',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '20%',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default MovieDetailScreen;
