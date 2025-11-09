import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function TransactionScreen() {
  const [activeTab, setActiveTab] = useState('today');

  // Example transaction data
  const transactions = [
    {
      id: '1',
      transactionId: 'ID1676267267727',
      name: 'NAME',
      date: '15-12-2024',
      tid: 'TID74246138',
      amount: 300,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#AAA"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'today' && styles.tabBtnActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'today' && styles.tabTextActive,
            ]}
          >
            Today's Transaction
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'transaction' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('transaction')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'transaction' && styles.tabTextActive,
            ]}
          >
            Transaction
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <View style={styles.listWrapper}>
        {/* <Text style={styles.listTitle}>TRANSACTION</Text> */}
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <Text style={styles.idx}>1</Text>
              <View style={styles.infoCol}>
                <Text style={styles.txnId}>{item.transactionId}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.tid}>{item.tid}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 11,
    paddingTop: 16,
  },
  searchBar: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchInput: {
    color: '#fff',
    fontSize: 15,
    height: 36,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 13,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginRight: 8,
    paddingVertical: 8,
    elevation: 2,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#00D65F',
  },
  tabText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#fff',
  },
  listWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  listTitle: {
    color: '#14AD5F',
    fontWeight: 'bold',
    fontSize: 13,
    // borderBottomWidth: 1,
    borderBottomColor: '#14AD5F',
    padding: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  idx: {
    width: 24,
    color: '#111',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCol: {
    flex: 2,
    marginLeft: 4,
  },
  txnId: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
  },
  name: {
    color: '#2e57af',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 7,
  },
  date: {
    color: '#7F7F7F',
    fontSize: 11,
  },
  tid: {
    flex: 1,
    color: '#14AD5F',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  amount: {
    width: 45,
    color: '#111',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'right',
  },
});
