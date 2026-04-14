import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import { FONTS } from '../constants/theme';

export default function PaywallScreen() {
  const { activatePro, isPro } = useStore();
  const { playClick } = useSound();
  
  const handleSubscribe = () => {
    playClick();
    activatePro();
    router.back();
    alert('🎉 Welcome to MathMoppet Pro!\n\n✅ All 80 levels across 8 topics are now unlocked!');
  };
  
  const handleRestore = () => {
    playClick();
    if (isPro) {
      alert('✅ You already have Pro!');
    } else {
      alert('No previous purchases found.');
    }
  };
  
  const handleClose = () => {
    playClick();
    router.back();
  };

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0FF', '#6BCB77', '#4CAF50']}
      locations={[0, 0.38, 0.38, 1]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.glowBackground} />
          
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.title}>MathMoppet Pro</Text>
          <Text style={styles.subtitle}>Unlock all 80 levels across 8 topics!</Text>
          
          <View style={styles.featuresList}>
            {[
              { icon: '🎯', text: '10 difficulty levels per topic (80 total)' },
              { icon: '📈', text: 'Progressive challenge from Starter → Expert' },
              { icon: '🏆', text: 'All 12 achievements unlockable' },
              { icon: '📊', text: 'Full parent dashboard with level tracking' },
              { icon: '👨‍👩‍👧', text: 'Up to 2 child profiles per account' },
              { icon: '🚫', text: 'No ads, ever. Cancel anytime.' },
            ].map((item, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
                <Text style={styles.featureText}>{item.text}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.priceBox}>
            <Text style={styles.priceMain}>$10<span style={{ fontSize: 20 }}>.00</span></Text>
            <Text style={styles.pricePeriod}>/ month</Text>
            <Text style={styles.priceNote}>7-day free trial · Cancel anytime</Text>
          </View>
          
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe} activeOpacity={0.85}>
            <Text style={styles.subscribeText}>✨ Start Free Trial</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore Purchase</Text>
          </TouchableOpacity>
          
          {isPro && (
            <Text style={styles.alreadyPro}>✅ You already have Pro!</Text>
          )}
        </View>
        
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 32,
    padding: 36,
    maxWidth: 420,
    width: '100%',
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.13)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
    overflow: 'hidden'
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 10
  },
  closeText: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: '#ccc'
  },
  glowBackground: {
    position: 'absolute',
    top: -60,
    left: '50%',
    marginLeft: -110,
    width: 220,
    height: 220,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: 110
  },
  crown: {
    fontSize: 66,
    marginBottom: 12
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: '#F59E0B',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '700',
    marginBottom: 22,
    textAlign: 'center'
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
    gap: 9
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9
  },
  featureIcon: {
    fontSize: 20,
    width: 26,
    textAlign: 'center'
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '700',
    flex: 1
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16
  },
  priceBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F59E0B'
  },
  priceMain: {
    fontFamily: FONTS.display,
    fontSize: 44,
    color: '#92400E',
    lineHeight: 1
  },
  pricePeriod: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: '#B45309'
  },
  priceNote: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 3,
    fontWeight: '700'
  },
  subscribeButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    marginBottom: 10
  },
  subscribeText: {
    fontFamily: FONTS.display,
    fontSize: 23,
    color: '#fff',
    letterSpacing: 0.5
  },
  restoreButton: {
    backgroundColor: 'transparent',
    padding: 6
  },
  restoreText: {
    fontFamily: FONTS.display,
    fontSize: 13,
    color: '#aaa',
    textDecorationLine: 'underline'
  },
  alreadyPro: {
    fontSize: 12,
    color: '#6BCB77',
    fontWeight: '700',
    marginTop: 8
  }
});