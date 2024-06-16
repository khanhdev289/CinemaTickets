import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconStarWhite from '../../assets/icons/iconStarWhite';
import iconPlay from '../../assets/icons/iconPlay';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MovieDetailScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);

  const directorList = [
    { id: '1', title: 'Anthony Russo', poster: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Movie 2', poster: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Movie 3', poster: 'https://via.placeholder.com/150' },
  ];

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const summaryText =
    'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.';
  const truncatedSummary = summaryText.length > 100 ? summaryText.substring(0, 100) + '...' : summaryText;

  const renderDirector = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.posterItem} source={{ uri: item.poster }} />
      <Text style={styles.itemTitle}>{item.title}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image style={styles.poster} source={{ uri: 'https://via.placeholder.com/150' }} />
        <View style={styles.infoOverlay}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Avengers: Infinity War</Text>
            <Text style={styles.movieTime}>2h29m • 16.12.2022</Text>
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>Review</Text>
              <SvgXml xml={iconStar()} />
              <Text style={styles.reviewScore}>4.8 (1,222)</Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                {[...Array(5)].map((_, index) => (
                  <SvgXml
                    key={index}
                    xml={iconStarWhite()}
                    width={24}
                    height={24}
                    fill={index < 5 ? '#FFD700' : '#CCCCCC'}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.trailerButton}>
                <SvgXml xml={iconPlay()} />
                <Text style={styles.trailerButtonText}>Xem Trailer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View >
          <Text style={styles.infoText}>Thể loại: Hành động, Phiêu lưu, Siêu anh hùng</Text>
          <Text style={styles.infoText}>Độ tuổi: 13+</Text>
          <Text style={styles.infoText}>Ngôn ngữ: Tiếng Anh, Tiếng Việt (phụ đề)</Text>
        </View>

        <Text style={styles.summaryTitle}>Tóm Tắt</Text>
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

        <Text style={styles.summaryTitle}>Nhà sản xuất</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <Text style={styles.summaryTitle}>Diễn viên</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />

        <Text style={styles.summaryTitle}>Các cụm rạp</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          renderItem={renderTheater}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
        <TouchableOpacity style={styles.button} onPress={() => console.log('Button pressed')}>
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
    padding:8
  },
  poster: {
    width: '100%',
    height: screenHeight * 0.25,
    resizeMode: 'cover',
  },
  infoOverlay: {
    marginTop: -50, 
    marginHorizontal:16,
    marginBottom:20,
    padding: 16,
    backgroundColor: '#1C1C1C',
   borderRadius:20,
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
    borderRadius: 5,borderWidth:1,borderColor:'white'
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
  },
  summaryText: {
    fontSize: 16,
    color: '#F2F2F2',
    lineHeight: 24,
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
    marginRight:5
  },
  itemTitle: {
    color: 'white',
    textAlign: 'center',
  },
  theaterContainer: {
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
