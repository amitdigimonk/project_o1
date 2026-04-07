package com.tossstudio.wallpaperengine

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread
import com.tossstudio.HtmlWallpaperService

class WallpaperEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WallpaperEngine")


    AsyncFunction("setWallpaper") { imageUrl: String, location: String, promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject("ERR_CONTEXT", "React Context is null", null)
        return@AsyncFunction
      }
      thread {
        try {
          val wallpaperManager = WallpaperManager.getInstance(context)
          val url = URL(imageUrl)
          val connection = url.openConnection() as HttpURLConnection
          connection.connectTimeout = 5000
          connection.readTimeout = 5000
          connection.doInput = true
          connection.connect()
          
          if (connection.responseCode != HttpURLConnection.HTTP_OK) {
             throw Exception("Server returned HTTP ${connection.responseCode}: ${connection.responseMessage}")
          }

          val input = connection.inputStream
          val bitmap = BitmapFactory.decodeStream(input)
          if (bitmap == null) {
             throw Exception("Failed to decode bitmap from stream")
          }

          val flag = when (location.uppercase()) {
            "HOME" -> WallpaperManager.FLAG_SYSTEM
            "LOCK" -> WallpaperManager.FLAG_LOCK
            "BOTH" -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
            else -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
          }

          wallpaperManager.setBitmap(bitmap, null, true, flag)
          promise.resolve(true)
        } catch (e: Exception) {
          e.printStackTrace()
          promise.reject("ERR_WALLPAPER", "Failed to set wallpaper: ${e.message}", e)
        }
      }
    }

    Function("setInteractiveWallpaper") { serviceName: String ->
      val context = appContext.reactContext ?: return@Function false
      try {
        val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
        val pkgName = context.packageName
        val componentName = ComponentName(pkgName, "$pkgName.$serviceName")
        intent.putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, componentName)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        return@Function true
      } catch (e: Exception) {
        e.printStackTrace()
        return@Function false
      }
    }


    /**
     * Persists the absolute file:// URL of the unzipped index.html into
     * SharedPreferences so HtmlWallpaperService can read it on (re)start.
     *
     * @param path  Full file URL, e.g. "file:///data/user/0/com.tossstudio/files/wallpaper/index.html"
     */
    Function("saveHtmlWallpaperPath") { path: String ->
      val context = appContext.reactContext ?: return@Function false
      context
        .getSharedPreferences(HtmlWallpaperService.PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putString(HtmlWallpaperService.PREF_KEY_PATH, path)
        .apply()
      return@Function true
    }

    /**
     * Fires the system ACTION_CHANGE_LIVE_WALLPAPER intent pre-pointed at
     * HtmlWallpaperService so the user lands directly on the preview screen.
     *
     * Make sure saveHtmlWallpaperPath() has been called first, otherwise the
     * wallpaper will show the fallback "no wallpaper loaded" page.
     */
    Function("applyHtmlWallpaper") {
      val context = appContext.reactContext ?: return@Function false
      return@Function try {
        val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
        val pkgName = context.packageName
        // Force the absolute path: [your.package.name].[ClassName]
        val componentName = ComponentName(pkgName, "$pkgName.HtmlWallpaperService")

        intent.putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, componentName)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        true
      } catch (e: Exception) {
        e.printStackTrace()
        false
      }
    }
  }
}