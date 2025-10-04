import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Switch,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';

const { width } = Dimensions.get('window');

// 🔹 Dummy Orders Data
const orders = [
  {
    id: '1',
    name: 'Lokendra Singh',
    address: 'Indrapuri, Sector A, Bhopal',
    cod: '₹999',
    pq: '10',
  },
  {
    id: '2',
    name: 'Ravi Sharma',
    address: 'Kolar Road, Bhopal',
    cod: '₹750',
    pq: '8',
  },
];

// 🔹 Reusable Gradient Box Component
const GradientBox = ({ value }) => (
  <LinearGradient
    colors={['#EC4E31', '#40196C']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientTextBox}
  >
    <Text style={styles.statValueOne}>{value}</Text>
  </LinearGradient>
);

export default function OrderScreenIndex() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(prev => !prev);

  // 🔹 Order Item Render
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderBox}>
      <Image
        source={require('../../../assets/Order.jpg')}
        style={styles.orderImg}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.orderName}>{item.name}</Text>
        <Text style={styles.orderAddr}>{item.address}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.orderCod}>{item.cod}</Text>
        <Text style={styles.orderPq}>PQ: {item.pq}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <LinearGradient
        colors={['#EC4E31', '#40196C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerBg}
      >
        <View style={styles.headerRow}>
          <Text style={styles.hiUser}>Hi User</Text>
          <Image
            source={require('../../../assets/Order.jpg')}
            style={styles.avatar}
          />
        </View>

        <View style={styles.userBox}>
          <Text style={styles.userId}>User id #442123456</Text>
          <Text style={styles.userName}>Lokendra Solanki</Text>

          {/* Switch */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Active</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#40196C' }}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </LinearGradient>

      {/* 🔹 Body */}
      <View style={styles.body}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Today new Orders</Text>
            <Text style={styles.statValue}>Pending{'\n'}Orders</Text>
            <GradientBox value="01" />
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Your Orders</Text>
            <Text style={styles.statValue}>Pending{'\n'}Orders</Text>
            <GradientBox value="07" />
          </View>
        </View>

        {/* Earnings */}
        <View style={styles.earningsRow}>
          <View style={[styles.earningBox, styles.withDivider]}>
            <Text style={styles.earningText}>Today you earned</Text>
            <Text style={styles.earningAmount}>₹500</Text>
            <Text style={styles.earningText}>20 Orders</Text>
          </View>
          <View style={styles.earningBox}>
            <Text style={styles.earningText}>This week you earned</Text>
            <Text style={styles.earningAmount}>₹7000</Text>
            <Text style={styles.earningText}>80 Orders</Text>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity style={styles.btnWrapper} activeOpacity={0.8}>
          <LinearGradient
            colors={['#EC4E31', '#40196C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>Withdraw Money</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Orders Section */}
        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>New Orders</Text>
          <Icon name="chevron-small-right" size={35} color="#40196C" />
        </View>

        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerBg: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 160,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hiUser: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  userBox: {
    position: 'absolute',
    top: 80,
    left: '7%',
    right: '7%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    alignItems: 'center',
    zIndex: 10,
  },
  userId: { fontSize: 14, color: '#666' },
  userName: { fontSize: 16, fontWeight: '600', marginVertical: 5 },
  switchRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '45%',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginRight: 5,
  },
  body: { marginHorizontal: 15 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  statBox: {
    marginTop: 50,
    backgroundColor: '#e3e2e2ff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    backgroundColor: 'black',
    paddingHorizontal: 4,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  gradientTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 30,
    marginTop: 15,
  },
  statValueOne: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  earningBox: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  withDivider: { borderRightWidth: 1, borderRightColor: '#ddd' },
  earningAmount: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  earningText: { fontSize: 13, color: '#444', fontWeight: '600' },
  btnWrapper: { marginTop: 15, alignItems: 'center' },
  gradientBtn: {
    width: '55%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  ordersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  orderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  orderImg: { width: 45, height: 45, borderRadius: 22, marginRight: 12 },
  orderName: { fontWeight: 'bold', fontSize: 14 },
  orderAddr: { fontSize: 12, color: '#777' },
  orderCod: { fontWeight: 'bold', color: '#EC4E31' },
  orderPq: { color: '#555', fontSize: 12 },
});
