import * as WallpaperEngine from '@/modules/wallpaper-engine/src';
import { Wallpaper } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

interface WallpaperCardProps {
    item: Wallpaper;
    index: number;
    colors: any;
    onPress: () => void;
}

const WALLPAPER_DIR = `${FileSystem.documentDirectory || ''}wallpaper/`;
const INDEX_HTML_PATH = `${WALLPAPER_DIR}index.html`;
const THREE_JS_PATH = `${WALLPAPER_DIR}three.min.js`;

const WallpaperCard = React.memo(({ item, index, colors, onPress }: WallpaperCardProps) => {

    const handlePress = async () => {
        if (item.type === 'interactive' && item.indexCode && Platform.OS === 'android') {
            try {
                // 1. Ensure HTML directory exists
                const dirInfo = await FileSystem.getInfoAsync(WALLPAPER_DIR);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(WALLPAPER_DIR, { intermediates: true });
                }

                // 2. THE PUBLIC FOLDER MAGIC (Now with both engines!)
                const androidThreeUrl = 'file:///android_asset/three.min.js';
                const androidTweenUrl = 'file:///android_asset/TweenMax.min.js';

                let finalHtmlCode = item.indexCode
                    // Replace Three.js paths
                    .replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js', androidThreeUrl)
                    .replace('./three.min.js', androidThreeUrl)
                    // Replace TweenMax paths
                    .replace('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js', androidTweenUrl)
                    .replace('./TweenMax.min.js', androidTweenUrl);

                // 3. Write ONLY the HTML to file
                await FileSystem.writeAsStringAsync(INDEX_HTML_PATH, finalHtmlCode, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                // 4. Register and apply via Native Module
                const fileUrl = INDEX_HTML_PATH.startsWith('file://')
                    ? INDEX_HTML_PATH
                    : `file://${INDEX_HTML_PATH}`;

                await WallpaperEngine.saveHtmlWallpaperPath(fileUrl);
                await WallpaperEngine.applyHtmlWallpaper();

                // 5. Success feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return;
            } catch (error) {
                console.error('[WallpaperCard] Failed to bypass to native preview:', error);
            }
        }

        // Default behavior: Open standard preview for 2D images
        onPress();
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.imageCard, { backgroundColor: colors.card }]}
            onPress={handlePress}
        >
            <Image
                source={{ uri: item.url }}
                style={[styles.image, { height: 260, backgroundColor: colors.border }]}
                contentFit="cover"
                transition={300}
                cachePolicy="disk"
                placeholder="L6PZf-ayfRyE00ayj[fQ~qj[fQj["
            />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    imageCard: {
        flex: 1,
        borderRadius: 16,
        margin: 6,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
    },
});

export default WallpaperCard;