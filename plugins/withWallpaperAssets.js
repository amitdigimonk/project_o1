const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo Config Plugin to copy the wallpaper-payload folder into 
 * the Android native assets directory so HtmlWallpaperService.kt 
 * can access it via file:///android_asset/...
 */
const withWallpaperAssets = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const { projectRoot } = config.modRequest;
      const srcDir = path.join(projectRoot, 'assets/wallpaper-payload');
      const destDir = path.join(projectRoot, 'android/app/src/main/assets/wallpaper-payload');

      console.log(`[withWallpaperAssets] Copying ${srcDir} -> ${destDir}`);

      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(destDir, file);
          fs.copyFileSync(srcFile, destFile);
        }
      } else {
        console.warn(`[withWallpaperAssets] Source directory ${srcDir} not found!`);
      }
      return config;
    },
  ]);
};

module.exports = withWallpaperAssets;
