import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export  const IMAGE_API_URL = 'http://139.180.132.97:3000/images/';
// Hàm để lấy token từ AsyncStorage
const getAuthTokenFromSecureStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Tạo instance của Axios với token Authorization
const createApiInstance = async () => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjZmZDIxOWVlMmY0OWI0Nzg4NjNmNDQiLCJyb2xlIjoidXNlciIsImVtYWlsIjoicXVhbmprbDk4QGdtYWlsLmNvbSIsImlhdCI6MTcxODcxNzE4MCwiZXhwIjoxNzE5MzIxOTgwfQ.WOmD83uTVrjGMfswVZz-GeysLwF0MxzmQxvJ_EOwmGs";
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
