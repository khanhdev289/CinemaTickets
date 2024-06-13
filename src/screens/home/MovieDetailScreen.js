import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconStarWhite from '../../assets/icons/iconStarWhite';
import iconPlay from '../../assets/icons/iconPlay';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const MovieDetailScreen = () => {
  const nowPlayingMoviesList = [
    { id: '1', title: 'AvengersAvengers - Infinity War', poster: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Movie 2', poster: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Movie 3', poster: 'https://via.placeholder.com/150' },
  ];
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: '100%',
          height: screenHeight * 0.2,

        }} source={{ uri: 'https://via.placeholder.com/150' }} />
      <Text style={styles.title}>Avengers: Infinity War</Text>
      <Text style={styles.movieTime}>2h29m • 16.12.2022</Text>
      <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
        <Text style={{ color: 'white', marginHorizontal: 10, fontSize: 14 }}>Review</Text>
        <SvgXml xml={iconStar()} />
        <Text style={{ color: 'white', marginHorizontal: 5, fontSize: 12 }}>4.8 (1.222)</Text>
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


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
        <TouchableOpacity style={styles.trailerButton} onPress={() => {
          // Điều hướng hoặc hành động để xem trailer
        }}>
          <SvgXml xml={iconPlay()} />
          <Text style={styles.trailerButtonText}>Xem Trailer</Text>
        </TouchableOpacity>
      </View>
      {/* Thể loại, độ tuổi và ngôn ngữ */}
      <View style={{margin:20}}>
        <Text style={styles.infoText}>Thể loại: </Text>
        <Text style={styles.infoText}>Độ tuổi: </Text>
        <Text style={styles.infoText}>Ngôn ngữ: </Text>
      </View>

    <Text style={{fontSize:22,marginVertical:10,color:'white'}}>Tóm Tắt</Text>
    <Text style={{fontSize:14,color:'#F2F2F2'}} >As the Avengers and their allies have continued to protect
       the world from threats too large for any one hero to handle, a new danger 
       has emerged from the cosmic shadows: Thanos.... Xem thêm</Text>


    </View>
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
  title: {
    fontSize: 20,
    color: 'white'
  }, movieTime: {
    fontSize: 12,
    color: '#BFBFBF'
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
  rating: {
    flexDirection: 'row'
  },
  infoText:{
    fontSize: 14,
    marginVertical: 5,
    color:'#F2F2F2'
  }
});
