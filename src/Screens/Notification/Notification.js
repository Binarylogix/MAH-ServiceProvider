import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';

const initialNotifications = [
  {
    id: '1',
    title: 'New Message',
    message: 'You received a message from Priya.',
    time: '2 min ago',
    icon: 'chatbubble-ellipses-outline',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    unread: true,
    section: 'Today',
  },
  {
    id: '2',
    title: 'Appointment Confirmed',
    message: 'Your salon appointment is confirmed.',
    time: '1 hr ago',
    icon: 'calendar-outline',
    image: 'https://randomuser.me/api/portraits/men/21.jpg',
    unread: true,
    section: 'Today',
  },
  {
    id: '3',
    title: 'Discount Offer',
    message: 'Get 25% off on your next booking!',
    time: '2 days ago',
    icon: 'gift-outline',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    unread: false,
    section: 'This Week',
  },
];

const AnimatedCard = ({ item, index, onMarkRead }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 120,
      useNativeDriver: true,
    }).start();

    Animated.spring(translateY, {
      toValue: 0,
      friction: 5,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    // mark as read (just remove dot and change background)
    if (item.unread) onMarkRead(item.id);

    Animated.timing(expandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  const opacityInterpolate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: item.unread ? '#f0f9f5' : '#fff',
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.row}
        onPress={toggleExpand}
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {item.message}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Icon
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#4CAF50"
        />
        {item.unread && <View style={styles.unreadDot} />}
      </TouchableOpacity>

      <Animated.View
        style={{
          overflow: 'hidden',
          height: heightInterpolate,
          opacity: opacityInterpolate,
          marginTop: 8,
          paddingHorizontal: 6,
        }}
      >
        <Text style={{ color: '#555', fontSize: 13, lineHeight: 20 }}>
          {item.message} This is the detailed description of your notification.
          You can show more info or actions here (like “Reply” or “View
          Details”).
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkRead = id => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const groupedData = {
    Today: notifications.filter(n => n.section === 'Today'),
    'This Week': notifications.filter(n => n.section === 'This Week'),
  };

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderLeft title={'Notifications'} />
        <FlatList
          data={Object.entries(groupedData)}
          keyExtractor={item => item[0]}
          renderItem={({ item }) => (
            <>
              {item[1].length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{item[0]}</Text>
                  {item[1].map((notif, i) => (
                    <AnimatedCard
                      key={notif.id}
                      item={notif}
                      index={i}
                      onMarkRead={handleMarkRead}
                    />
                  ))}
                </>
              )}
            </>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Icon name="notifications-off-outline" size={60} color="#aaa" />
              <Text style={{ color: '#777', marginTop: 10, fontSize: 15 }}>
                No new notifications
              </Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  message: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
