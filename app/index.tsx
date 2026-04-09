import CategoryCard from '@/components/CategoryCard';
import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import { CategoryGridSkeleton } from '@/components/SkeletonPlaceholder';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { fetchHomeCategories, getCachedCategories } from '@/services/categoryService';
import { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSettings } from '@/context/SettingsContext';

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

      // 1. Load from cache first
      const cached = await getCachedCategories();
      if (cached && cached.length > 0) {
        setCategories(cached);
        if (showSkeleton) setIsLoading(false);
      }

      // 2. Fetch fresh data
      const data = await fetchHomeCategories(i18n.language || 'en');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadCategories(false);
  }, [loadCategories]);

  const handleCategoryPress = (category: Category) => {

    router.push({
      pathname: '/preview',
      params: {
        category: typeof category.name === 'string' ? category.name : category.title || '',
        categoryId: category.id
      }
    });
  };

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
          <CustomText variant="caption">{t('home.caption')}</CustomText>
          <CustomText variant="heading">{t('home.heading')}</CustomText>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
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
              onPress={handleCategoryPress}
            />
          ))
        )}
      </View>

      {/* 3. Bold Primary Action */}
      <View style={styles.actionContainer}>
        <CustomText variant="body" style={{ color: colors.textMuted, textAlign: 'center' }}>
          {t('home.subtext')}
        </CustomText>
        <CustomButton
          title={t('home.browseButton')}
          onPress={() => router.push({ pathname: '/preview', params: { category: 'All' } })}
        />
      </View>

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
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  grid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
});