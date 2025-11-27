import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderLeft from '../../Component/Header/HeaderLeft';

// =============================================
// 🚀 Animated Notification Card
// =============================================
const AnimatedCard = ({ item, index, onMarkRead }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    Animated.spring(translateY, {
      toValue: 0,
      friction: 4,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = () => {
    setExpanded(prev => !prev);

    if (item.unread) onMarkRead(item.id);

    Animated.timing(expandAnim, {
      toValue: expanded ? 0 : 1,
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
      <TouchableOpacity style={styles.row} onPress={toggleExpand}>
        <Image source={{ uri: item.image }} style={styles.avatar} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.message}>
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
          height: heightInterpolate,
          opacity: opacityInterpolate,
          overflow: 'hidden',
          marginTop: 8,
          paddingHorizontal: 6,
        }}
      >
        <Text style={styles.expandText}>{item.message}</Text>
      </Animated.View>
    </Animated.View>
  );
};

// =============================================
// 🚀 Skeleton Loader
// =============================================
const SkeletonCard = () => (
  <View style={[styles.card, { backgroundColor: '#eaeaea' }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: '#d0d0d0',
          marginRight: 12,
        }}
      />

      <View style={{ flex: 1 }}>
        <View style={styles.skeletonLine(60)} />
        <View style={styles.skeletonLine(80)} />
        <View style={styles.skeletonLine(40)} />
      </View>
    </View>
  </View>
);

// =============================================
// 🚀 MAIN COMPONENT
// =============================================
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const timeAgo = dateString => {
    if (!dateString) return 'Just now';

    const now = new Date();
    const past = new Date(dateString);
    const diff = (now - past) / 1000; // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 172800) return 'Yesterday';

    return `${Math.floor(diff / 86400)} days ago`;
  };

  const fetchNotifications = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);

      const token = await AsyncStorage.getItem('vendorToken');
      if (!token) return;

      const res = await axios.get(
        'https://www.makeahabit.com/api/v1/fire/get-notification',
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('hfhjfhjg', res.data);
      const apiNotifications = (res.data.notifications || []).map((n, idx) => ({
        id: String(n.id ?? idx),
        title: n.title ?? 'Notification',
        message: n.body,
        time: timeAgo(n.sentAt),
        image:
          n.image ?? 'https://cdn-icons-png.flaticon.com/512/3602/3602145.png',
        unread: n.read === false || n.is_read === 0,
        section: n.section ?? 'Today',
      }));

      setNotifications(apiNotifications);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const handleMarkRead = id => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const groupedData = {
    Today: notifications.filter(n => n.section === 'Today'),
    'This Week': notifications.filter(n => n.section === 'This Week'),
  };

  const isEmpty =
    groupedData.Today.length === 0 && groupedData['This Week'].length === 0;

  return (
    <>
      <HeaderLeft title="Notifications" />

      <View style={styles.container}>
        {/* ===================== Skeleton Loader ===================== */}
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : isEmpty ? (
          /* ===================== NO DATA UI ===================== */
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={45} color="#aaa" />
            <Text style={styles.emptyText}>No notifications found</Text>
          </View>
        ) : (
          /* ===================== REAL DATA ===================== */
          <FlatList
            data={Object.entries(groupedData)}
            keyExtractor={item => item[0]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
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
          />
        )}
      </View>
    </>
  );
};

export default Notification;

// =============================================
// 🚀 STYLES
// =============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  skeletonLine: width => ({
    height: 10,
    width: `${width}%`,
    backgroundColor: '#d6d6d6',
    borderRadius: 5,
    marginBottom: 6,
  }),

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    paddingHorizontal: 12,
    marginTop: 10,
  },

  card: {
    borderRadius: 14,
    marginHorizontal: 12,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    height: 30,
    width: 30,
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

  expandText: {
    color: '#555',
    fontSize: 13,
    lineHeight: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },

  emptyText: {
    color: '#777',
    marginTop: 10,
    fontSize: 15,
  },
});
