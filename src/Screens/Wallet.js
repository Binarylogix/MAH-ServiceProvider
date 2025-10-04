import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const transactions = [
  { id: '1', type: 'MM Coin', date: 'Today 12:32', amount: -35.23 },
  { id: '2', type: 'MM Coin', date: 'Yesterday 02:12', amount: 30.0 },
  { id: '3', type: 'MM Coin', date: 'Dec 24 13:53', amount: -13.0 },
  { id: '4', type: 'MM Coin', date: 'Today 12:32', amount: -35.23 },
  { id: '5', type: 'MM Coin', date: 'Yesterday 02:12', amount: 30.0 },
];

const Wallet = () => {
  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🪙</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View
        style={[
          styles.amountContainer,
          { backgroundColor: item.amount > 0 ? '#DFF6E0' : '#FFE6E6' },
        ]}
      >
        <Text
          style={[
            styles.transactionAmount,
            { color: item.amount > 0 ? '#2E7D32' : '#D32F2F' },
          ]}
        >
          {item.amount > 0 ? `+${item.amount}` : `${item.amount}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <LinearGradient
        colors={['#01823A', '#00D65F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.greeting}>Hello, User!</Text>
        <Text style={styles.balanceLabel}>MM Coin Balance</Text>
        <Text style={styles.balanceAmount}>Rs 1,235.34</Text>
      </LinearGradient>

      {/* Transactions Header */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.headerText}>Latest Transactions</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  greeting: { color: '#fff', fontSize: 18, fontWeight: '500', marginBottom: 5 },
  balanceLabel: { color: '#FFEDE7', fontSize: 14, marginBottom: 12 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold' },

  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  headerText: { fontSize: 16, fontWeight: '600', color: '#333' },
  viewAll: { fontSize: 14, color: '#888' },

  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: { fontSize: 22 },

  transactionDetails: { flex: 1 },
  transactionType: { fontSize: 15, fontWeight: '600', color: '#333' },
  transactionDate: { fontSize: 12, color: '#999', marginTop: 2 },

  amountContainer: {
    minWidth: 70,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  transactionAmount: { fontWeight: '700', fontSize: 14 },
});

export default Wallet;
