/**
 * htmlWallpaperLoader.ts
 *
 * Utility for over-the-air HTML5 wallpaper delivery.
 *
 * Flow:
 *   1. Download a .zip from a remote URL into the app's cache directory.
 *   2. Unzip it into a versioned subfolder under <documentDirectory>/wallpapers/.
 *   3. Write the resulting index.html path to native SharedPreferences via
 *      saveHtmlWallpaperPath() so HtmlWallpaperService picks it up.
 *   4. Open the system live-wallpaper preview via applyHtmlWallpaper().
 *
 * Dependencies (install before use):
 *   npx expo install expo-file-system
 *   npm install react-native-zip-archive
 *
 * Usage example:
 *   import { downloadAndApplyHtmlWallpaper } from '@/services/htmlWallpaperLoader';
 *
 *   await downloadAndApplyHtmlWallpaper({
 *     zipUrl: 'https://cdn.example.com/wallpapers/physics-demo.zip',
 *     wallpaperId: 'physics-demo-v1',
 *     onProgress: (pct) => console.log(`${pct}% downloaded`),
 *   });
 */

import * as FileSystem from 'expo-file-system';
import { unzip } from 'react-native-zip-archive';
import { saveHtmlWallpaperPath, applyHtmlWallpaper } from 'wallpaper-engine';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface HtmlWallpaperOptions {
  /** Full HTTPS URL to the .zip file containing at minimum an index.html. */
  zipUrl: string;

  /**
   * Unique identifier for this wallpaper (used as the extraction subfolder).
   * Use a version suffix to bust the cache: e.g. "physics-demo-v2".
   */
  wallpaperId: string;

  /**
   * Optional progress callback. Receives a value from 0 → 100 during download.
   * Note: expo-file-system reports fractional progress; we floor to integer here.
   */
  onProgress?: (percentComplete: number) => void;
}

export interface HtmlWallpaperResult {
  success: boolean;
  /** Absolute file:// URL of the extracted index.html, or null on failure. */
  indexHtmlPath: string | null;
  error?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const WALLPAPERS_DIR = `${FileSystem.documentDirectory}wallpapers/`;

// ── Core function ──────────────────────────────────────────────────────────────

/**
 * Downloads, extracts, and applies an HTML5 wallpaper from a .zip URL.
 *
 * Idempotent: if the wallpaperId subfolder already exists the download step is
 * skipped and we go straight to applying the cached version.
 */
export async function downloadAndApplyHtmlWallpaper(
  options: HtmlWallpaperOptions
): Promise<HtmlWallpaperResult> {
  const { zipUrl, wallpaperId, onProgress } = options;

  try {
    // ── 1. Ensure base wallpapers directory exists ────────────────────────────
    await FileSystem.makeDirectoryAsync(WALLPAPERS_DIR, { intermediates: true });

    const wallpaperDir = `${WALLPAPERS_DIR}${wallpaperId}/`;
    const indexHtmlPath = `${wallpaperDir}index.html`;

    // ── 2. Check for cached version ──────────────────────────────────────────
    const cacheInfo = await FileSystem.getInfoAsync(indexHtmlPath);
    if (cacheInfo.exists) {
      console.log(`[HtmlWallpaperLoader] Cache hit — using ${indexHtmlPath}`);
      return applyAndReturn(indexHtmlPath);
    }

    // ── 3. Download the .zip ─────────────────────────────────────────────────
    const zipPath = `${FileSystem.cacheDirectory}${wallpaperId}.zip`;
    console.log(`[HtmlWallpaperLoader] Downloading ${zipUrl} → ${zipPath}`);

    const downloadResumable = FileSystem.createDownloadResumable(
      zipUrl,
      zipPath,
      {},
      (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;
        if (totalBytesExpectedToWrite > 0 && onProgress) {
          const pct = Math.floor((totalBytesWritten / totalBytesExpectedToWrite) * 100);
          onProgress(pct);
        }
      }
    );

    const downloadResult = await downloadResumable.downloadAsync();
    if (!downloadResult || downloadResult.status !== 200) {
      throw new Error(
        `Download failed — HTTP ${downloadResult?.status ?? 'unknown'} from ${zipUrl}`
      );
    }

    onProgress?.(100);

    // ── 4. Extract the .zip ──────────────────────────────────────────────────
    console.log(`[HtmlWallpaperLoader] Extracting ${zipPath} → ${wallpaperDir}`);
    await FileSystem.makeDirectoryAsync(wallpaperDir, { intermediates: true });
    await unzip(zipPath, wallpaperDir);

    // ── 5. Clean up the zip file ─────────────────────────────────────────────
    await FileSystem.deleteAsync(zipPath, { idempotent: true });

    // ── 6. Verify index.html exists ──────────────────────────────────────────
    const extractedInfo = await FileSystem.getInfoAsync(indexHtmlPath);
    if (!extractedInfo.exists) {
      throw new Error(
        `Extraction succeeded but index.html not found at ${indexHtmlPath}. ` +
        `Make sure the zip root contains index.html directly (not in a subdirectory).`
      );
    }

    return applyAndReturn(indexHtmlPath);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[HtmlWallpaperLoader] Error:', message);
    return { success: false, indexHtmlPath: null, error: message };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts a FileSystem URI (file:///…) to the format accepted by the native module,
 * saves it to SharedPreferences, and opens the system wallpaper picker.
 */
async function applyAndReturn(indexHtmlPath: string): Promise<HtmlWallpaperResult> {
  // expo-file-system paths already use the file:// scheme on Android.
  // Ensure we pass a proper file:// URL to the native WebView.
  const fileUrl = indexHtmlPath.startsWith('file://')
    ? indexHtmlPath
    : `file://${indexHtmlPath}`;

  const saved = await saveHtmlWallpaperPath(fileUrl);
  if (!saved) {
    return {
      success: false,
      indexHtmlPath: fileUrl,
      error: 'saveHtmlWallpaperPath returned false — native module may not be available.',
    };
  }

  const applied = await applyHtmlWallpaper();
  return {
    success: applied,
    indexHtmlPath: fileUrl,
    ...(applied ? {} : { error: 'applyHtmlWallpaper returned false — check Android permissions.' }),
  };
}

// ── Utility exports ───────────────────────────────────────────────────────────

/**
 * Lists all locally cached wallpaper IDs (subfolder names under wallpapers/).
 * Useful for building an "installed wallpapers" UI.
 */
export async function listCachedWallpapers(): Promise<string[]> {
  try {
    await FileSystem.makeDirectoryAsync(WALLPAPERS_DIR, { intermediates: true });
    const entries = await FileSystem.readDirectoryAsync(WALLPAPERS_DIR);
    return entries;
  } catch {
    return [];
  }
}

/**
 * Removes a cached wallpaper by its ID (deletes its extraction directory).
 */
export async function deleteCachedWallpaper(wallpaperId: string): Promise<boolean> {
  try {
    await FileSystem.deleteAsync(`${WALLPAPERS_DIR}${wallpaperId}/`, { idempotent: true });
    return true;
  } catch {
    return false;
  }
}
