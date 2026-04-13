import CategoryCard from '@/components/CategoryCard';
import CustomText from '@/components/CustomText';
import { CategoryGridSkeleton } from '@/components/SkeletonPlaceholder';
import { commonStyles } from '@/constants/commonStyles';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { fetchHomeCategories, getCachedCategories } from '@/services/categoryService';
import { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, InteractionManager, Platform, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { cancelAnimation, Easing, interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const BODY_COLORS = ['#4CAF50', '#14B8A6', '#F97316', '#EC4899', '#3B82F6', '#4CAF50'];
const BELLY_COLORS = ['#81C784', '#4DB6AC', '#FFB74D', '#F48FB1', '#90CAF9', '#81C784'];
const DETAIL_COLORS = ['#2E7D32', '#00695C', '#E65100', '#880E4F', '#1565C0', '#2E7D32'];
const COLOR_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

const ChameleonHanger = React.memo(() => {
  const jumpY = useSharedValue(-160);
  const sway = useSharedValue(0);
  const colorP = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      colorP.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      jumpY.value = withSpring(0, { damping: 13, stiffness: 85, mass: 1.1 }, () => {
        sway.value = withRepeat(
          withSequence(
            withTiming(3, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            withTiming(-3, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false
        );
      });

      return () => {
        cancelAnimation(colorP);
        cancelAnimation(jumpY);
        cancelAnimation(sway);
      };
    }, [])
  );

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpY.value },
      { rotate: `${sway.value}deg` },
    ],
  }));

  const bodyProps = useAnimatedProps(() => ({ fill: interpolateColor(colorP.value, COLOR_STOPS, BODY_COLORS) }));
  const bellyProps = useAnimatedProps(() => ({ fill: interpolateColor(colorP.value, COLOR_STOPS, BELLY_COLORS) }));
  const detailProps = useAnimatedProps(() => ({ stroke: interpolateColor(colorP.value, COLOR_STOPS, DETAIL_COLORS) }));

  return (
    <Animated.View style={[styles.chameleonWrap, style]}>
      <Svg width={70} height={35} viewBox="0 0 115 58">
        {/* Tail */}
        <AnimatedPath
          d="M22 24 Q8 34 10 48 Q14 58 26 54 Q34 50 30 42"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          animatedProps={detailProps}
        />
        {/* Body */}
        <AnimatedEllipse cx="56" cy="20" rx="34" ry="15" animatedProps={bodyProps} />
        {/* Belly */}
        <AnimatedEllipse cx="56" cy="23" rx="24" ry="9" animatedProps={bellyProps} />
        {/* Dorsal spikes */}
        <AnimatedPath
          d="M36 7 L34 0 M48 4 L46 -3 M60 3 L58 -4 M72 5 L70 -2"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          animatedProps={detailProps}
        />
        {/* Head */}
        <AnimatedEllipse cx="91" cy="16" rx="19" ry="14" animatedProps={bodyProps} />
        {/* Head crest */}
        <AnimatedPath
          d="M76 6 Q84 -1 93 5"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          animatedProps={detailProps}
        />
        {/* Eye */}
        <Circle cx="98" cy="11" r="7" fill="white" />
        <Circle cx="99" cy="11" r="3.5" fill="#1a1a1a" />
        <Circle cx="98" cy="10" r="1.2" fill="white" />
        {/* Nostril */}
        <AnimatedPath
          d="M107 16 Q108 17 109 16"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          animatedProps={detailProps}
        />
        {/* Tongue */}
        <Path d="M110 20 Q118 24 116 28 Q114 32 112 28" stroke="#E53935" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* Front legs */}
        <AnimatedPath d="M74 32 L72 52 M68 52 L72 52 L76 50" strokeWidth={3.5} fill="none" strokeLinecap="round" animatedProps={detailProps} />
        {/* Mid legs */}
        <AnimatedPath d="M54 33 L52 53 M48 53 L52 53 L56 51" strokeWidth={3.5} fill="none" strokeLinecap="round" animatedProps={detailProps} />
        {/* Back legs */}
        <AnimatedPath d="M34 30 L32 50 M28 50 L32 50 L36 48" strokeWidth={3.5} fill="none" strokeLinecap="round" animatedProps={detailProps} />
      </Svg>
    </Animated.View>
  );
});

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { hasOnboarded, isLoadingSettings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCategories = useCallback(async (showSkeleton = true) => {
    try {
      if (showSkeleton) setIsLoading(true);
      const cached = await getCachedCategories();
      if (cached && cached.length > 0) {
        setCategories(cached);
        if (showSkeleton) setIsLoading(false);
      }
      const data = await fetchHomeCategories(i18n.language || 'en');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [i18n.language]);

  const arrowX = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'web') {
      loadCategories();
    } else {
      const task = InteractionManager.runAfterInteractions(() => {
        loadCategories();
      });
      return () => task.cancel();
    }
  }, [loadCategories]);

  useEffect(() => {
    arrowX.value = withRepeat(
      withTiming(4, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }],
  }));

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadCategories(false);
  }, [loadCategories]);

  const handleCategoryPress = useCallback((category: Category) => {
    router.push({
      pathname: '/preview',
      params: {
        category: typeof category.name === 'string' ? category.name : category.title || '',
        categoryId: category.id
      }
    });
  }, [router]);

  if (isLoadingSettings) {
    return (
      <View style={[commonStyles.screenContainer, commonStyles.centerAlign, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <ScrollView
      style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.captionRow}>
            <ChameleonHanger />
            <CustomText variant="caption" color={colors.primary}>{t('home.caption')}</CustomText>
          </View>
          <CustomText variant="heading" style={{ fontSize: 26, fontWeight: '600' }}>{t('home.heading')}</CustomText>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
          activeOpacity={0.5}
        >
          <Ionicons name="settings-outline" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {isLoading ? (
          <CategoryGridSkeleton />
        ) : (
          categories.map((item, index) => (
            <CategoryCard
              key={item.id}
              category={item}
              index={index}
              isHero={index === 0}
              onPress={handleCategoryPress}
            />
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.browseRow, { borderTopColor: colors.border }]}
        onPress={() => router.push({ pathname: '/preview', params: { category: 'All' } })}
        activeOpacity={0.6}
      >
        <CustomText variant="body" style={{ color: colors.text }}>{t('home.browseButton')}</CustomText>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 80,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flex: 1,
  },
  logo: {
    height: 40,
    marginBottom: 16,
  },
  captionRow: {
    position: 'relative',
    marginBottom: 2,
  },
  chameleonWrap: {
    position: 'absolute',
    top: -30,
    left: -6,
    zIndex: 10,
  },
  settingsButton: {
    padding: 4,
  },
  grid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  browseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
