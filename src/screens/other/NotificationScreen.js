import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import iconsBack from '../../assets/icons/iconsBack';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuth} from '../../components/AuthProvider ';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userID = user.user._id;
        const token = user.token.access_token;
        const response = await axios.get(
          `http://139.180.132.97:3000/notification/notifi/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const sortedNotifications = response.data.getnotification.sort(
          (a, b) => new Date(b.date) - new Date(a.date), // Sắp xếp theo ngày gần nhất
        );
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleBack = () => {
    navigation.goBack();
  };

  const renderNotificationItem = ({item}) => {
    const formattedDate = new Date(item.date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.notificationItem}>
        <Text style={styles.notificationTitle}>{item.name}</Text>
        <Text style={styles.notificationBody}>{formattedDate}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b731" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={handleBack}>
            <SvgXml style={styles.back} xml={iconsBack()} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Thông báo</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={renderNotificationItem}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backContainer: {
    position: 'absolute',
    left: 5,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  notificationItem: {
    backgroundColor: '#D9D9D9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  notificationTitle: {
    color: '#f7b731',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBody: {
    color: '#000000',
    fontSize: 14,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});
