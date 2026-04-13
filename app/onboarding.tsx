import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSettings } from '@/context/SettingsContext';
import CustomText from '@/components/CustomText';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to VibeWalls',
    description: 'Transform your screen with stunning, high-definition wallpapers crafted for your device.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
  },
  {
    id: '2',
    title: 'Interactive Experiences',
    description: 'Experience live, 3D wallpapers that react to your touch and device movement in real-time.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000',
  },
  {
    id: '3',
    title: 'Make It Yours',
    description: 'Easily browse, filter, and organize your favorite wallpapers into curated collections.',
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000',
  },
];

export default function OnboardingScreen() {
  const { setHasOnboarded } = useSettings();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    callback();
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      animateTransition(() =>
        scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true })
      );
    } else {
      setHasOnboarded(true);
      router.replace('/');
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
    router.replace('/');
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <ImageBackground
            key={slide.id}
            source={{ uri: slide.image }}
            style={styles.slide}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Soft bottom fade — no harsh black overlay */}
      <View style={styles.fadeBottom} pointerEvents="none" />

      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <CustomText style={styles.skipText}>Skip</CustomText>
        </TouchableOpacity>
      )}

      {/* Bottom card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <CustomText style={styles.title}>{SLIDES[currentIndex].title}</CustomText>
        <CustomText style={styles.description}>{SLIDES[currentIndex].description}</CustomText>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.button, isLast && styles.buttonPrimary]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <CustomText style={[styles.buttonText, isLast && styles.buttonTextPrimary]}>
            {isLast ? 'Get Started' : 'Next'}
          </CustomText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    // Layered semi-transparent views simulate a gradient fade
    backgroundColor: 'transparent',
    // Use shadow-like approach: multiple nested views handle this in the card
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 48,
    backgroundColor: 'rgba(10,10,10,0.72)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    gap: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22,
    marginBottom: 28,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonTextPrimary: {
    color: '#000000',
  },
});
