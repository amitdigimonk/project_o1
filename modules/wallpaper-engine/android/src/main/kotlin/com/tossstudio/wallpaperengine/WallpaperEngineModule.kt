package com.tossstudio.wallpaperengine

import android.app.WallpaperManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class WallpaperEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WallpaperEngine")

    AsyncFunction("setWallpaper") { imageUrl: String, location: String, promise: expo.modules.kotlin.Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.resolve(false)
        return@AsyncFunction
      }
      val wallpaperManager = WallpaperManager.getInstance(context)

      Thread {
        try {
          val url = URL(imageUrl)
          url.openStream().use { inputStream ->
            val bitmap = BitmapFactory.decodeStream(inputStream)
            if (bitmap != null) {
              when (location) {
                "HOME" -> wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
                "LOCK" -> wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
                "BOTH" -> {
                  wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM)
                  wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK)
                }
                else -> wallpaperManager.setBitmap(bitmap)
              }
              promise.resolve(true)
            } else {
              promise.resolve(false)
            }
          }
        } catch (e: Exception) {
          e.printStackTrace()
          promise.resolve(false)
        }
      }.start()
    }

    AsyncFunction("setInteractiveWallpaper") { serviceName: String ->
      val context = appContext.reactContext ?: return@AsyncFunction false
      val packageName = context.packageName
      val intent = android.content.Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
        putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, 
          android.content.ComponentName(packageName, "$packageName.$serviceName"))
        addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
      true
    }
  }
}
