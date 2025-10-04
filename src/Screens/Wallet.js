import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const transactions = [
  { id: '1', type: 'MM Coin', date: 'Today 12:32', amount: -35.23 },
  { id: '2', type: 'MM Coin', date: 'Yesterday 02:12', amount: 30.0 },
  { id: '3', type: 'MM Coin', date: 'Dec 24 13:53', amount: -13.0 },
  { id: '4', type: 'MM Coin', date: 'Today 12:32', amount: -35.23 },
  { id: '5', type: 'MM Coin', date: 'Yesterday 02:12', amount: 30.0 },
];

const Wallet = () => {
  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🪙</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount > 0 ? '#4CAF50' : '#FF3B30' },
        ]}
      >
        {item.amount > 0 ? `+${item.amount}` : `${item.amount}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header / Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.greeting}>Hello, User!</Text>
        <Text style={styles.balanceLabel}>MM Coin Balance</Text>
        <Text style={styles.balanceAmount}>1,235.34</Text>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.headerText}>Latest Transactions</Text>
        <Text style={styles.viewAll}>View all</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  balanceCard: {
    backgroundColor: '#FFB74D', // Warm light gradient feel
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  greeting: {
    color: '#333',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceLabel: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#000',
    fontSize: 36,
    fontWeight: 'bold',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAll: {
    color: '#888',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#DDD',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  transactionDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Wallet;
