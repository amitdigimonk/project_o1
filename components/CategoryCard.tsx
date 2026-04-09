import { commonStyles } from '@/constants/commonStyles';
import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types';
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

const CategoryCard: React.FC<CategoryCardProps> = React.memo(({ category, index = 0, onPress }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isVideo = category.type === 'video';

  const handlePress = () => {
    onPress(category);
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify().damping(18).stiffness(140)}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.categoryCard, commonStyles.cardShadow]}
        onPress={handlePress}
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
        <View style={styles.cardContent}>
          <CustomText variant="body" color="#FFFFFF">{category.count}</CustomText>
          <CustomText variant="subheading" color="#FFFFFF">
            {typeof category.name === 'string' ? category.name : t(`categories.${category.title}`)}
          </CustomText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  categoryCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    ...commonStyles.cardShadow,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    width: '100%',
  },
});


export default CategoryCard;
