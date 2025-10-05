import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get(
          'https://www.makeahabit.com/api/v1/banner/get-all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.banners)) {
          setBanners(response.data.banners);
        }
      } catch (error) {
        console.log('Banner API error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (banners.length === 0) return;

    intervalRef.current = setInterval(() => {
      let nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [activeIndex, banners]);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#40196C" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Image
            source={{
              uri: item.img
                ? `https://www.makeahabit.com/api/v1/uploads/banner/${item.img}`
                : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png',
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 6,
  },
  bannerImage: {
    width: width - 36,
    height: 165,
    marginHorizontal: 6,
    marginVertical: 10,
    borderRadius: 10,
  },
  loader: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#40196C',
    width: 24,
    height: 5,
  },
});

export default BannerCarousel;
