import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export  const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
export  const VIDEO_API_URL = 'http://139.180.132.97:3000/videos/';


 export const createApiInstance = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
   return axios.create({
      baseURL: 'http://139.180.132.97:3000', // Thay thế bằng URL của API của bạn
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Thiết lập header Authorization
      },
    });
  } catch (error) {
    console.error('Error creating API instance:', error);
    throw error;
  }
};

// Hàm fetch danh sách phim
export const fetchMovies = async () => {
  try {
    const api = await createApiInstance();
    const url = '/movies'; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
// Hàm fetch danh sách phim

export const fetchMovieById = async (id) => {
  try {
    const api = await createApiInstance();
    const url = '/movies/'+id; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
export const searchMovie = async (name) => {
  try {
    const api = await createApiInstance();
    const url = `/movies/search/name?name=${name}`; // Đường dẫn API để tìm kiếm phim theo tên
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
export const movieByGenre = async (genreId) => {
  try {
    const api = await createApiInstance();
    const url = `/movies/genre?genre=${genreId}`; // Đường dẫn API để tìm kiếm phim theo tên
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchDiscounts= async () => {
  try {
    const api = await createApiInstance();
    const url = '/discounts'; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
export const fetchCinemaByMovie = async (movieId) => {
  try {
    const api = await createApiInstance();
    const url = '/rooms/cinema/'+movieId; 
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
export const fetchRoom = async (roomId) => {
  try {
    const api = await createApiInstance();
    const url = '/rooms/'+roomId; 
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};
export const fetchSeatByRoom = async (roomId) => {
  try {
    const api = await createApiInstance();
    const url = '/seats/room/'+roomId; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error seatbyRoom movies:', error);
    throw error;
  }
};
export const fetchTimeByShowTime = async (showtimeId) => {
  try {
    const api = await createApiInstance();
    const url = '/showtimes/'+showtimeId; 
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching showtimeId:', error);
    throw error;
  }
};
export const fetchStatusSeats = async (roomId, showtimeId, timeId) => {
  try {  const api = await createApiInstance();
    const url = `/seatstatus/seat?roomId=${roomId}&showtimeId=${showtimeId}&timeId=${timeId}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching seat status:', error);
    throw error;
  }
};

// Hàm fetch danh sách thể loại
export const fetchGenres = async () => {
  try {
    const api = await createApiInstance();
    const url = '/genres'; // Đường dẫn API để lấy danh sách thể loại
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
export const fetchGenreById = async (id) => {
  try {
    const api = await createApiInstance();
    const url = '/genres/'+id; // Đường dẫn API để lấy danh sách thể loại
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Hàm fetch danh sách tin tức
export const fetchNews = async () => {
  try {
    const api = await createApiInstance();
    const url = '/news'; // Đường dẫn API để lấy danh sách tin tức
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

