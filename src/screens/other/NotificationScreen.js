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
import iconMessNotifi from '../../assets/icons/iconMessNotifi';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useAuth} from '../../components/AuthProvider ';

const NOTIFI_API_URL = 'http://139.180.132.97:3000/notification/notifi/user';
const TICKET_API_URL = 'http://139.180.132.97:3000/tickets';
const UPDATE_NOTIFI_API_URL = 'http://139.180.132.97:3000/notification';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userID = user.user._id;
  const token = user.token.access_token;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${NOTIFI_API_URL}/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedNotifications = response.data.getnotification.reverse();

        const notificationsWithMovie = await Promise.all(
          sortedNotifications.map(async notification => {
            try {
              const ticketResponse = await axios.get(
                `${TICKET_API_URL}/${notification.ticket}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );
              return {
                ...notification,
                movieName: ticketResponse.data.getTicket.movie.name,
              };
            } catch (error) {
              console.error(
                `Error fetching ticket ${notification.ticket}:`,
                error,
              );
              return {
                ...notification,
                movieName: 'N/A',
              };
            }
          }),
        );

        setNotifications(notificationsWithMovie);
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
  const handleNotificationPress = async notification => {
    try {
      await axios.put(
        `${UPDATE_NOTIFI_API_URL}/${notification._id}`,
        {status: false},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === notification._id ? {...n, status: false} : n,
        ),
      );
      navigation.navigate('TicketScreen', {_id: notification.ticket});
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
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
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        style={[
          styles.notificationItem,
          item.status === false && styles.notificationItemInactive,
        ]}>
        <SvgXml style={styles.iconMess} xml={iconMessNotifi()} />
        {item.status && (
          <Text style={styles.notificationTitle}>Bạn có 1 thông báo mới</Text>
        )}
        <Text style={styles.notificationBody}>
          {item.name} : {item.movieName}
        </Text>
        <Text style={styles.notificationTime}>{formattedDate}</Text>
      </TouchableOpacity>
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
    backgroundColor: '#696969',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
  },
  notificationItemInactive: {
    backgroundColor: '#363636',
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationBody: {
    color: '#D9D9D9',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  notificationTime: {
    color: '#D9D9D9',
    fontSize: 12,
    fontWeight: 'bold',
    margin: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  iconMess: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

