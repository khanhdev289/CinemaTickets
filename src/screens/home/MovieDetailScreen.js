import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ScrollView, Button } from 'react-native';
import { SvgXml } from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconStarWhite from '../../assets/icons/iconStarWhite';
import iconPlay from '../../assets/icons/iconPlay';
import { SafeAreaView } from 'react-native-safe-area-context';



const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MovieDetailScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const directorList = [
    { id: '1', title: 'Anthony Russo', poster: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Movie 2', poster: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Movie 3', poster: 'https://via.placeholder.com/150' },
  ];
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const summaryText = 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.';
  const truncatedSummary = summaryText.length > 100 ? summaryText.substring(0, 100) + '...' : summaryText;
  const renderDirector = ({ item }) => (
    <View style={styles.itemContainerDirector}>
      <Image style={styles.posterItem} source={{ uri: item.poster }} />
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
  );
  const renderTheater = ({ item }) => (
    <View style={{
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      margin:10, padding:10, width: '90%'
    }}>
      <Text style={styles.itemTitle}>Mỹ Đình Theater</Text>
      <Text>Đường Mễ Trì,Mễ Trì,Hà Nội;</Text>
    </View>
  );
  return (

    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          style={styles.poster}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
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
                fill={index < 5 ? "#FFD700" : "#CCCCCC"}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.trailerButton}
            onPress={() => {
              // Xử lý sự kiện khi nhấn nút xem trailer
            }}
            accessibilityLabel="Watch Trailer"
          >
            <SvgXml xml={iconPlay()} />
            <Text style={styles.trailerButtonText}>Xem Trailer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Thể loại: </Text>
          <Text style={styles.infoText}>Độ tuổi: </Text>
          <Text style={styles.infoText}>Ngôn ngữ: </Text>
        </View>

        <Text style={styles.summaryTitle}>Tóm Tắt</Text>
        <Text style={styles.summaryText}>
          {isExpanded ? summaryText : truncatedSummary}
          {!isExpanded && summaryText.length > 100 && (
            <Text style={styles.readMoreText} onPress={handleToggleExpand}> Xem thêm</Text>
          )}
        </Text>
        {isExpanded && (
          <Text style={styles.readMoreText} onPress={handleToggleExpand}> Thu gọn</Text>
        )}
        <Text style={styles.summaryTitle}>Nhà sản xuất</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
        />
        <Text style={styles.summaryTitle}>Diễn viên</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderDirector}
        />
        <Text style={styles.summaryTitle}>Các cụm rạp</Text>
        <FlatList
          data={directorList}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={renderTheater}
        />
      <TouchableOpacity style={styles.button} >
    <Text style={styles.buttonText}>Tiếp tục</Text>
  </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>


  );
};

export default MovieDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black'
  },
  poster: {
    width: '100%',
    height: screenHeight * 0.2,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 8,
  },
  movieTime: {
    fontSize: 12,
    color: '#BFBFBF',
    marginBottom: 20,
  },
  reviewContainer: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
  },
  reviewText: {
    color: 'white',
    marginHorizontal: 10,
    fontSize: 14,
  },
  reviewScore: {
    color: 'white',
    marginHorizontal: 5,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  rating: {
    flexDirection: 'row',
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  trailerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#BFBFBF',
  },
  infoContainer: {
    margin: 20,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#F2F2F2',
  },
  summaryTitle: {
    fontSize: 22,
    marginVertical: 10,
    color: 'white',
  },
  summaryText: {
    fontSize: 14,
    color: '#F2F2F2',
  },
  readMoreText: {
    color: '#FFD700',
    fontSize: 14,
  },
  itemContainerDirector: {
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
  },
  itemTitle: {
    marginLeft: 10,
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20, // Đây là nơi bạn có thể điều chỉnh góc bo tròn
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
