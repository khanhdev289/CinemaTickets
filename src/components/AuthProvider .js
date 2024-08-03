import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = userData => {
    setUser(userData);
    AsyncStorage.setItem('token', userData.token.access_token);
  };

  const handleBookingPress = () => {
    if (user) {
      // Nếu người dùng đã đăng nhập, điều hướng tới màn hình đặt vé
      navigation.navigate('BookingScreen', );
    } else {
      // Nếu chưa đăng nhập, điều hướng tới màn hình đăng nhập
      navigation.navigate('LoginScreen');
    }
  };
  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('password');
    AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
