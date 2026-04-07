import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import * as WallpaperEngine from '@/modules/wallpaper-engine/src';
import { Wallpaper } from '@/types';

interface WallpaperCardProps {
    item: Wallpaper;
    index: number;
    colors: any;
    onPress: () => void;
}

const WALLPAPER_DIR = `${FileSystem.documentDirectory || ''}wallpaper/`;
const INDEX_HTML_PATH = `${WALLPAPER_DIR}index.html`;

const WallpaperCard = React.memo(({ item, index, colors, onPress }: WallpaperCardProps) => {
    
    const handlePress = async () => {
        if (item.type === 'interactive' && item.indexCode && Platform.OS === 'android') {
            try {
                // 1. Ensure directory exists
                const dirInfo = await FileSystem.getInfoAsync(WALLPAPER_DIR);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(WALLPAPER_DIR, { intermediates: true });
                }

                // 2. Write HTML to file
                await FileSystem.writeAsStringAsync(INDEX_HTML_PATH, item.indexCode, {
                    encoding: FileSystem.EncodingType.UTF8,
                });

                // 3. Register and apply via Native Module
                const fileUrl = INDEX_HTML_PATH.startsWith('file://') 
                    ? INDEX_HTML_PATH 
                    : `file://${INDEX_HTML_PATH}`;
                
                await WallpaperEngine.saveHtmlWallpaperPath(fileUrl);
                await WallpaperEngine.applyHtmlWallpaper();
                
                // 4. Success feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return;
            } catch (error) {
                console.error('[WallpaperCard] Failed to bypass to native preview:', error);
                // Fallback to standard preview if native bypass fails
            }
        }
        
        // Default behavior: Open standard preview
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
