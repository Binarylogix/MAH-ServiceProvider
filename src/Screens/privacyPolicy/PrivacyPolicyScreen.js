import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import HeaderLeft from '../../Component/Header/HeaderLeft';
import axios from 'axios';

const PrivacyPolicyScreen = () => {
  const { width } = Dimensions.get('window');
  const [policyHtml, setPolicyHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await axios.get(
        'https://www.makeahabit.com/api/v1/privacy/get',
      );
      if (res.data?.success) {
        const { title, appName, introduction, sections, agreement } =
          res.data.policy;

        // Combine title, app name (bold), introduction (bold), sections, agreement
        const rawText = `
<strong>${title}</strong><br/>
<strong>${appName}</strong><br/><br/>
<strong>Introduction</strong><br/>
${introduction}<br/><br/>
${sections}<br/><br/>
${agreement}
        `;

        setPolicyHtml(formatText(rawText));
      } else {
        Alert.alert('Error', 'Failed to fetch privacy policy');
      }
    } catch (err) {
      console.log('Privacy policy fetch error:', err);
      Alert.alert(
        'Error',
        'Something went wrong while fetching privacy policy',
      );
    } finally {
      setLoading(false);
    }
  };

  const formatText = text => {
    if (!text) return '';

    let formatted = text;

    // Bold (**word**)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet points (// something)
    formatted = formatted.replace(/\/\/(.*?)(\n|$)/g, '&emsp;&emsp;● $1<br/>');

    // Tab spacing (%% something)
    formatted = formatted.replace(/%%(.*?)(\n|$)/g, '&emsp;$1<br/>');

    // New lines (\n)
    formatted = formatted.replace(/\n/g, '<br/>');

    return `<div>${formatted}</div>`;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#14ad5f" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderLeft title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.container}>
        <RenderHtml
          contentWidth={width}
          source={{ html: policyHtml }}
          baseStyle={styles.htmlText}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  htmlText: { fontSize: 16, lineHeight: 24, color: '#333' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PrivacyPolicyScreen;
