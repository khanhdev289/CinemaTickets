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
    const url = '/movies/no/login'; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data.getall;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
// Hàm fetch danh sách phim

export const fetchMovieById = async (id) => {
  try {
    const api = await createApiInstance();
    const url = '/movies/no/login/'+id; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data.getmovie;
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
    const url = `/movies/no/login/genre/`+genreId; // Đường dẫn API để tìm kiếm phim theo tên
    const response = await api.get(url);
    return response.data.getmovie;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchDiscounts= async () => {
  try {
    const api = await createApiInstance();
    const url = '/discounts/no/login'; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
export const fetchDiscountById= async (id) => {
  try {
    const api = await createApiInstance();
    const url = '/discounts/no/login/'+id; // Đường dẫn API để lấy danh sách phim
    const response = await api.get(url);
    return response.data.getDiscount;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
export const fetchCinemaByMovie = async (movieId) => {
  try {
    const api = await createApiInstance();
    const url = '/rooms/cinema/no/login/'+movieId; 
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchCinemaById = async (cinemaId) => {
  try {
    const api = await createApiInstance();
    const url = '/cinemas/'+cinemaId; 
    const response = await api.get(url);
    return response.data.getCinema;
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
export const fetchShowTimeById = async (showtimeId) => {
  try {
    const api = await createApiInstance();
    const url = '/showtimes/'+showtimeId; 
    const response = await api.get(url);
    return response.data.getShowtime;
  } catch (error) {
    console.error('Error fetching showtimeId:', error);
    throw error;
  }
};
export const fetchTimeById = async (timeId) => {
  try {
    const api = await createApiInstance();
    const url = '/times/'+timeId; 
    const response = await api.get(url);
    return response.data.getTime;
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
    const url = '/genres/no/login'; // Đường dẫn API để lấy danh sách thể loại
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

export const fetchSeatById = async (seatID) => {
  try {
    const api = await createApiInstance();
    const url = '/seats/'+seatID; // Đường dẫn API để lấy danh sách thể loại
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

export const fetchCombo = async () => {
  try {
    const api = await createApiInstance();
    const url = '/foods/user'; // Đường dẫn API để lấy danh sách tin tức
    const response = await api.get(url);
    return response.data.getall;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
}
// tạo vé
export const createTicket = async (seatIds, userId, showdateId, showtimeId, total) => {
  try {
    const api = await createApiInstance();
    const url = '/tickets'; 
    const response = await api.post(url, { seat: seatIds, user: userId, showdate: showdateId, showtime: showtimeId, total });
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};
// Hàm cập nhật thông tin vé
export const updateTicket = async (ticketId, discountId, foodItems, total_food, total) => {
  try {
    const api = await createApiInstance();
    const url = `/tickets/food/${ticketId}`; 

    const response = await api.put(url, {
      discount: discountId, // Có thể là null
      food: foodItems, // Danh sách các đối tượng food với id và quantity
      total_food: total_food, // Tổng số tiền của food
      total: total // Tổng số tiền
    });

    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};
// check discount
export const checkDiscount = async (code,cinemaId) => {
  try {  const api = await createApiInstance();
    const url = `/discounts/check/code?code=${code}&cinemaId=${cinemaId}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error check code:', error);
    throw error;
  }
};


