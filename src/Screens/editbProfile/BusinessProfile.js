import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetails } from '../../redux/Vendor/vendorDetailsSlice';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import DateTimePicker from '@react-native-community/datetimepicker';

// Initialize Google Geocoder
Geocoder.init('AIzaSyBg3zH3KMal8ApDRBnO72mkrPXp_OQqNUc');

export default function BusinessProfile() {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [openingDays, setOpeningDays] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [googleBusinessLink, setGoogleBusinessLink] = useState('');
  const [description, setDescription] = useState('');

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [daysModalVisible, setDaysModalVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  // Format selected days for UI display
  const formatSelectedDays = days => {
    if (days.length === 0) return 'Select Opening Days';
    if (days.length === 7) return 'Monday - Sunday';
    if (days.length === 6 && !days.includes('Sun')) return 'Monday - Saturday';
    return days.join(', ');
  };

  const toggleDay = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Initialize selectedDays from openingDays (string) on vendor load
  useEffect(() => {
    if (typeof openingDays === 'string' && openingDays.trim() !== '') {
      if (openingDays.includes('-')) {
        const parts = openingDays.split('-').map(s => s.trim());
        const startIndex = weekdays.indexOf(parts[0]);
        const endIndex = weekdays.indexOf(parts[1]);
        if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
          setSelectedDays(weekdays.slice(startIndex, endIndex + 1));
        }
      } else {
        const splitDays = openingDays.split(',').map(d => d.trim());
        setSelectedDays(splitDays.filter(day => weekdays.includes(day)));
      }
    } else {
      setSelectedDays([]);
    }
  }, [openingDays]);

  const [showTimePicker, setShowTimePicker] = useState({
    type: '',
    visible: false,
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorDetails);

  // Fetch vendor details
  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  // Populate vendor data
  useEffect(() => {
    if (vendor?.data) {
      const v = vendor.data;
      setEmail(v?.email || '');
      setBusinessName(v?.businessName || '');
      setBusinessType(v?.businessType || '');
      setAadharNumber(v?.aadharNumber || '');
      setGstNumber(v?.gstNumber || '');
      setState(v?.state || '');
      setCity(v?.city || '');
      setPincode(v?.pincode || '');
      setAddress(v?.addressName || '');
      setOpeningDays(v?.openingDays || '');
      setOpeningTime(v?.openingTime || '');
      setClosingTime(v?.closingTime || '');
      setWebsiteLink(v?.websiteLink || '');
      setGoogleBusinessLink(v?.googleBusinessLink || '');
      setDescription(v?.description || '');
    }
  }, [vendor]);

  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker({ type: '', visible: false });
      return;
    }
    const time = selectedTime || new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;

    if (showTimePicker.type === 'opening') setOpeningTime(formatted);
    if (showTimePicker.type === 'closing') setClosingTime(formatted);

    setShowTimePicker({ type: '', visible: false });
  };

  // Get current location
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        try {
          const json = await Geocoder.from(latitude, longitude);
          if (json.results.length > 0) {
            const addr = json.results[0];
            const comps = addr.address_components;
            const getComp = type =>
              (comps.find(c => c.types.includes(type)) || {}).long_name || '';
            setState(getComp('administrative_area_level_1'));
            setCity(getComp('locality') || getComp('sublocality'));
            setPincode(getComp('postal_code'));
            setAddress(addr.formatted_address);
          }
        } catch {
          Alert.alert('Error', 'Unable to get address.');
        }
      },
      error => {
        console.log(error);
        Alert.alert('Error', 'Unable to fetch location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  // Save profile (update API)
  const handleSave = async () => {
    try {
      setLoading(true);

      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');

      if (!vendorId || !token) {
        Alert.alert('Error', 'Missing vendor credentials.');
        return;
      }

      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('businessType', businessType);
      formData.append('aadharNumber', aadharNumber);
      formData.append('gstNumber', gstNumber);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('addressName', address);
      // Change below line to append array items individually
      selectedDays.forEach(day => formData.append('openingDays[]', day));
      formData.append('openingTime', openingTime);
      formData.append('closingTime', closingTime);
      formData.append('websiteLink', websiteLink);
      formData.append('googleBusinessLink', googleBusinessLink);
      formData.append('description', description);

      const res = await axios.put(
        `https://www.makeahabit.com/api/v1/auth/update-business-profile-byId/${vendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          transformResponse: [
            data => {
              try {
                return JSON.parse(data);
              } catch {
                console.log('Non-JSON response:', data);
                return { success: false, message: data };
              }
            },
          ],
        },
      );

      if (res.data?.success) {
        Alert.alert('Success', 'Business profile updated successfully!');
        dispatch(fetchVendorDetails());
      } else {
        Alert.alert('Error', res.data?.message || 'Update failed');
      }
    } catch (err) {
      if (err.response) {
        console.log('Raw response:', err.response.data);
        console.log('Status:', err.response.status);
      } else {
        console.log('Error message:', err.message);
      }
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
    >
      <HeaderLeft title={'Business Profile'} />

      <View style={styles.inputCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f3f3f3' }]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Enter business name"
        />

        <Text style={styles.label}>Business Type</Text>
        <TextInput
          style={styles.input}
          value={businessType}
          onChangeText={setBusinessType}
          placeholder="Enter business type"
        />

        <Text style={styles.label}>Aadhar Number</Text>
        <TextInput
          style={styles.input}
          value={aadharNumber}
          onChangeText={setAadharNumber}
          placeholder="Enter Aadhar number"
        />

        <Text style={styles.label}>GST Number</Text>
        <TextInput
          style={styles.input}
          value={gstNumber}
          onChangeText={setGstNumber}
          placeholder="Enter GST number"
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter state"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />

        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          keyboardType="number-pad"
          placeholder="Enter pincode"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter full address"
        />

        <TouchableOpacity
          style={styles.locationBtn}
          onPress={getCurrentLocation}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={18}
            color="#fff"
          />
          <Text style={styles.locationText}> Use Current Location </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Opening Days</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', height: 48 }]}
          onPress={() => setDaysModalVisible(true)}
        >
          <Text
            style={{
              color: selectedDays.length ? '#000' : '#777',
              fontSize: 15,
            }}
          >
            {formatSelectedDays(selectedDays)}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 14 }]}>Business Timings</Text>
        <View style={styles.timeRow}>
          <TouchableOpacity
            style={styles.timeBox}
            onPress={() =>
              setShowTimePicker({ type: 'opening', visible: true })
            }
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#14ad5f"
            />
            <Text style={styles.timeText}>{openingTime || 'Opening Time'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeBox}
            onPress={() =>
              setShowTimePicker({ type: 'closing', visible: true })
            }
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#14ad5f"
            />
            <Text style={styles.timeText}>{closingTime || 'Closing Time'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Website Link</Text>
        <TextInput
          style={styles.input}
          value={websiteLink}
          onChangeText={setWebsiteLink}
          placeholder="Enter website URL"
        />

        <Text style={styles.label}>Google Business Link</Text>
        <TextInput
          style={styles.input}
          value={googleBusinessLink}
          onChangeText={setGoogleBusinessLink}
          placeholder="Enter Google Business URL"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Enter business description"
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSave}
        disabled={loading}
        style={{ marginTop: 30 }}
      >
        <LinearGradient colors={['#00D65F', '#01823A']} style={styles.saveBtn}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={daysModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDaysModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15 }}>
              Select Opening Days
            </Text>
            {weekdays.map(day => {
              const selected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      selected ? 'checkbox-marked' : 'checkbox-blank-outline'
                    }
                    size={22}
                    color={selected ? '#00D65F' : '#777'}
                  />
                  <Text
                    style={{
                      marginLeft: 12,
                      fontSize: 16,
                      color: selected ? '#000' : '#444',
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: '#00D65F',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={() => setDaysModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showTimePicker.visible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f0c1ff', padding: 16 },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  label: { fontSize: 14, color: '#777', marginBottom: 6, marginTop: 12 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e7e8ec',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  saveBtn: { paddingVertical: 14, borderRadius: 25, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14ad5f',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  locationText: { color: '#fff', fontWeight: '600' },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f5fa',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  timeText: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#333' },
});
