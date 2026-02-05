import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageResizer from 'react-native-image-resizer';

import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerVendor,
  resetVendorState,
} from '../../../redux/Vendor/CreateVendorSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// Initialize Geocoder with Google Maps API key
Geocoder.init('AIzaSyBg3zH3KMal8ApDRBnO72mkrPXp_OQqNUc');

export default function VendorRegistration({ navigation }) {
  const dispatch = useDispatch();
  const { loading, success, error, data } = useSelector(state => state.vendor);

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    businessName: '',
    businessType: '',
    category: '',
    aadharNumber: '',
    gstNumber: '',
    state: '',
    city: '',
    pincode: '',
    address: '',
    description: '',
    websiteLink: '',
    googleBusinessLink: '',
    openingDays: [],
    area: '',
    timeSlots: [{ openingTime: '', closingTime: '' }],
    latitude: '',
    longitude: '',
    panCard: null,
    businessCard: null,
    profileImg: null,
    fcmToken: '',
  });

  const IMAGE_BASE_URL = 'https://www.makeahabit.com/api/v1/uploads/category/';
  const [categoryList, setCategoryList] = useState([]);
  const [errors, setErrors] = useState({});
  const [fcmToken, setFcmToken] = useState('');

  const [showTimePicker, setShowTimePicker] = useState({
    visible: false,
    slotIndex: null,
    type: '',
  });

  const [imagePreviewUri, setImagePreviewUri] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const toAmPmFromDate = date => {
    let hh = date.getHours();
    const mm = date.getMinutes();
    const suffix = hh >= 12 ? 'PM' : 'AM';

    hh = hh % 12;
    if (hh === 0) hh = 12;

    return `${hh.toString().padStart(2, '0')}:${mm
      .toString()
      .padStart(2, '0')} ${suffix}`;
  };

  const amPmToDate = time => {
    if (!time) return new Date();
    const m = /^(0[1-9]|1[0-2]):([0-5][0-9])\s(AM|PM)$/.exec(time);
    if (!m) return new Date();

    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const suf = m[3];

    if (suf === 'PM' && hh !== 12) hh += 12;
    if (suf === 'AM' && hh === 12) hh = 0;

    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('vendorEmail');

        if (savedEmail) {
          updateField('email', savedEmail);
        }
      } catch (e) {
        console.log('Error retrieving email:', e);
      }
    };

    getEmailFromStorage();
  }, []);

  useEffect(() => {
    async function fetchFcmToken() {
      try {
        const token = await messaging().getToken();
        updateField('fcmToken', token); // ✅ SAME KEY
      } catch (e) {
        console.log('FCM error', e);
      }
    }
    fetchFcmToken();
  }, []);

  useEffect(() => {
    axios
      .get('https://www.makeahabit.com/api/v1/category/get-all')
      .then(response => {
        const data = response.data;
        if (data.success && data.categories) {
          setCategoryList(data.categories);
        } else {
          setCategoryList([]);
        }
      })
      .catch(err => console.log('Error fetching categories:', err));
  }, []);

  useEffect(() => {
    if (success && data) {
      Alert.alert('Success', 'Business registered successfully!');
      console.log('data of ctt redux : ', data);
      if (data?.data?.role === 1) {
        const token = data?.token;
        const userId = data?.data?._id;
        AsyncStorage.setItem('vendorToken', token);
        AsyncStorage.setItem('vendorId', userId);

        navigation.navigate('VendorTab');
      }
      dispatch(resetVendorState());
    } else if (error) {
      Alert.alert('Error', String(error));
      dispatch(resetVendorState());
    }
  }, [success, error, data, dispatch, navigation]);

  function updateField(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function toggleDay(day) {
    updateField(
      'openingDays',
      form.openingDays.includes(day)
        ? form.openingDays.filter(d => d !== day)
        : [...form.openingDays, day],
    );
  }

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker({ visible: false, slotIndex: null, type: '' });
      return;
    }

    const formatted = toAmPmFromDate(selectedTime);

    setForm(prev => {
      const updated = [...prev.timeSlots];
      updated[showTimePicker.slotIndex] = {
        ...updated[showTimePicker.slotIndex],
        [showTimePicker.type === 'opening' ? 'openingTime' : 'closingTime']:
          formatted,
      };
      return { ...prev, timeSlots: updated };
    });

    setShowTimePicker({ visible: false, slotIndex: null, type: '' });
  };

  const handleRegister = () => {
    const invalidSlot = form.timeSlots.some(
      s => !s.openingTime || !s.closingTime,
    );

    if (invalidSlot) {
      Alert.alert('Validation', 'Please fill all time slots');
      return;
    }

    const formData = new FormData();

    // ✅ TEXT FIELDS
    Object.keys(form).forEach(key => {
      if (
        ![
          'profileImg',
          'panCard',
          'businessCard',
          'timeSlots',
          'openingDays',
        ].includes(key)
      ) {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, String(form[key]));
        }
      }
    });

    // ✅ ARRAYS
    formData.append('openingDays', JSON.stringify(form.openingDays));
    formData.append('timeSlots', JSON.stringify(form.timeSlots));

    // ✅ IMAGE (ONLY ONE — SAME AS GALLERY)
    if (form.profileImg) {
      formData.append('img', form.profileImg);
    }

    console.log('📦 Final FormData ready');

    dispatch(registerVendor(formData));
  };

  const pickImage = async field => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
      },
      async res => {
        if (res.didCancel || !res.assets?.[0]) return;

        try {
          const asset = res.assets[0];

          const resized = await ImageResizer.createResizedImage(
            asset.uri,
            900,
            900,
            'JPEG',
            75,
            0,
          );

          // ✅ STORE FULL OBJECT (IMPORTANT)
          updateField(field, {
            uri: resized.uri,
            type: 'image/jpeg',
            name: asset.fileName || 'vendor.jpg',
          });
        } catch (err) {
          console.log('Image resize error:', err);
          Alert.alert('Error', 'Unable to process image');
        }
      },
    );
  };

  const removeImage = field => updateField(field, null);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        updateField('latitude', latitude.toString());
        updateField('longitude', longitude.toString());
        try {
          const json = await Geocoder.from(latitude, longitude);
          if (json.results.length > 0) {
            const addr = json.results[0];
            const comps = addr.address_components;
            const getComp = type =>
              (comps.find(c => c.types.includes(type)) || {}).long_name || '';
            updateField('state', getComp('administrative_area_level_1'));
            updateField('city', getComp('locality') || getComp('sublocality'));
            updateField('pincode', getComp('postal_code'));
            updateField('address', addr.formatted_address);
          }
        } catch {
          Alert.alert('Error', 'Unable to get address.');
        }
      },
      () => Alert.alert('Error', 'Unable to fetch location'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Registration</Text>
      <Text style={styles.sectionLabel}>Owner Details</Text>
      <ImageUpload
        label="Upload Profile Image"
        icon="account-circle-outline"
        image={form.profileImg}
        onPress={() => pickImage('profileImg')}
        onRemove={() => removeImage('profileImg')}
        onPreview={setImagePreviewUri}
        error={errors.profileImg}
      />
      <FormInput
        label="Full Name"
        icon="account-outline"
        value={form.fullName}
        onChangeText={text => updateField('fullName', text)}
        placeholder="Enter full name"
        error={errors.fullName}
      />
      <FormInput
        label="Mobile Number"
        icon="phone"
        value={form.mobileNumber}
        onChangeText={v => updateField('mobileNumber', v)}
        keyboardType="phone-pad"
        placeholder="10-digit mobile number"
        error={errors.mobileNumber}
      />
      <FormInput
        label="Email"
        icon="email"
        value={form.email}
        // onChangeText={v => updateField('email', v)}
        editable={false}
        keyboardType="email-address"
        placeholder="you@example.com"
        error={errors.email}
      />
      {/* Gender */}
      <CustomDropdown
        label="Gender"
        icon="gender-male-female"
        selectedValue={form.gender}
        onValueChange={v => updateField('gender', v)}
        options={[
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ]}
        error={errors.gender}
      />
      {/* Business Info */}
      <Text style={styles.sectionLabel}>Business Info</Text>
      <FormInput
        label="Business Name"
        icon="store-outline"
        value={form.businessName}
        onChangeText={text => updateField('businessName', text)}
        placeholder="Enter Business Name"
      />
      <FormInput
        label="Business Type"
        icon="briefcase-outline"
        value={form.businessType}
        onChangeText={text => updateField('businessType', text)}
        placeholder="Enter Business Type"
      />
      <FormInput
        label="Website Link"
        icon="web"
        value={form.websiteLink}
        onChangeText={text => updateField('websiteLink', text)}
        placeholder="Enter Website URL"
      />
      <FormInput
        label="Google Business Link"
        icon="google"
        value={form.googleBusinessLink}
        onChangeText={text => updateField('googleBusinessLink', text)}
        placeholder="Enter Google Business URL"
      />
      <FormInput
        label="Aadhar Number"
        icon="card-account-details-outline"
        value={form.aadharNumber}
        onChangeText={text => updateField('aadharNumber', text)}
        placeholder="Enter Aadhar number"
      />
      <FormInput
        label="GST Number"
        icon="file-document"
        value={form.gstNumber}
        onChangeText={text => updateField('gstNumber', text)}
        placeholder="Enter GST number"
      />
      {/* Categories */}
      <Text style={[styles.sectionLabel, { marginVertical: 10 }]}>
        Category
      </Text>
      <View style={styles.daysRow}>
        {categoryList.map(cat => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.dayBtn,
              form.category === cat._id && styles.dayBtnSelected,
              { paddingHorizontal: 13, alignItems: 'center' },
            ]}
            onPress={() => updateField('category', cat._id)}
          >
            <Image
              source={{ uri: IMAGE_BASE_URL + (cat.img || cat.image) }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                marginBottom: 5,
              }}
            />
            <Text
              style={[
                styles.dayText,
                form.category === cat._id && styles.dayTextActive,
                { textAlign: 'center' },
              ]}
            >
              {cat.name || cat.category_name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && <Text style={styles.error}>{errors.category}</Text>}
      <FormInput
        label="Description"
        icon="comment-outline"
        value={form.description}
        onChangeText={text => updateField('description', text)}
        placeholder="Short business description"
        multiline
      />
      <ImageUpload
        label="Upload Pan Card"
        icon="card-account-details-outline"
        image={form.panCard}
        onPress={() => pickImage('panCard')}
        onRemove={() => removeImage('panCard')}
        onPreview={setImagePreviewUri}
        error={errors.panCard}
      />
      <ImageUpload
        label="Upload Business Card"
        icon="credit-card-outline"
        image={form.businessCard}
        onPress={() => pickImage('businessCard')}
        onRemove={() => removeImage('businessCard')}
        onPreview={setImagePreviewUri}
        error={errors.businessCard}
      />
      {/* Address & Location */}
      <Text style={styles.sectionLabel}>Address & Location</Text>
      <FormInput
        label="Address"
        icon="home-map-marker"
        value={form.address}
        onChangeText={v => updateField('address', v)}
        placeholder="Shop/building address"
      />
      <FormInput
        label="State"
        icon="map-marker"
        value={form.state}
        onChangeText={v => updateField('state', v)}
        placeholder="e.g. Maharashtra"
      />
      <FormInput
        label="City"
        icon="city"
        value={form.city}
        onChangeText={v => updateField('city', v)}
        placeholder="e.g. Mumbai"
      />
      <FormInput
        label="Pin code"
        icon="google-maps"
        value={form.pincode}
        onChangeText={v => updateField('pincode', v)}
        keyboardType="number-pad"
        placeholder="6-digit area code"
      />
      <FormInput
        label="Area"
        icon="map-marker-radius"
        value={form.area}
        onChangeText={v => updateField('area', v)}
        placeholder="Enter area / locality"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#14ad5f' }]}
        onPress={getCurrentLocation}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>
          Autofill with Current Location
        </Text>
      </TouchableOpacity>
      {/* Timings */} <Text style={styles.sectionLabel}>Timings</Text>
      <View style={styles.daysRow}>
        {daysList.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayBtn,
              form.openingDays.includes(day) && styles.dayBtnSelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                form.openingDays.includes(day) && styles.dayTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionLabel}>Time Slots</Text>
      {form.timeSlots.map((slot, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <View style={styles.timeRowContainer}>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() =>
                setShowTimePicker({
                  visible: true,
                  slotIndex: index,
                  type: 'opening',
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
                  visible: true,
                  slotIndex: index,
                  type: 'closing',
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

          {form.timeSlots.length > 1 && (
            <TouchableOpacity
              onPress={() =>
                setForm(f => ({
                  ...f,
                  timeSlots: f.timeSlots.filter((_, i) => i !== index),
                }))
              }
              style={{ alignSelf: 'flex-end', marginTop: 4 }}
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
          setForm(f => ({
            ...f,
            timeSlots: [...f.timeSlots, { openingTime: '', closingTime: '' }],
          }))
        }
        style={[
          styles.button,
          {
            backgroundColor: '#eefaf3',
            borderWidth: 1,
            borderColor: '#14ad5f',
          },
        ]}
      >
        <Text style={{ color: '#14ad5f', fontWeight: '700' }}>
          Add Time Slot
        </Text>
      </TouchableOpacity>
      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="#14ad5f" />}
      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register Business</Text>
      </TouchableOpacity>
      {/* Category modal for list selection by name if preferred */}
      <Modal visible={false} transparent animationType="fade">
        {/* Custom category modal if desired */}
      </Modal>
      {/* Full Image Preview Modal */}
      <Modal
        visible={!!imagePreviewUri}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePreviewUri(null)}
      >
        <View style={styles.modalOverlay}>
          <Image
            source={{ uri: imagePreviewUri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={() => setImagePreviewUri(null)}
          >
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Time Picker */}
      {showTimePicker.visible && (
        <DateTimePicker
          value={amPmToDate(
            form.timeSlots[showTimePicker.slotIndex]?.[
              showTimePicker.type === 'opening' ? 'openingTime' : 'closingTime'
            ],
          )}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
}

function CustomDropdown({
  label,
  icon,
  selectedValue,
  onValueChange,
  options,
  error,
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownToggle, error && { borderColor: 'crimson' }]}
        onPress={() => setVisible(!visible)}
        accessible
        accessibilityLabel={`${label} dropdown`}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color="#14ad5f"
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            styles.dropdownToggleText,
            !selectedValue ? { color: '#999' } : { color: '#222' },
          ]}
        >
          {selectedLabel || `Select ${label}`}
        </Text>
        <MaterialCommunityIcons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#14ad5f"
        />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled
            />
          </View>
        </TouchableOpacity>
      </Modal>
      {error && (
        <Text style={{ color: 'crimson', marginTop: 2, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

function FormInput({ label, icon, style, error, ...props }) {
  return (
    <View style={[styles.inputRow, style]}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color="#14ad5f"
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={props.placeholder || `Enter ${label}`}
          placeholderTextColor="#bbb"
          {...props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

function ImageUpload({
  label,
  icon,
  image,
  onPress,
  onRemove,
  onPreview,
  error,
}) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={onPress}
        accessible
        accessibilityLabel={label}
      >
        <MaterialCommunityIcons name={icon} size={25} color="#14ad5f" />
        <Text style={styles.uploadText}>{label}</Text>
        {image && (
          <TouchableOpacity onPress={() => onPreview(image)}>
            <Image source={{ uri: image }} style={styles.previewImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {image && (
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Text style={{ color: '#c00', fontWeight: 'bold' }}>Remove</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7fa', padding: 14 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#14ad5f',
    textAlign: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    color: '#14ad5f',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f4f5fa',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputLabel: {
    color: '#222',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  input: {
    height: 35,
    fontSize: 13,
    color: '#222',
    borderBottomWidth: 1.1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f4f5fa',
  },
  dropdownToggleText: {
    flex: 1,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    width: '86%',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#222',
  },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 7 },
  dayBtn: {
    backgroundColor: '#ececec',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginRight: 6,
    marginBottom: 6,
  },
  dayBtnSelected: { backgroundColor: '#14ad5f33' },
  dayText: { color: '#222', padding: 6, fontWeight: '600', fontSize: 13 },
  dayTextActive: { color: '#14ad5f' },
  timeRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  timeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f5fa',
    borderRadius: 8,
    padding: 10,
  },
  timeText: { marginLeft: 8, color: '#333', fontSize: 14, fontWeight: '500' },
  button: {
    backgroundColor: '#14ad5f',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 16,
    marginBottom: 36,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#14ad5f66',
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  uploadText: { color: '#14ad5f', fontWeight: '600', marginTop: 5 },
  previewImage: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
  removeBtn: { alignSelf: 'flex-end', marginRight: 10, marginBottom: 6 },
  error: { color: 'crimson', fontSize: 12, marginTop: 2, marginLeft: 2 },
  fullImage: { width: '80%', height: '60%' },
  closeModalBtn: {
    position: 'absolute',
    top: 45,
    right: 32,
    backgroundColor: '#111c',
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 15,
  },
});
