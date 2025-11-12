import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../../redux/Vendor/transactionSlice';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = size => (SCREEN_WIDTH / 360) * size;

export default function TransactionScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchTransactions());
    } finally {
      setRefreshing(false);
    }
  };

  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    state => state.transaction,
  );

  const [activeTab, setActiveTab] = useState('today');
  const [searchText, setSearchText] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // 🕒 Filter by tab and search text
  const filteredTransactions = transactions.filter(txn => {
    // Skip if no valid date
    if (!txn?.createdAt) return false;

    const txnDate = new Date(txn.createdAt);
    const today = new Date();
    const isToday =
      txnDate.getDate() === today.getDate() &&
      txnDate.getMonth() === today.getMonth() &&
      txnDate.getFullYear() === today.getFullYear();

    // Filter by tab (today / total)
    if (activeTab === 'today' && !isToday) return false;

    // Filter by search text
    if (searchText) {
      const text = searchText.toLowerCase();
      return (
        txn?.transactionId?.toLowerCase()?.includes(text) ||
        txn?.user?.fullName?.toLowerCase()?.includes(text)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#18A558" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e6f0c1ff', '#fbfffdff']} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#AAA"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'today' && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab('today')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'today' && styles.tabTextActive,
              ]}
            >
              Today's Transactions
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
              Total Transactions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredTransactions}
            keyExtractor={item => item._id || item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedTransaction(item)}
                style={styles.transactionRow}
              >
                <Text style={styles.idx}>{index + 1}</Text>
                <View style={styles.infoCol}>
                  <Text style={styles.txnId}>
                    {item?.user?.fullName || item._id}
                  </Text>
                  <View>
                    <Text style={styles.name}>
                      {item.transactionId || item._id}
                    </Text>
                    <Text style={styles.date}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.tid}>{item.tid || '-'}</Text>
                <Text style={styles.amount}>₹{item.amount || '-'}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', marginTop: 20, color: '#999' }}
              >
                {activeTab === 'today'
                  ? 'No transactions for today.'
                  : 'No transactions found.'}
              </Text>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>

        {/* Detail Modal */}
        <Modal
          visible={!!selectedTransaction}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedTransaction(null)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              <ScrollView>
                <Text style={styles.modalTitle}>Transaction Details</Text>

                {selectedTransaction && (
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={styles.modalLabel}>Name:</Text>
                      <Text style={styles.modalValue}>
                        {selectedTransaction.user?.fullName || '-'}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={styles.modalLabel}>TID:</Text>
                      <Text
                        style={styles.modalValue}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {selectedTransaction.transactionId ||
                          selectedTransaction._id}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={styles.modalLabel}>Date:</Text>
                      <Text style={styles.modalValue}>
                        {selectedTransaction.createdAt
                          ? new Date(
                              selectedTransaction.createdAt,
                            ).toLocaleString()
                          : '-'}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Text style={styles.modalLabel}>Amount:</Text>
                      <Text style={styles.modalValue}>
                        ₹{selectedTransaction.amount || '-'}
                      </Text>
                    </View>

                    {/* Add more fields as required */}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedTransaction(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(14),
    paddingTop: scale(18),
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    paddingHorizontal: scale(15),
    paddingVertical: scale(2),
    marginBottom: scale(6),
    elevation: 4,
    shadowColor: '#18A558',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: scale(6),
  },
  searchInput: {
    color: '#222',
    fontSize: scale(12),
    // height: scale(30),
  },
  tabRow: {
    flexDirection: 'row',
    // marginBottom: scale(10),
    backgroundColor: '#fff',
    borderRadius: scale(12),
    // paddingTop: scale(4),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: scale(8),
    borderRadius: scale(10),
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#18A558',
    shadowColor: '#18A558',
    shadowOpacity: 0.25,
    borderRadius: scale(10),
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: scale(8),
  },
  tabText: {
    color: '#0a0a0aff',
    fontWeight: 'bold',
    fontSize: scale(12),
  },
  tabTextActive: {
    color: '#fff',
  },
  listWrapper: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    marginTop: scale(10),
    paddingBottom: scale(8),
    elevation: 3,
    shadowColor: '#18A558',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: scale(10),
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(15),
    // borderBottomWidth: 1.2,
    // borderBottomColor: '#eee',
  },
  idx: {
    width: scale(25),
    color: '#419761',
    // fontWeight: '600',
    fontSize: scale(14),
  },
  infoCol: {
    flex: 2,
    marginLeft: scale(2),
  },
  txnId: {
    fontWeight: '500',
    fontSize: scale(12),
    color: '#222',
  },
  name: {
    color: '#3887F6',
    fontWeight: '600',
    fontSize: scale(10),
    // marginRight: scale(7),
  },
  date: {
    color: '#84939A',
    fontSize: scale(12),
  },
  tid: {
    flex: 1,
    color: '#168D64',
    fontWeight: '600',
    fontSize: scale(12),
    textAlign: 'center',
  },
  amount: {
    width: scale(80),
    color: '#0e0e0eff',
    fontWeight: 'bold',
    fontSize: scale(14),
    textAlign: 'right',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
    // marginTop: 8,
  },
  modalValue: {
    fontSize: 14,
    color: '#222',
    // marginTop: 8,
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: '#18A558',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
