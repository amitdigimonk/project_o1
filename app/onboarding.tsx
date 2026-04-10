import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
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
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
  },
  {
    id: '2',
    title: 'Interactive Experiences',
    description: 'Experience live, 3D wallpapers that react to your touch and device movement in real-time.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000'
  },
  {
    id: '3',
    title: 'Make It Yours',
    description: 'Easily browse, filter, and organize your favorite wallpapers into curated collections.',
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000'
  }
];

export default function OnboardingScreen() {
  const { setHasOnboarded } = useSettings();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      setHasOnboarded(true);
      router.replace('/');
    }
  };

  const handleSkip = () => {
    setHasOnboarded(true);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <CustomText style={styles.skipText}>Skip</CustomText>
        </TouchableOpacity>
      )}

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
          >
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <CustomText style={styles.title}>{slide.title}</CustomText>
              <CustomText style={styles.description}>{slide.description}</CustomText>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <CustomText style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    padding: 4,
  },
  skipText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textContainer: {
    paddingHorizontal: 28,
    paddingBottom: 160,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
