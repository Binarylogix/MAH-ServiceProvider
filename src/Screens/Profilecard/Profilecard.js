import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ name, email, profileImage }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Gradient Border Around Avatar */}
        <LinearGradient
          colors={['#00D65F', '#01823A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <Icon
                name="account-circle"
                size={90}
                color="#81c784"
                style={{
                  backgroundColor: '#f0f8f4',
                  borderRadius: 50,
                  overflow: 'hidden',
                }}
              />
            )}
          </View>
        </LinearGradient>

        {/* Right side (name, email, button) */}
        <View style={styles.headerRight}>
          <Text style={styles.name}>{name || 'User'}</Text>
          <Text style={styles.username}>{email || '@mail.com'}</Text>

          {/* Gradient Button */}
          <TouchableOpacity activeOpacity={0.8} style={styles.editProfileBtn}>
            <LinearGradient
              colors={['#00D65F', '#01823A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginTop:10 ,backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#0b5e20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  headerRight: {
    flex: 1,
    marginLeft: 22,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: 'black',
    marginBottom: 6,
  },
  username: {
    fontSize: 16,
    color: '#969696ff',
    opacity: 0.85,
    marginBottom: 10,
  },

  // Gradient button styles
  editProfileBtn: { borderRadius: 25, overflow: 'hidden', alignSelf: 'flex-start' },
  gradientBtn: {
    paddingVertical: 8,
    paddingHorizontal: 34,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#00b14f',
    shadowOpacity: 0.45,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 5 },
  },
  editProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.48,
  },

  // Gradient border around profile image
  gradientBorder: {
    borderRadius: 52,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#00b14f',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarWrapper: {
    backgroundColor: '#f9fff4',
    borderRadius: 52,
    overflow: 'hidden',
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 52,
  },
});
