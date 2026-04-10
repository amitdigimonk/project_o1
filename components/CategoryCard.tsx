import { Category } from '@/types';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import CustomText from './CustomText';

interface CategoryCardProps {
  category: Category;
  index?: number;
  isHero?: boolean;
  onPress: (category: Category) => void;
}

const CategoryVideo = ({ source }: { source: string }) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  return (
    <VideoView
      player={player}
      style={styles.cardImage}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, index = 0, isHero = false, onPress }) => {
  const { t } = useTranslation();
  const isVideo = category.type === 'video';

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60)}
      style={[styles.cardWrapper, isHero && styles.heroWrapper]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.categoryCard, isHero && styles.heroCard]}
        onPress={() => onPress(category)}
      >
        {isVideo ? (
          <CategoryVideo source={category.image} />
        ) : (
          <Image
            source={category.image || 'https://via.placeholder.com/300'}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />
        )}
        <View style={styles.overlay} />
        <BlurView intensity={28} tint="dark" style={styles.cardContent}>
          <CustomText style={[styles.cardName, isHero && styles.heroName]} color="#FFFFFF">
            {typeof category.name === 'string' ? category.name : t(`categories.${category.title}`)}
          </CustomText>
          {category.count ? (
            <CustomText style={styles.cardCount} color="rgba(255,255,255,0.6)">
              {category.count}
            </CustomText>
          ) : null}
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  heroWrapper: {
    width: '100%',
  },
  categoryCard: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  heroCard: {
    height: 240,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 2,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  heroName: {
    fontSize: 20,
  },
  cardCount: {
    fontSize: 12,
  },
});

export default CategoryCard;
