import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBookings,
  completeBooking,
} from '../../redux/Vendor/BookingSlice';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // ✅ Add navigation

const statusColors = {
  Pending: '#FF7F50',
  Approved: '#4CAF50',
  Paid: '#4CAF50',
  Completed: '#4CAF50',
  Cancelled: '#9E9E9E',
};

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const BookingCard = ({ item, onComplete, completing, onPress }) => {
  const bookingStatus = item.status;
  const canComplete = bookingStatus === 'Paid';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPress(item)}
    >
      <View style={styles.headerRow}>
        <Text style={styles.dateText}>
          {new Date(item.booking.date).toDateString()}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[bookingStatus] || '#ccc' },
          ]}
        >
          <Text style={styles.statusText}>{bookingStatus}</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <Image
          source={{
            uri: item?.user?.profileImg
              ? `https://www.makeahabit.com/api/v1/uploads/customer/${item?.user?.profileImg}`
              : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png',
          }}
          style={styles.salonImage}
        />
        <View style={styles.details}>
          <Text style={styles.salonName}>{item?.user?.fullName}</Text>
          <Text style={styles.timeText}>
            <Text style={{ fontWeight: '600' }}>Time: </Text>
            {item.booking?.time}
          </Text>
          <Text style={styles.services}>
            <Text style={{ fontWeight: '600' }}>Services: </Text>
            {item.booking?.services
              ?.map(s => s.service?.serviceName)
              .join(', ')}
          </Text>
          <Text style={styles.price}>
            <Text style={{ fontWeight: '600' }}>Price: </Text>₹
            {item.booking?.totalPrice}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {canComplete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onComplete(item)}
            disabled={completing}
          >
            {completing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.completeButtonText}>Complete</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const AllBooking = () => {
  const navigation = useNavigation(); // ✅ Add navigation hook
  const dispatch = useDispatch();
  const { bookings, loading, completing } = useSelector(state => state.booking);

  const [filter, setFilter] = useState('All Bookings');
  const [refreshing, setRefreshing] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const pinInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchBookings());
    setRefreshing(false);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'Completed') return booking.status === 'Completed';
    if (filter === 'Cancelled') return booking.status === 'Cancelled';
    return true;
  });

  const handleCompletePress = item => {
    setSelectedBooking(item);
    setPin('');
    setPinModalVisible(true);
  };

  const handleSubmitPin = async () => {
    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }

    if (!selectedBooking) {
      Alert.alert('Error', 'No booking selected');
      return;
    }

    if (pin !== selectedBooking.booking.confirmPin) {
      Alert.alert('Error', 'Incorrect PIN');
      return;
    }

    dispatch(completeBooking({ bookingId: selectedBooking.booking._id, pin }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Booking completed');
        setPinModalVisible(false);
        setSelectedBooking(null);
        dispatch(fetchBookings());
      })
      .catch(err => {
        Alert.alert('Error', err || 'Failed to complete');
      });
  };

  const renderPinBoxes = () => {
    const digits = pin.split('');
    return Array.from({ length: 6 }, (_, i) => (
      <TouchableOpacity
        key={i}
        style={[styles.otpBox, digits[i] ? styles.otpBoxFilled : null]}
        onPress={() => pinInputRef.current?.focus()}
      >
        <Text style={styles.otpText}>{digits[i] || ''}</Text>
      </TouchableOpacity>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18A558" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
          All Bookings
        </Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {['All Bookings', 'Completed', 'Cancelled'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bookings List */}
        <FlatList
          data={filteredBookings}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <BookingCard
              item={item}
              onComplete={handleCompletePress}
              completing={completing}
              onPress={
                () => navigation.navigate('BookingDetails', { booking: item }) // ✅ Navigate to details screen
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {filter.toLowerCase()} bookings
              </Text>
            </View>
          }
        />

        {/* PIN Modal (unchanged) */}
        <Modal
          visible={pinModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPinModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Enter PIN</Text>

              <View style={styles.otpContainer}>
                <TextInput
                  ref={pinInputRef}
                  style={styles.hiddenInput}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pin}
                  onChangeText={setPin}
                  autoFocus={true}
                  caretHidden={true}
                  showSoftInputOnFocus={true}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => pinInputRef.current?.focus()}
                  style={styles.otpBoxesTouchable}
                >
                  <View style={styles.otpBoxesRow}>{renderPinBoxes()}</View>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPinModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitPin}
                  disabled={completing}
                >
                  {completing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '600',
    color: '#000',
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 30,
    marginBottom: 70,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#18A558',
    backgroundColor: 'transparent',
  },
  filterText: {
    color: '#8e8a8aff',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#18A558',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateText: { fontSize: 12, color: '#666' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  statusText: { color: '#fff', fontWeight: '600', fontSize: 11 },
  contentRow: { flexDirection: 'row', marginBottom: 2 },
  salonImage: {
    width: 55,
    height: 55,
    borderRadius: 6,
    marginRight: 10,
    resizeMode: 'contain',
  },
  details: { flex: 1, justifyContent: 'center' },
  salonName: { fontSize: 14, fontWeight: '700', color: '#111' },
  address: { fontSize: 11, color: '#666' },
  timeText: { fontSize: 11, color: '#666' },
  services: { fontSize: 11, color: '#666' },
  price: { fontSize: 12, color: '#18A558', fontWeight: '700' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    minWidth: 70,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#999' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    color: 'transparent',
    opacity: 0.02,
    height: 60,
    width: '100%',
    zIndex: 1,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  otpBoxesTouchable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#fff',
  },
  otpBoxFilled: {
    borderColor: '#18A558',
    backgroundColor: '#E6F4EA',
  },
  otpText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  cancelText: { color: '#555', fontWeight: '600' },
  submitText: { color: '#fff', fontWeight: '700' },
});

export default AllBooking;
