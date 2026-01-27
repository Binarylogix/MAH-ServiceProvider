import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBankDetailsAPI,
  getBankDetailsAPI,
  clearBankState,
} from '../../redux/Vendor/bankDetailsSlice';
import HeaderLeft from '../../Component/Header/HeaderLeft';

export default function BankDetailsScreen() {
  const dispatch = useDispatch();

  const { bankDetails, loading } = useSelector(state => state.bankDetails);

  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({
    accountHolderName: '',
    bankName: '',
    ifsc: '',
    accountNumber: '',
  });

  useEffect(() => {
    dispatch(getBankDetailsAPI());
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(addBankDetailsAPI(form)).then(res => {
      if (!res.error) {
        setModalVisible(false);
        dispatch(clearBankState());
        dispatch(getBankDetailsAPI());
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <HeaderLeft title="Bank Details" />

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* BANK DETAILS CARD */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : bankDetails ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="bank" size={36} color="#4CAF50" />
            <Text style={styles.cardTitle}>Bank Account</Text>
          </View>

          <DetailRow
            icon="account"
            label="Account Holder Name"
            value={bankDetails.accountHolderName}
          />

          <DetailRow
            icon="office-building"
            label="Bank Name"
            value={bankDetails.bankName}
          />

          <DetailRow
            icon="identifier"
            label="IFSC Code"
            value={bankDetails.ifsc}
          />

          <DetailRow
            icon="credit-card-outline"
            label="Account Number"
            value={bankDetails.accountNumber}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No bank details added yet</Text>
      )}

      {/* ADD BANK DETAILS MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Bank Details</Text>

            <Input
              icon="account"
              placeholder="Account Holder Name"
              value={form.accountHolderName}
              onChangeText={v => setForm({ ...form, accountHolderName: v })}
            />

            <Input
              icon="office-building"
              placeholder="Bank Name"
              value={form.bankName}
              onChangeText={v => setForm({ ...form, bankName: v })}
            />

            <Input
              icon="identifier"
              placeholder="IFSC Code"
              value={form.ifsc}
              onChangeText={v => setForm({ ...form, ifsc: v })}
            />

            <Input
              icon="credit-card-outline"
              placeholder="Account Number"
              keyboardType="numeric"
              value={form.accountNumber}
              onChangeText={v => setForm({ ...form, accountNumber: v })}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Save Bank Details</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================== REUSABLE COMPONENTS ================== */

const Input = ({ icon, ...props }) => (
  <View style={styles.inputBox}>
    <Icon name={icon} size={20} color="#555" />
    <TextInput style={styles.input} {...props} />
  </View>
);

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={22} color="#4CAF50" />

    <View style={styles.detailText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: '#777',
  },
});
