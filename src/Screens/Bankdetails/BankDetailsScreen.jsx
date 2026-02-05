import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBankDetailsAPI,
  getBankDetailsAPI,
  clearBankState,
} from '../../redux/Vendor/bankDetailsSlice';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

export default function BankDetailsScreen() {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { bankDetails, loading } = useSelector(state => state.bankDetails);

  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(true); // ✅ NEW STATE

  const [form, setForm] = useState({
    accountHolderName: '',
    bankName: '',
    ifsc: '',
    accountNumber: '',
  });

  // Initial fetch
  useEffect(() => {
    dispatch(getBankDetailsAPI());
  }, [dispatch]);

  // Realtime refresh when screen focused
  useEffect(() => {
    if (isFocused) {
      dispatch(getBankDetailsAPI());
    }
  }, [isFocused, dispatch]);

  // ✅ REAL-TIME VALIDATION ON FORM CHANGE
  useEffect(() => {
    const newErrors = {};

    // Account Holder Name validation
    if (!form.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    } else if (form.accountHolderName.trim().length < 2) {
      newErrors.accountHolderName = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(form.accountHolderName.trim())) {
      newErrors.accountHolderName =
        'Name should contain only letters and spaces';
    }

    // Bank Name validation
    if (!form.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    } else if (form.bankName.trim().length < 2) {
      newErrors.bankName = 'Bank name must be at least 2 characters';
    }

    // IFSC validation
    if (!form.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) {
      newErrors.ifsc = 'Invalid IFSC format (e.g., SBIN0001234)';
    }

    // Account Number validation
    if (!form.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(form.accountNumber.trim())) {
      newErrors.accountNumber = 'Account number must be 9-18 digits';
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0); // ✅ UPDATE VALID STATE
  }, [form]); // ✅ RUN ON EVERY FORM CHANGE

  const handleSubmit = () => {
    if (!formValid) return;

    Alert.alert(
      'Confirm Bank Details',
      'Are you sure you want to confirm your bank details?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Confirm',
          onPress: () => {
            const validForm = {
              ...form,
              ifsc: form.ifsc.toUpperCase().trim(),
            };

            dispatch(addBankDetailsAPI(validForm)).then(res => {
              if (!res.error) {
                setModalVisible(false);
                setForm({
                  accountHolderName: '',
                  bankName: '',
                  ifsc: '',
                  accountNumber: '',
                });
                setErrors({});
                dispatch(clearBankState());
                dispatch(getBankDetailsAPI());
              }
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <HeaderLeft title="Bank Details" />
        {!bankDetails && !loading && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <LinearGradient
              colors={['#00D65F', '#01823A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtn}
            >
              <Text style={styles.btnText}>Add Details</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* CONTENT */}
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
        <View style={styles.emptyContainer}>
          <Icon name="bank-off-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Bank Details Found...</Text>
          <Text style={styles.emptySubtitle}>
            Add your bank account details to receive payments.
          </Text>
        </View>
      )}

      <Text style={styles.infoText}>
        To change your bank details, please contact admin.
      </Text>

      {/* ADD BANK DETAILS MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Bank Details</Text>

            <Input
              icon="account"
              placeholder="Account Holder Name"
              value={form.accountHolderName}
              onChangeText={v => handleInputChange('accountHolderName', v)}
              error={errors.accountHolderName}
            />

            <Input
              icon="office-building"
              placeholder="Bank Name"
              value={form.bankName}
              onChangeText={v => handleInputChange('bankName', v)}
              error={errors.bankName}
            />

            <Input
              icon="identifier"
              placeholder="IFSC Code (e.g., SBIN0001234)"
              value={form.ifsc}
              onChangeText={v => handleInputChange('ifsc', v.toUpperCase())}
              error={errors.ifsc}
            />

            <Input
              icon="credit-card-outline"
              placeholder="Account Number"
              keyboardType="numeric"
              value={form.accountNumber}
              onChangeText={v => handleInputChange('accountNumber', v)}
              error={errors.accountNumber}
            />

            {/* ✅ FIXED BUTTON - Uses formValid state */}
            <TouchableOpacity
              style={[styles.submitBtn, !formValid && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!formValid}
            >
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

const Input = ({ icon, error, ...props }) => (
  <View style={styles.inputContainer}>
    <View style={[styles.inputBox, error && styles.inputBoxError]}>
      <Icon name={icon} size={20} color="#555" />
      <TextInput style={styles.input} {...props} />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  infoText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addBtn: {
    width: 100,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
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
  inputContainer: {
    marginBottom: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  inputBoxError: {
    borderColor: '#e04444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#e04444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  submitBtnDisabled: {
    backgroundColor: '#ccc',
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
