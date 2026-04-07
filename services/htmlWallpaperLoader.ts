// 1. Use the /legacy import to stop the deprecation error
import * as FileSystem from 'expo-file-system/legacy';
import { applyHtmlWallpaper, saveHtmlWallpaperPath } from 'wallpaper-engine';

export interface HtmlWallpaperResult {
  success: boolean;
  indexHtmlPath: string | null;
  error?: string;
}

// 2. Use the legacy constants directly
const docDir = FileSystem.documentDirectory || '';
const WALLPAPER_DIR = `${docDir}wallpaper/`;
const INDEX_HTML_PATH = `${WALLPAPER_DIR}index.html`;

/**
 * Takes a raw HTML string, saves it to a local file, and triggers the 
 * Android Live Wallpaper picker.
 */
export async function prepareAndApplyHtmlWallpaper(
  htmlCode: string
): Promise<HtmlWallpaperResult> {
  try {
    console.log('[HtmlWallpaperLoader] Preparing wallpaper from raw string...');

    // 3. Ensure the directory exists (Using Legacy API)
    const dirInfo = await FileSystem.getInfoAsync(WALLPAPER_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(WALLPAPER_DIR, { intermediates: true });
    }

    // 4. Write HTML String to local file
    await FileSystem.writeAsStringAsync(INDEX_HTML_PATH, htmlCode, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 5. Register with Native Layer
    const fileUrl = INDEX_HTML_PATH.startsWith('file://')
      ? INDEX_HTML_PATH
      : `file://${INDEX_HTML_PATH}`;

    // Defensive check for the native module
    if (typeof saveHtmlWallpaperPath !== 'function') {
      throw new Error('Native module saveHtmlWallpaperPath not found.');
    }

    const saved = await saveHtmlWallpaperPath(fileUrl);
    if (!saved) {
      throw new Error('Native module failed to save wallpaper path.');
    }

    // 6. Trigger Android Intent
    const applied = await applyHtmlWallpaper();

    return {
      success: applied,
      indexHtmlPath: fileUrl,
      ...(applied ? {} : { error: 'System intent failed to launch.' })
    };

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[HtmlWallpaperLoader] Error:', message);
    return { success: false, indexHtmlPath: null, error: message };
  }
}