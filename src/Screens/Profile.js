import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const profileImg = { uri: 'https://randomuser.me/api/portraits/men/1.jpg' }; // Replace with actual data

const menuOptions = [
  { icon: 'translate', label: 'language' },
  { icon: 'car-wash', label: 'Service' },
  { icon: 'account-outline', label: 'Staff' },
  { icon: 'cube-outline', label: 'Products' },
  { icon: 'image-multiple-outline', label: 'Gallery' },
  { icon: 'information-outline', label: 'Help and support' },
  { icon: 'clipboard-text-outline', label: 'Terms & Conditions' },
  { icon: 'shield-account-outline', label: 'Privacy and policy' },
  { icon: 'logout', label: 'Log out', highlight: true },
];

export default function Profile() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        {/* Profile Card */}
        <TouchableOpacity activeOpacity={0.85}>
          <View style={styles.profileCard}>
            <Image source={profileImg} style={styles.profileImg} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Rohit</Text>
              <Text style={styles.profileEmail}>Rohit@gmail.com</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color="#fff"
              style={{ alignSelf: 'flex-start' }}
            />
          </View>
        </TouchableOpacity>
        {/* Menu Options */}
        <View style={styles.list}>
          {menuOptions.map(({ icon, label, highlight }, idx) => (
            <TouchableOpacity
              style={styles.listRow}
              key={idx}
              activeOpacity={0.7}
            >
              <View style={styles.leftGroup}>
                <MaterialCommunityIcons
                  name={icon}
                  size={25}
                  color={highlight ? '#e04444' : '#111'}
                  style={highlight && { marginLeft: 3 }}
                />
                <Text
                  style={[styles.listLabel, highlight && { color: '#e04444' }]}
                >
                  {label}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={25}
                color="#161616"
                style={{ opacity: label === 'Log out' ? 0 : 1 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileCard: {
    backgroundColor: '#14ad5f',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 18,
    shadowColor: '#14ad5f33',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: { flex: 1 },
  profileName: { color: '#111', fontWeight: 'bold', fontSize: 20 },
  profileEmail: { color: '#ececec', fontSize: 14, marginTop: 2 },
  list: { marginTop: 20 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.7,
    borderBottomColor: '#e7e8ec',
    justifyContent: 'space-between',
    paddingVertical: 17,
  },
  leftGroup: { flexDirection: 'row', alignItems: 'center' },
  listLabel: { fontSize: 16, marginLeft: 16, color: '#181818' },
});
