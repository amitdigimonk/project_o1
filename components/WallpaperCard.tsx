import * as WallpaperEngine from '@/modules/wallpaper-engine/src';
import { Wallpaper } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface WallpaperCardProps {
    item: Wallpaper;
    index: number;
    colors: any;
    onPress: (index: number) => void;
    onLongPress?: (item: Wallpaper) => void;
}

const WALLPAPER_DIR = `${FileSystem.documentDirectory || ''}wallpaper/`;

const WallpaperCard = React.memo(({ item, index, colors, onPress, onLongPress }: WallpaperCardProps) => {

    const handlePress = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (item.type === 'interactive' && item.indexCode && Platform.OS === 'android') {
            try {
                // 1. Ensure HTML directory exists
                const dirInfo = await FileSystem.getInfoAsync(WALLPAPER_DIR);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(WALLPAPER_DIR, { intermediates: true });
                }

                // 2. Ensure dependencies are downloaded locally to prevent WebView missing asset errors
                const THREE_JS_FILE = `${WALLPAPER_DIR}three.min.js`;
                const TWEEN_JS_FILE = `${WALLPAPER_DIR}TweenMax.min.js`;

                if (!(await FileSystem.getInfoAsync(THREE_JS_FILE)).exists) {
                    await FileSystem.downloadAsync('https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js', THREE_JS_FILE);
                }
                if (!(await FileSystem.getInfoAsync(TWEEN_JS_FILE)).exists) {
                    await FileSystem.downloadAsync('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js', TWEEN_JS_FILE);
                }

                const localThreeUrl = THREE_JS_FILE.startsWith('file://') ? THREE_JS_FILE : `file://${THREE_JS_FILE}`;
                const localTweenUrl = TWEEN_JS_FILE.startsWith('file://') ? TWEEN_JS_FILE : `file://${TWEEN_JS_FILE}`;

                let finalHtmlCode = item.indexCode
                    // Replace Three.js paths
                    .replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js', localThreeUrl)
                    .replace('./three.min.js', localThreeUrl)
                    // Replace TweenMax paths
                    .replace('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js', localTweenUrl)
                    .replace('./TweenMax.min.js', localTweenUrl);

                // 3. Cleanup old files to prevent storage leak & bypass WebView cache
                try {
                    const files = await FileSystem.readDirectoryAsync(WALLPAPER_DIR);
                    for (const file of files) {
                        if (file.endsWith('.html') || file.startsWith('index_')) {
                            await FileSystem.deleteAsync(`${WALLPAPER_DIR}${file}`, { idempotent: true });
                        }
                    }
                } catch (e) {
                    console.log('Error cleaning up wallpaper dir:', e);
                }

                // Create a unique file name to forcefully bypass Android WebView caching
                const uniqueFileName = `index_${Date.now()}.html`;
                const uniqueHtmlPath = `${WALLPAPER_DIR}${uniqueFileName}`;

                await FileSystem.writeAsStringAsync(uniqueHtmlPath, finalHtmlCode, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                // Small delay to ensure file system syncs before native module reads it
                await new Promise(resolve => setTimeout(resolve, 100));

                // 4. Register and apply via Native Module
                const fileUrl = uniqueHtmlPath.startsWith('file://')
                    ? uniqueHtmlPath
                    : `file://${uniqueHtmlPath}`;

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
        onPress(index);
    };

    const handleLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onLongPress?.(item);
    };

    const isInteractive = item.type === 'interactive';

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.imageCard, { backgroundColor: colors.card }]}
            onPress={handlePress}
            onLongPress={handleLongPress}
            delayLongPress={400}
        >
            <Image
                source={{ uri: item.url }}
                style={[styles.image, { height: index % 2 === 0 ? 260 : 200, backgroundColor: colors.border }]}
                contentFit="cover"
                transition={300}
                cachePolicy="disk"
                placeholder="L6PZf-ayfRyE00ayj[fQ~qj[fQj["
            />
            {isInteractive && (
                <View style={styles.badge}>
                    <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                </View>
            )}
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
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WallpaperCard;