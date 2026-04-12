import CustomText from '@/components/CustomText';
import { WallpaperGridSkeleton } from '@/components/SkeletonPlaceholder';
import WallpaperBottomSheet from '@/components/WallpaperBottomSheet';
import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { androidWallpaperEngine } from '@/services/androidWallpaperEngine';
import { useToast } from '@/components/Toast';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import WallpaperCard from '@/components/WallpaperCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Platform, InteractionManager } from 'react-native';
import { fetchHomeCategories, getCachedCategories } from '@/services/categoryService';
import { fetchWallpapersByCategory, getCachedWallpapers } from '@/services/wallpaperService';
import { Category, Wallpaper } from '@/types';

// Dynamic filters replace static ones

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 56,
        paddingBottom: 8,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '600',
        opacity: 0.5,
    },
    filterScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    filterItem: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
        gap: 4,
    },
    filterDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    listContainer: {
        padding: 2,
        paddingBottom: 40,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
});

// Removed ImageListItem as it is now in components/WallpaperCard.tsx

export default function PreviewScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { category, categoryId } = useLocalSearchParams();

    const initialCategory = (category as string) || 'All';
    const isBrowseAll = initialCategory === 'All';

    const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { showToast } = useToast();
    const { colors } = useTheme();
    const { i18n } = useTranslation();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categoryId as string);

    // Fetch categories for the filter bar if in "Browse All" mode
    useEffect(() => {
        if (isBrowseAll) {
            const loadCategories = async () => {
                try {
                    // Try cache first
                    const cached = await getCachedCategories();
                    if (cached && cached.length > 0) {
                        setCategories(cached);
                    }

                    // Fetch fresh
                    const data = await fetchHomeCategories(i18n.language || 'en');
                    setCategories(data);
                } catch (e) {
                    console.error('[Preview] Failed to load categories:', e);
                }
            };
            loadCategories();
        }
    }, [isBrowseAll, i18n.language]);

    const PAGE_SIZE = 20;

    const loadWallpapers = useCallback(async (showSkeleton = true, pageNum = 1) => {
        try {
            if (showSkeleton) setIsLoading(true);
            if (pageNum > 1) setIsLoadingMore(true);
            setError(null);

            // Load from cache only on first page
            if (pageNum === 1) {
                const cached = await getCachedWallpapers(selectedCategoryId);
                if (cached && cached.length > 0) {
                    setWallpapers(cached);
                    if (showSkeleton) setIsLoading(false);
                }
            }

            const data = await fetchWallpapersByCategory(
                selectedCategoryId, 
                pageNum, 
                PAGE_SIZE,
            );

            if (pageNum === 1) {
                setWallpapers(data);
            } else {
                setWallpapers(prev => {
                    const existingIds = new Set(prev.map(w => w._id));
                    const newItems = data.filter(w => !existingIds.has(w._id));
                    return [...prev, ...newItems];
                });
            }

            setHasMore(data.length >= PAGE_SIZE);
            setPage(pageNum);
        } catch (err) {
            console.error('[Preview] Load wallpapers error:', err);
            if (wallpapers.length === 0) {
                setError(err instanceof Error ? err.message : 'Failed to load wallpapers');
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setPage(1);
            setHasMore(true);
            loadWallpapers(true, 1);
        });
        return () => task.cancel();
    }, [loadWallpapers]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadWallpapers(false, 1);
    }, [loadWallpapers]);

    const loadMore = useCallback(() => {
        if (!isLoadingMore && hasMore && !isLoading) {
            loadWallpapers(false, page + 1);
        }
    }, [isLoadingMore, hasMore, isLoading, page, loadWallpapers]);

    const handleImagePress = useCallback((index: number) => {
        router.push({ 
            pathname: '/image-viewer', 
            params: { 
                initialIndex: index.toString(),
                categoryId: selectedCategoryId || 'All'
            } 
        });
    }, [router, selectedCategoryId]);

    const handleLongPress = useCallback((item: Wallpaper) => {
        if (item.type !== 'interactive') {
            setPendingUrl(item.url);
            setIsSheetVisible(true);
        }
    }, []);

    const applyToLocation = useCallback(async (location: 'HOME' | 'LOCK' | 'BOTH') => {
        if (!pendingUrl) return;
        const success = await androidWallpaperEngine.setWallpaper(pendingUrl, location);
        if (success) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            showToast(t('imageViewer.appliedTo', { location: location.toLowerCase() }), 'success');
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            showToast(t('imageViewer.failed'), 'error');
        }
    }, [pendingUrl, showToast, t]);

    const renderItem = useCallback(({ item, index }: { item: Wallpaper; index: number }) => (
        <WallpaperCard
            item={item}
            index={index}
            colors={colors}
            onPress={handleImagePress}
            onLongPress={handleLongPress}
        />
    ), [colors, handleImagePress, handleLongPress]);

    const getItemLayout = useCallback((_: any, index: number) => {
        const rowHeight = 272; // 260 (max image height) + 12 (vertical margins)
        return {
            length: rowHeight,
            offset: rowHeight * Math.floor(index / 2),
            index,
        };
    }, []);

    return (
        <View style={[commonStyles.screenContainer, { backgroundColor: colors.background }]}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color={colors.text} />
                </TouchableOpacity>
                <CustomText style={[styles.headerTitle, { color: colors.text }]}>
                    {isBrowseAll ? t('preview.discover') : initialCategory}
                </CustomText>
            </View>

            {isBrowseAll && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                    style={{ flexGrow: 0 }}
                >
                    {/* "All" Filter */}
                    {(() => {
                        const isAllActive = !selectedCategoryId || selectedCategoryId === 'All';
                        return (
                            <TouchableOpacity style={styles.filterItem} onPress={() => setSelectedCategoryId(undefined)}>
                                <CustomText
                                    variant="body"
                                    color={isAllActive ? colors.text : colors.textMuted}
                                    style={{ fontSize: 13, fontWeight: isAllActive ? '700' : '400' }}
                                >
                                    {t('preview.filters.All')}
                                </CustomText>
                                {isAllActive && <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />}
                            </TouchableOpacity>
                        );
                    })()}

                    {/* Dynamic Categories */}
                    {categories.map((cat) => {
                        const isActive = selectedCategoryId === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={styles.filterItem}
                                onPress={() => {
                                    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Removed per user request
                                    setSelectedCategoryId(cat.id);
                                }}
                            >
                                <CustomText
                                    variant="body"
                                    color={isActive ? colors.text : colors.textMuted}
                                    style={{ fontSize: 13, fontWeight: isActive ? '700' : '400' }}
                                >
                                    {typeof cat.name === 'string' ? cat.name : t(`categories.${cat.title}`)}
                                </CustomText>
                                {isActive && <View style={[styles.filterDot, { backgroundColor: colors.primary }]} />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            {isLoading ? (
                <WallpaperGridSkeleton />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <CustomText variant="body" color={colors.textMuted} style={{ textAlign: 'center' }}>{error}</CustomText>
                    <TouchableOpacity
                        onPress={() => {
                            setError(null);
                            setIsLoading(true);
                            fetchWallpapersByCategory(selectedCategoryId).then(setWallpapers).catch((e: Error) => setError(e.message)).finally(() => setIsLoading(false));
                        }}
                    >
                        <CustomText variant="body" color={colors.primary}>{t('imageViewer.tryAgain')}</CustomText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={wallpapers}
                        numColumns={2}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={Platform.OS === 'android'}
                        initialNumToRender={6}
                        windowSize={5}
                        maxToRenderPerBatch={8}
                        updateCellsBatchingPeriod={50}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        getItemLayout={getItemLayout}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        }
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={() => (
                            <View style={[commonStyles.centerAlign, { marginTop: 100 }]}>
                                <CustomText color={colors.textMuted}>{t('preview.noResults')}</CustomText>
                            </View>
                        )}
                    />
                </View>
            )}

            <WallpaperBottomSheet
                isVisible={isSheetVisible}
                onClose={() => setIsSheetVisible(false)}
                onSelect={(location) => {
                    setIsSheetVisible(false);
                    applyToLocation(location);
                }}
            />
        </View>
    );
}