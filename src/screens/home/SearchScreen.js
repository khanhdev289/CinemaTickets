
import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import iconBack from '../../assets/icons/iconBack';
import iconSearch from '../../assets/icons/iconSearch';
import iconStar from '../../assets/icons/iconStar';
import iconCalendar from '../../assets/icons/iconCalendar';
import iconVideo from '../../assets/icons/iconVideo';
import iconClock from '../../assets/icons/iconClock';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const SearchScreeen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        // Xử lý tìm kiếm và cập nhật kết quả tìm kiếm
        const results = mockSearchFunction(query);
        setSearchResults(results);
    };

    const mockSearchFunction = (query) => {
        // Giả lập kết quả tìm kiếm (sẽ thay bằng API thực tế)
        return [
            { id: '1', title: 'AvengersAvengers - Infinity War', poster: 'https://via.placeholder.com/150' },
            { id: '2', title: 'Movie 2', poster: 'https://via.placeholder.com/150' },
            { id: '3', title: 'Movie 3', poster: 'https://via.placeholder.com/150' },

            // Thêm kết quả khác nếu cần
        ];
    };

    const listSearch = [
        { id: '4', title: 'Avatar 2: The Way Of Water', poster: 'https://via.placeholder.com/150' },
        { id: '5', title: 'Movie 5', poster: 'https://via.placeholder.com/150' },
        { id: '6', title: 'Movie 6', poster: 'https://via.placeholder.com/150' },
    ];

    const renderSearchResult = ({ item }) => (
        <View style={styles.resultItem}>
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
                <SvgXml xml={iconStar()} width={14} height={14} />
                <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>4.0 (982)</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgXml xml={iconClock()} width={14} height={14} />
                <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>2 hour 5 minutes</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgXml xml={iconVideo()} width={14} height={14} />
                <Text style={{ fontSize: 12, marginLeft: 5, color: '#DEDEDE' }}>Action, Sci-fi</Text>
              </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => alert('Back pressed')}>
                    <SvgXml xml={iconBack()} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Tìm kiếm</Text>
                </View>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <SvgXml xml={iconSearch()} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm phim..."
                        placeholderTextColor="#8C8C8C"
                    // onFocus={() => navigation.navigate('SearchScreeen')}
                    />
                </View>
            </View>
            <FlatList
                data={listSearch}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.resultList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'black'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
        color: 'white'

    },

    searchContainer: {
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#1C1C1C'
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
        padding: 5
    },
    resultList: {
        paddingBottom: 16,
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
    },
    resultItem: {
        width: screenWidth * 0.4,
        height: screenHeight * 0.3,
        flexDirection: 'column',
        backgroundColor: 'black',
        margin: 12
    },
    titleItem: {
        fontSize: 14,
        color: '#FCC434'
    }
});

export default SearchScreeen;
