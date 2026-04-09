import React, { useRef, useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';

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
  const { colors, isDark } = useTheme();
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <Animated.Image
              source={{ uri: slide.image }}
              style={styles.image}
              entering={FadeInDown.delay(100)}
            />
            <View style={styles.textContainer}>
              <Animated.View entering={FadeInUp.delay(200)}>
                <CustomText variant="heading" style={styles.title}>{slide.title}</CustomText>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(300)}>
                <CustomText variant="body" style={[styles.description, { color: colors.textMuted }]}>
                  {slide.description}
                </CustomText>
              </Animated.View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Controls */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentIndex === index ? colors.primary : colors.border },
                currentIndex === index && { width: 24 }
              ]}
            />
          ))}
        </View>

        <CustomButton
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height: height,
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.65,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: '100%',
  }
});
