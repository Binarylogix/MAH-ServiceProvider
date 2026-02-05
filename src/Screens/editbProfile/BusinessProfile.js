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

Geocoder.init('AIzaSyBg3zH3KMal8ApDRBnO72mkrPXp_OQqNUc');

export default function BusinessProfile() {
  /* ================= STATES ================= */
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [googleBusinessLink, setGoogleBusinessLink] = useState('');
  const [description, setDescription] = useState('');

  const [openingDays, setOpeningDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
    { openingTime: '', closingTime: '' },
  ]);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [daysModalVisible, setDaysModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState({
    visible: false,
    index: null,
    type: '',
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { vendor } = useSelector(state => state.vendorDetails);

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  useEffect(() => {
    if (!vendor?.data) return;
    const v = vendor.data;

    setEmail(v.email || '');
    setBusinessName(v.businessName || '');
    setBusinessType(v.businessType || '');
    setAadharNumber(v.aadharNumber || '');
    setGstNumber(v.gstNumber || '');
    setState(v.state || '');
    setCity(v.city || '');
    setPincode(v.pincode || '');
    setAddress(v.addressName || '');
    setArea(v.area || '');
    setWebsiteLink(v.websiteLink || '');
    setGoogleBusinessLink(v.googleBusinessLink || '');
    setDescription(v.description || '');

    if (Array.isArray(v.openingDays)) {
      setOpeningDays(v.openingDays);
    }

    if (Array.isArray(v.timeSlots) && v.timeSlots.length) {
      setTimeSlots(
        v.timeSlots.map(({ openingTime, closingTime }) => ({
          openingTime,
          closingTime,
        })),
      );
    }
  }, [vendor]);

  /* ================= HELPERS ================= */

  const formatSelectedDays = days =>
    days.length ? days.join(', ') : 'Select Opening Days';

  const toggleDay = day => {
    setOpeningDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker({ visible: false, index: null, type: '' });
      return;
    }

    let hh = selectedTime.getHours();
    const mm = selectedTime.getMinutes();
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12 || 12;

    const formatted = `${hh.toString().padStart(2, '0')}:${mm
      .toString()
      .padStart(2, '0')} ${ampm}`;

    setTimeSlots(prev => {
      const updated = [...prev];
      updated[showTimePicker.index] = {
        ...updated[showTimePicker.index],
        [showTimePicker.type === 'opening' ? 'openingTime' : 'closingTime']:
          formatted,
      };
      return updated;
    });

    setShowTimePicker({ visible: false, index: null, type: '' });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        const geo = await Geocoder.from(latitude, longitude);
        const addr = geo.results[0];
        const get = t =>
          addr.address_components.find(c => c.types.includes(t))?.long_name ||
          '';
        setState(get('administrative_area_level_1'));
        setCity(get('locality'));
        setPincode(get('postal_code'));
        setAddress(addr.formatted_address);
      },
      () => Alert.alert('Error', 'Unable to fetch location'),
    );
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      setLoading(true);
      const vendorId = await AsyncStorage.getItem('vendorId');
      const token = await AsyncStorage.getItem('vendorToken');

      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('businessType', businessType);
      formData.append('aadharNumber', aadharNumber);
      formData.append('gstNumber', gstNumber);
      formData.append('state', state);
      formData.append('city', city);
      formData.append('pincode', pincode);
      formData.append('addressName', address);
      formData.append('area', area);
      formData.append('openingDays', JSON.stringify(openingDays));
      formData.append('timeSlots', JSON.stringify(timeSlots));
      formData.append('websiteLink', websiteLink);
      formData.append('googleBusinessLink', googleBusinessLink);
      formData.append('description', description);
      console.log('formdata : ', formData);
      const res = await axios.put(
        `https://www.makeahabit.com/api/v1/auth/update-business-profile-byId/${vendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('response : ', res.data);
      if (res.data?.success) {
        Alert.alert('Success', 'Business profile updated');
        dispatch(fetchVendorDetails());
      } else {
        Alert.alert('Error', res.data?.message || 'Update failed');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Something went wrong');
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
        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          value={area}
          onChangeText={setArea}
          placeholder="Enter area / locality"
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
              color: openingDays.length ? '#000' : '#777',
              fontSize: 15,
            }}
          >
            {formatSelectedDays(openingDays)}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 14 }]}>Business Timings</Text>

        {timeSlots.map((slot, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <View style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeBox}
                onPress={() =>
                  setShowTimePicker({
                    type: 'opening',
                    visible: true,
                    index,
                  })
                }
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#14ad5f"
                />
                <Text style={styles.timeText}>
                  {slot.openingTime || 'Opening Time'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timeBox}
                onPress={() =>
                  setShowTimePicker({
                    type: 'closing',
                    visible: true,
                    index,
                  })
                }
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#14ad5f"
                />
                <Text style={styles.timeText}>
                  {slot.closingTime || 'Closing Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {timeSlots.length > 1 && (
              <TouchableOpacity
                onPress={() =>
                  setTimeSlots(prev => prev.filter((_, i) => i !== index))
                }
                style={{ alignSelf: 'flex-end', marginTop: 5 }}
              >
                <Text style={{ color: 'crimson', fontWeight: '600' }}>
                  Remove Slot
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={() =>
            setTimeSlots(prev => [
              ...prev,
              { openingTime: '', closingTime: '' },
            ])
          }
        >
          <Text style={{ color: '#14ad5f', fontWeight: '700' }}>
            + Add Time Slot
          </Text>
        </TouchableOpacity>

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
              const selected = openingDays.includes(day);
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
