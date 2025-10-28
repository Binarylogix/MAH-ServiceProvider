// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import { useNavigation } from '@react-navigation/native';
// import HeaderLeft from '../../Component/Header/HeaderLeft';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import noImage from '../../assets/images/noImage.jpg';

// const BASE_URL = 'https://www.makeahabit.com/api/v1/uploads';
// const BOOKINGS_API = 'https://www.makeahabit.com/api/v1/booking/getAllBookings';

// const BookingsList = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState('');
//   const [filtered, setFiltered] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Sample data for preview
//     setBookings([
//       {
//         _id: '1',
//         serviceName: 'Haircut & Styling',
//         customerName: 'Amit Sharma',
//         bookingDate: '2025-10-15T11:30:00',
//         status: 'confirmed',
//         image: '',
//       },
//       {
//         _id: '2',
//         serviceName: 'Facial Treatment',
//         customerName: 'Riya Mehta',
//         bookingDate: '2025-10-16T14:00:00',
//         status: 'pending',
//         image: '',
//       },
//       {
//         _id: '3',
//         serviceName: 'Beard Trim',
//         customerName: 'Karan Singh',
//         bookingDate: '2025-10-17T10:00:00',
//         status: 'cancelled',
//         image: '',
//       },
//       {
//         _id: '4',
//         serviceName: 'Full Body Massage',
//         customerName: 'Sneha Patel',
//         bookingDate: '2025-10-18T16:30:00',
//         status: 'confirmed',
//         image: '',
//       },
//     ]);
//     // fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('vendorToken');
//       const res = await axios.get(BOOKINGS_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.data) {
//         setBookings(res.data.data);
//         setFiltered(res.data.data);
//       }
//     } catch (error) {
//       console.log('Error fetching bookings:', error);
//       Alert.alert('Error', 'Failed to load bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = id => {
//     Alert.alert(
//       'Cancel Booking',
//       'Are you sure you want to cancel this booking?',
//       [
//         { text: 'No' },
//         {
//           text: 'Yes, Cancel',
//           onPress: async () => {
//             try {
//               await axios.put(
//                 `https://www.makeahabit.com/api/v1/booking/cancel/${id}`,
//               );
//               Alert.alert('Success', 'Booking cancelled');
//               fetchBookings();
//             } catch (e) {
//               Alert.alert('Error', 'Failed to cancel booking');
//             }
//           },
//         },
//       ],
//     );
//   };

//   const handleReschedule = id => {
//     Alert.alert('Reschedule Booking', 'Feature coming soon!');
//   };

//   useEffect(() => {
//     if (search.trim() === '') {
//       setFiltered(bookings);
//     } else {
//       const lower = search.toLowerCase();
//       const filter = bookings.filter(
//         b =>
//           b.customerName?.toLowerCase().includes(lower) ||
//           b.serviceName?.toLowerCase().includes(lower),
//       );
//       setFiltered(filter);
//     }
//   }, [search, bookings]);

//   const renderBookingCard = ({ item }) => (
//     <View style={styles.salonCard}>
//       {/* 🔹 Status Badge on Top Right */}
//       <View
//         style={[
//           styles.statusBadge,
//           {
//             backgroundColor:
//               item.status === 'cancelled'
//                 ? '#ffcccc'
//                 : item.status === 'pending'
//                 ? '#fff3cd'
//                 : '#d4edda',
//           },
//         ]}
//       >
//         <Text
//           style={[
//             styles.statusText,
//             {
//               color:
//                 item.status === 'cancelled'
//                   ? 'red'
//                   : item.status === 'pending'
//                   ? '#856404'
//                   : '#155724',
//             },
//           ]}
//         >
//           {item.status?.toUpperCase() || 'PENDING'}
//         </Text>
//       </View>

//       {/* 🔹 Image */}
//       <Image
//         source={
//           item.image
//             ? {
//                 uri: item.image.startsWith('http')
//                   ? item.image
//                   : `${BASE_URL}/${item.image}`,
//               }
//             : noImage
//         }
//         style={styles.salonImage}
//         resizeMode="cover"
//       />

//       {/* 🔹 Details */}
//       <View style={styles.salonDetails}>
//         <Text style={styles.salonName}>
//           {item.serviceName || 'Service Name'}
//         </Text>

//         <View
//           style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
//         >
//           <MaterialCommunityIcons name="account" size={14} color="#18A558" />
//           <Text style={[styles.salonLocation, { marginLeft: 4 }]}>
//             {item.customerName || 'Customer'}
//           </Text>
//         </View>

//         <View
//           style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
//         >
//           <MaterialCommunityIcons name="calendar" size={14} color="#666" />
//           <Text style={[styles.salonServices, { marginLeft: 4 }]}>
//             {new Date(item.bookingDate).toLocaleString()}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//       <HeaderLeft title="My Bookings" />

//       <View style={styles.container}>
//         {/* 🔍 Search Bar */}
//         <View style={styles.searchBar}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search by customer or service..."
//             placeholderTextColor="#aaa"
//             value={search}
//             onChangeText={setSearch}
//           />
//           <View style={styles.searchIcon}>
//             <Text style={{ fontSize: 18 }}>🔍</Text>
//           </View>
//         </View>

//         {loading ? (
//           <ActivityIndicator size="large" color="#18A558" />
//         ) : (
//           <FlatList
//             data={filtered}
//             keyExtractor={item => item._id}
//             renderItem={renderBookingCard}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               <Text
//                 style={{ textAlign: 'center', color: '#999', marginTop: 20 }}
//               >
//                 No bookings found
//               </Text>
//             }
//             contentContainerStyle={{ paddingBottom: 80 }}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default BookingsList;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 14,
//     paddingTop: 10,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F1F3F4',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     height: 44,
//     elevation: 2,
//   },
//   searchInput: {
//     flex: 1,
//     color: '#222',
//     fontSize: 16,
//   },
//   searchIcon: {
//     marginLeft: 6,
//   },
//   salonCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     marginBottom: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 3,
//     position: 'relative', // ✅ For badge positioning
//   },
//   statusBadge: {
//     position: 'absolute',
//     top: 8,
//     right: 8,
//     borderRadius: 6,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     zIndex: 10,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   salonImage: {
//     width: 68,
//     height: 68,
//     borderRadius: 12,
//     marginRight: 12,
//     backgroundColor: '#f0f0f0',
//   },
//   salonDetails: {
//     flex: 1,
//   },
//   salonName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#222',
//   },
//   salonLocation: {
//     fontSize: 13,
//     color: '#18A558',
//     fontWeight: '600',
//   },
//   salonServices: {
//     fontSize: 12,
//     color: '#666',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     marginTop: 8,
//     gap: 10,
//   },
//   actionBtn: {
//     flex: 1,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   actionText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 13,
//   },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const statusColors = {
//   Pending: '#FF7F50',
//   Approved: '#4CAF50',
//   Paid: '#4CAF50',
//   Completed: '#4CAF50',
//   Canceled: '#9E9E9E',
// };

// const BookingCard = ({ item, onCancel, onReschedule }) => {
//   // Check both possible status locations
//   const bookingStatus = item.booking?.status || item.status;

//   console.log('Booking Status:', bookingStatus); // Debug log

//   const canCancel =
//     bookingStatus !== 'Canceled' &&
//     bookingStatus !== 'Cancelled' &&
//     bookingStatus !== 'Completed';

//   const canReschedule =
//     bookingStatus === 'Approved' ||
//     bookingStatus === 'Pending' ||
//     bookingStatus === 'Paid';

//   return (
//     <View style={styles.card}>
//       <View style={styles.headerRow}>
//         <Text style={styles.dateText}>
//           {new Date(item.booking.date).toDateString()}
//         </Text>
//         <View
//           style={[
//             styles.statusBadge,
//             { backgroundColor: statusColors[bookingStatus] || '#ccc' },
//           ]}
//         >
//           <Text style={styles.statusText}>{bookingStatus}</Text>
//         </View>
//       </View>

//       <View style={styles.contentRow}>
//         <Image
//           source={{
//             uri: item.vendor.businessCard
//               ? `https://www.makeahabit.com/api/v1/uploads/business/${item.vendor.businessCard}`
//               : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png',
//           }}
//           style={styles.salonImage}
//         />
//         <View style={styles.details}>
//           <Text style={styles.salonName}>{item.vendor.businessName}</Text>
//           <Text style={styles.address}>
//             {item.vendor.city}, {item.vendor.state}
//           </Text>
//           <Text style={styles.timeText}>
//             <Text style={{ fontWeight: '600' }}>Time: </Text>
//             {item.booking.time}
//           </Text>
//           <Text style={styles.services}>
//             <Text style={{ fontWeight: '600' }}>Services: </Text>
//             {item.booking.services.map(s => s.service.name).join(', ')}
//           </Text>
//           <Text style={styles.price}>
//             <Text style={{ fontWeight: '600' }}>Price: </Text>₹
//             {item.booking.totalPrice}
//           </Text>
//         </View>
//       </View>

//       {/* Always show action row for debugging */}
//       <View style={styles.actionRow}>
//         {canReschedule && (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.rescheduleButton]}
//             onPress={() => onReschedule(item)}
//           >
//             <Text style={styles.rescheduleButtonText}>Reschedule</Text>
//           </TouchableOpacity>
//         )}
//         {canCancel && (
//           <TouchableOpacity
//             style={[styles.actionButton, styles.cancelButton]}
//             onPress={() => onCancel(item)}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const AllBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('Booking');
//   console.log(bookings);

//   // Cancel Modal States
//   const [cancelModalVisible, setCancelModalVisible] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [canceling, setCanceling] = useState(false);

//   // Reschedule Modal States
//   const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
//   const [rescheduleDate, setRescheduleDate] = useState('');
//   const [rescheduleTime, setRescheduleTime] = useState('');
//   const [rescheduling, setRescheduling] = useState(false);

//   // Predefined cancellation reasons
//   const cancelReasons = [
//     'Change of plans',
//     'Found another service provider',
//     'Schedule conflict',
//     'Service no longer needed',
//     'Price too high',
//     'Other',
//   ];

//   // Time slots for reschedule
//   const timeSlots = [
//     '09:00 AM',
//     '09:30 AM',
//     '10:00 AM',
//     '10:30 AM',
//     '11:00 AM',
//     '11:30 AM',
//     '12:00 PM',
//     '12:30 PM',
//     '01:00 PM',
//     '01:30 PM',
//     '02:00 PM',
//     '02:30 PM',
//     '03:00 PM',
//     '03:30 PM',
//     '04:00 PM',
//     '04:30 PM',
//     '05:00 PM',
//     '05:30 PM',
//     '06:00 PM',
//     '06:30 PM',
//     '07:00 PM',
//     '07:30 PM',
//   ];

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const userToken = await AsyncStorage.getItem('userToken');
//       const userId = await AsyncStorage.getItem('userId');

//       const response = await axios.get(
//         `https://www.makeahabit.com/api/v1/booking/userOrder/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${userToken}` },
//         },
//       );

//       if (response.data.success) {
//         setBookings(response.data.data);
//       }
//     } catch (error) {
//       console.log('Error fetching bookings:', error);
//       Alert.alert('Error', 'Failed to fetch bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open Cancel Modal
//   const handleCancelBooking = item => {
//     setSelectedBooking(item);
//     setCancelReason('');
//     setCancelModalVisible(true);
//   };

//   // Submit Cancellation with Reason
//   const submitCancellation = async () => {
//     if (!cancelReason.trim()) {
//       Alert.alert('Error', 'Please provide a reason for cancellation');
//       return;
//     }

//     setCanceling(true);

//     try {
//       const userToken = await AsyncStorage.getItem('userToken');

//       const response = await axios.put(
//         `https://www.makeahabit.com/api/v1/booking/cancel/${selectedBooking.booking._id}`,
//         {
//           status: 'Canceled',
//           reason: cancelReason.trim(),
//         },
//         {
//           headers: { Authorization: `Bearer ${userToken}` },
//         },
//       );
//       console.log(response.data);
//       if (response.data.success) {
//         Alert.alert('Success', 'Booking cancelled successfully');
//         setCancelModalVisible(false);
//         setCancelReason('');
//         setSelectedBooking(null);
//         fetchBookings();
//       }
//     } catch (error) {
//       console.log('Error canceling booking:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.message || 'Failed to cancel booking',
//       );
//     } finally {
//       setCanceling(false);
//     }
//   };

//   // Open Reschedule Modal
//   const handleRescheduleBooking = item => {
//     setSelectedBooking(item);
//     setRescheduleDate('');
//     setRescheduleTime('');
//     setRescheduleModalVisible(true);
//   };

//   // Submit Reschedule
//   const submitReschedule = async () => {
//     if (!rescheduleDate.trim()) {
//       Alert.alert('Error', 'Please select a date (YYYY-MM-DD format)');
//       return;
//     }

//     if (!rescheduleTime.trim()) {
//       Alert.alert('Error', 'Please select a time');
//       return;
//     }

//     // Validate date format
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateRegex.test(rescheduleDate)) {
//       Alert.alert('Error', 'Please enter date in YYYY-MM-DD format');
//       return;
//     }

//     setRescheduling(true);

//     try {
//       const userToken = await AsyncStorage.getItem('userToken');

//       const response = await axios.put(
//         `https://www.makeahabit.com/api/v1/booking/reschedule/${selectedBooking.booking._id}`,
//         {
//           newDate: rescheduleDate,
//           newTime: rescheduleTime,
//         },
//         {
//           headers: { Authorization: `Bearer ${userToken}` },
//         },
//       );

//       console.log(response.data);
//       if (response.data.success) {
//         Alert.alert('Success', 'Booking rescheduled successfully');
//         setRescheduleModalVisible(false);
//         setRescheduleDate('');
//         setRescheduleTime('');
//         setSelectedBooking(null);
//         fetchBookings();
//       }
//     } catch (error) {
//       console.log('Error rescheduling booking:', error);
//       Alert.alert(
//         'Error1',
//         error.response?.data?.message || 'Failed to reschedule booking',
//       );
//     } finally {
//       setRescheduling(false);
//     }
//   };

//   const filteredBookings = bookings.filter(booking => {
//     if (activeTab === 'Booking') return true;
//     if (activeTab === 'Completed') return booking.status === 'Completed';
//     if (activeTab === 'Canceled') return booking.status === 'Canceled';
//     return true;
//   });

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#18A558" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>My Booking</Text>

//       {/* Tabs */}
//       <View style={styles.tabs}>
//         <TouchableOpacity onPress={() => setActiveTab('Booking')}>
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Booking' && styles.activeTab,
//             ]}
//           >
//             Booking
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setActiveTab('Completed')}>
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Completed' && styles.activeTab,
//             ]}
//           >
//             Completed
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setActiveTab('Canceled')}>
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === 'Canceled' && styles.activeTab,
//             ]}
//           >
//             Canceled
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={filteredBookings}
//         keyExtractor={item => item._id}
//         renderItem={({ item }) => (
//           <BookingCard
//             item={item}
//             onCancel={handleCancelBooking}
//             onReschedule={handleRescheduleBooking}
//           />
//         )}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No bookings found</Text>
//           </View>
//         }
//       />

//       {/* Cancel Modal */}
//       <Modal
//         visible={cancelModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setCancelModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContainer}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Cancel Booking</Text>
//                 <TouchableOpacity
//                   onPress={() => setCancelModalVisible(false)}
//                   style={styles.closeButton}
//                 >
//                   <Text style={styles.closeButtonText}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               {selectedBooking && (
//                 <View style={styles.bookingInfo}>
//                   <Text style={styles.bookingInfoText}>
//                     {selectedBooking.vendor.businessName}
//                   </Text>
//                   <Text style={styles.bookingInfoSubText}>
//                     {new Date(selectedBooking.booking.date).toDateString()} at{' '}
//                     {selectedBooking.booking.time}
//                   </Text>
//                 </View>
//               )}

//               <Text style={styles.sectionLabel}>Select a reason:</Text>
//               <View style={styles.reasonsContainer}>
//                 {cancelReasons.map((reason, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.reasonChip,
//                       cancelReason === reason && styles.reasonChipSelected,
//                     ]}
//                     onPress={() => setCancelReason(reason)}
//                   >
//                     <Text
//                       style={[
//                         styles.reasonChipText,
//                         cancelReason === reason &&
//                           styles.reasonChipTextSelected,
//                       ]}
//                     >
//                       {reason}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={styles.sectionLabel}>
//                 Or provide your own reason:
//               </Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Enter cancellation reason..."
//                 placeholderTextColor="#999"
//                 value={cancelReason}
//                 onChangeText={setCancelReason}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//               />

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.modalCancelButton]}
//                   onPress={() => setCancelModalVisible(false)}
//                   disabled={canceling}
//                 >
//                   <Text style={styles.modalCancelButtonText}>Go Back</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.modalSubmitButton]}
//                   onPress={submitCancellation}
//                   disabled={canceling}
//                 >
//                   {canceling ? (
//                     <ActivityIndicator color="#fff" size="small" />
//                   ) : (
//                     <Text style={styles.modalSubmitButtonText}>
//                       Confirm Cancel
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>

//       {/* Reschedule Modal */}
//       <Modal
//         visible={rescheduleModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setRescheduleModalVisible(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//           style={styles.modalOverlay}
//         >
//           <View style={styles.modalContainer}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Reschedule Booking</Text>
//                 <TouchableOpacity
//                   onPress={() => setRescheduleModalVisible(false)}
//                   style={styles.closeButton}
//                 >
//                   <Text style={styles.closeButtonText}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               {selectedBooking && (
//                 <View style={styles.bookingInfo}>
//                   <Text style={styles.bookingInfoText}>
//                     {selectedBooking.vendor.businessName}
//                   </Text>
//                   <Text style={styles.bookingInfoSubText}>
//                     Current:{' '}
//                     {new Date(selectedBooking.booking.date).toDateString()} at{' '}
//                     {selectedBooking.booking.time}
//                   </Text>
//                 </View>
//               )}

//               <Text style={styles.sectionLabel}>Select New Date:</Text>
//               <TextInput
//                 style={styles.dateInput}
//                 placeholder="YYYY-MM-DD (e.g., 2025-10-30)"
//                 placeholderTextColor="#999"
//                 value={rescheduleDate}
//                 onChangeText={setRescheduleDate}
//               />

//               <Text style={styles.sectionLabel}>Select New Time:</Text>
//               <View style={styles.timeSlots}>
//                 {timeSlots.map((slot, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.timeSlot,
//                       rescheduleTime === slot && styles.timeSlotSelected,
//                     ]}
//                     onPress={() => setRescheduleTime(slot)}
//                   >
//                     <Text
//                       style={[
//                         styles.timeSlotText,
//                         rescheduleTime === slot && styles.timeSlotTextSelected,
//                       ]}
//                     >
//                       {slot}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.modalCancelButton]}
//                   onPress={() => setRescheduleModalVisible(false)}
//                   disabled={rescheduling}
//                 >
//                   <Text style={styles.modalCancelButtonText}>Go Back</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.modalButton, styles.rescheduleSubmitButton]}
//                   onPress={submitReschedule}
//                   disabled={rescheduling}
//                 >
//                   {rescheduling ? (
//                     <ActivityIndicator color="#fff" size="small" />
//                   ) : (
//                     <Text style={styles.modalSubmitButtonText}>
//                       Confirm Reschedule
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     paddingTop: 30,
//   },
//   screenTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#111',
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginBottom: 16,
//     gap: 12,
//   },
//   tabText: {
//     marginRight: 20,
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#888',
//     paddingBottom: 4,
//   },
//   activeTab: {
//     color: '#18A558',
//     borderBottomWidth: 2,
//     borderBottomColor: '#18A558',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 8,
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 6,
//     alignItems: 'center',
//   },
//   dateText: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 14,
//   },
//   statusText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 11,
//   },
//   contentRow: {
//     flexDirection: 'row',
//     marginBottom: 8,
//   },
//   salonImage: {
//     width: 55, // ↓ smaller
//     height: 55,
//     borderRadius: 6,
//     marginRight: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   details: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   salonName: {
//     fontSize: 14, // ↓ smaller
//     fontWeight: '700',
//     marginBottom: 2,
//     color: '#111',
//   },

//   address: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 2,
//   },

//   timeText: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 2,
//   },

//   services: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 2,
//   },

//   price: {
//     fontSize: 12,
//     color: '#18A558',
//     fontWeight: '700',
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 8,
//     // marginTop: 6,
//     // paddingTop: 6,
//     // borderTopWidth: 1,
//     // borderTopColor: '#f2f2f2',
//   },

//   actionButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 10,
//     minWidth: 70,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     shadowOffset: { width: 0, height: 1 },
//   },

//   rescheduleButton: {
//     backgroundColor: '#18A558',
//   },

//   cancelButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1.5,
//     borderColor: '#FF5252',
//   },

//   rescheduleButtonText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: '600',
//   },

//   cancelButtonText: {
//     color: '#FF5252',
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 60,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '85%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111',
//   },
//   closeButton: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: '600',
//   },
//   bookingInfo: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   bookingInfoText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111',
//     marginBottom: 4,
//   },
//   bookingInfoSubText: {
//     fontSize: 13,
//     color: '#666',
//   },
//   sectionLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   reasonsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 16,
//   },
//   reasonChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f0',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   reasonChipSelected: {
//     backgroundColor: '#18A558',
//     borderColor: '#18A558',
//   },
//   reasonChipText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   reasonChipTextSelected: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 14,
//     color: '#111',
//     minHeight: 100,
//     marginBottom: 20,
//   },
//   dateInput: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 14,
//     color: '#111',
//     marginBottom: 10,
//   },
//   timeSlots: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 20,
//   },
//   timeSlot: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f0',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   timeSlotSelected: {
//     backgroundColor: '#18A558',
//     borderColor: '#18A558',
//   },
//   timeSlotText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   timeSlotTextSelected: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 10,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalCancelButton: {
//     backgroundColor: '#f0f0f0',
//   },
//   modalCancelButtonText: {
//     color: '#666',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   modalSubmitButton: {
//     backgroundColor: '#FF5252',
//   },
//   rescheduleSubmitButton: {
//     backgroundColor: '#18A558',
//   },
//   modalSubmitButtonText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '600',
//   },
// });

// export default AllBooking;
import React, { useState, useEffect, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const statusColors = {
  Pending: '#FF7F50',
  Approved: '#4CAF50',
  Paid: '#4CAF50',
  Completed: '#4CAF50',
  Canceled: '#9E9E9E',
};

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const BookingCard = ({ item, onComplete, completing }) => {
  const bookingStatus = item.status || item.status;
  const canComplete = bookingStatus === 'Paid';
  const businessCard = item.booking?.businessCard || item.businessCard;

  return (
    <View style={styles.card}>
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
            uri: businessCard
              ? `https://www.makeahabit.com/api/v1/uploads/business/${businessCard}`
              : 'https://cdn-icons-png.flaticon.com/512/1973/1973701.png',
          }}
          style={styles.salonImage}
        />
        <View style={styles.details}>
          <Text style={styles.salonName}>{item.vendor.businessName}</Text>
          <Text style={styles.address}>
            {item.vendor.city}, {item.vendor.state}
          </Text>
          <Text style={styles.timeText}>
            <Text style={{ fontWeight: '600' }}>Time: </Text>
            {item.booking.time}
          </Text>
          <Text style={styles.services}>
            <Text style={{ fontWeight: '600' }}>Services: </Text>
            {item.booking.services.map(s => s.service.name).join(', ')}
          </Text>
          <Text style={styles.price}>
            <Text style={{ fontWeight: '600' }}>Price: </Text>₹
            {item.booking.totalPrice}
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
    </View>
  );
};

const AllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Today');
  const [completing, setCompleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const pinInputRef = useRef(null);

  const renderPinBoxes = () => {
    const digits = pin.split('');
    const boxes = [];

    for (let i = 0; i < 6; i++) {
      boxes.push(
        <TouchableOpacity
          key={i}
          style={[styles.otpBox, digits[i] ? styles.otpBoxFilled : null]}
          onPress={() => {
            if (pinInputRef.current) {
              pinInputRef.current.focus();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.otpText}>{digits[i] || ''}</Text>
        </TouchableOpacity>,
      );
    }
    return boxes;
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (pinModalVisible) {
      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 300); // wait for modal animation
    }
  }, [pinModalVisible]);

  const fetchBookings = async () => {
    try {
      const userToken = await AsyncStorage.getItem('vendorToken');
      const response = await axios.get(
        `https://www.makeahabit.com/api/v1/booking/vendorBooking`,
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      if (response.data.success) setBookings(response.data.data);
    } catch (error) {
      Alert.alert('there is no bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  // Filter bookings based on selected filter
  const todayISO = getTodayISO();

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'Today') {
      return (
        booking.booking.date.slice(0, 10) === todayISO &&
        booking.status !== 'Completed' &&
        booking.status !== 'Canceled'
      );
    } else if (filter === 'Upcoming') {
      return (
        booking.booking.date.slice(0, 10) !== todayISO &&
        booking.status !== 'Completed' &&
        booking.status !== 'Canceled'
      );
    } else if (filter === 'Completed') {
      return booking.status === 'Completed';
    }
    return true;
  });

  // Show pin modal when Complete clicked
  const handleCompletePress = item => {
    setSelectedBooking(item);
    setPin('');
    setPinModalVisible(true);
  };

  // Submit pin and complete booking
  const handleSubmitPin = async () => {
    if (!pin.trim()) {
      Alert.alert('Error', 'Please enter your PIN');
      return;
    }
    setCompleting(true);
    try {
      const token = await AsyncStorage.getItem('vendorToken');
      const response = await axios.put(
        `https://www.makeahabit.com/api/v1/booking/complete-order/${selectedBooking.booking._id}`,
        { pin },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        Alert.alert('Success', 'Booking completed');
        setPinModalVisible(false);
        setSelectedBooking(null);
        fetchBookings();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to complete');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to complete',
      );
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18A558" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'flex-start', paddingBottom: 12 }}>
        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>
          My Booking
        </Text>
      </View>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['Today', 'All Booking', 'Completed'].map(f => (
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
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            onComplete={handleCompletePress}
            completing={completing}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No {filter.toLowerCase()} bookings
            </Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* PIN Modal */}
      {/* PIN Modal */}
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
              {/* Invisible input over OTP area */}
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

              {/* OTP boxes */}
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
                disabled={completing}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  // filterButton: {
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  // },
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
    marginBottom: 14,
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
  contentRow: { flexDirection: 'row', marginBottom: 8 },
  salonImage: { width: 55, height: 55, borderRadius: 6, marginRight: 10 },
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

  pinInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#111',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
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
