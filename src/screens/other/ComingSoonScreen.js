import {Dimensions, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import iconStar from '../../assets/icons/iconStar';
import iconCalendar from '../../assets/icons/iconCalendar';
import iconVideo from '../../assets/icons/iconVideo';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const ComingSoonScreen = () => {
  const listMovie = [
    { id: '4', title: 'Avatar 2: The Way Of Water', poster: 'https://via.placeholder.com/150' },
    { id: '5', title: 'Movie 5', poster: 'https://via.placeholder.com/150' },
    { id: '6', title: 'Movie 6', poster: 'https://via.placeholder.com/150' },
];
const renderItem = ({ item }) => (
  <View style={styles.item}>
      <Image
          style={{
              width: '100%',
              height: '75%',
              aspectRatio: 3 / 4,
              borderRadius: 10,
          }}
          source={{ uri: item.poster }}
      />
      <Text    numberOfLines={2} style={styles.titleItem}>{item.title}</Text>
    
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SvgXml xml={iconCalendar()} width={14} height={14} />
          <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>20.12.2022</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SvgXml xml={iconVideo()} width={14} height={14} />
          <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>Action, Sci-fi</Text>
        </View>
  </View>
);
  return (
    <SafeAreaView style={styles.container}>

    <FlatList
        data={listMovie}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.resultList}
    />
</SafeAreaView>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingLeft:25,
    backgroundColor: 'black'
},
item: {
  width: screenWidth * 0.4,
  height: screenHeight * 0.3,
  flexDirection: 'column',
  backgroundColor: 'black',
  margin: 10,
},
 titleItem: {
        fontSize: 12,
        color: '#FCC434'
    },

row: {
  flex: 1,
  justifyContent: 'space-between',
},
resultList: {
  paddingBottom: 16,
},
});
