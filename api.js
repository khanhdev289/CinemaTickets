import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Tạo instance của Axios
const createApiInstance = async () => {
  const token = await getAuthTokenFromSecureStorage();
  return axios.create({
    baseURL: 'http://139.180.132.97:3000', // Thay thế bằng URL của API của bạn
    headers: {
      Authorization: `Bearer ${token}`, // Thiết lập header Authorization
    },
  });
};

// Các hàm để gọi API
export const fetchMovies = async () => {
  const api = await createApiInstance();
  return api.get('http://139.180.132.97:3000/movies');
};

export const fetchCategories = async () => {
  const api = await createApiInstance();
  return api.get('/categories');
};

export const fetchNews = async () => {
  const api = await createApiInstance();
  return api.get('/news');
};

// Bạn có thể thêm các hàm khác tương tự
