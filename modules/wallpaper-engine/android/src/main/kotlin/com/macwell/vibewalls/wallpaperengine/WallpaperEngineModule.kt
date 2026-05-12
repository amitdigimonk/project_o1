package com.macwell.vibewalls.wallpaperengine

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.HttpURLConnection
import java.net.URL
import com.macwell.vibewalls.HtmlWallpaperService

class WallpaperEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WallpaperEngine")

    // ── Normal Image Wallpaper (Bulletproof Coroutine Scope) ──
    AsyncFunction("setWallpaper") { imageUrl: String, location: String, promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject("ERR_CONTEXT", "React Context is null", null)
        return@AsyncFunction
      }
      
      // Safely launch a background IO thread
      CoroutineScope(Dispatchers.IO).launch {
        try {
          val wallpaperManager = WallpaperManager.getInstance(context)
          val url = URL(imageUrl)
          val connection = url.openConnection() as HttpURLConnection
          
          // Anti-Bot Bypass: Servers reject blank Java user-agents.
          connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Android; Mobile)")
          connection.connectTimeout = 10000 // Increased timeout for large 4K images
          connection.readTimeout = 10000
          connection.doInput = true
          connection.connect()
          
          if (connection.responseCode != HttpURLConnection.HTTP_OK) {
             throw Exception("Server returned HTTP ${connection.responseCode}: ${connection.responseMessage}")
          }

          val input = connection.inputStream
          val bitmap = BitmapFactory.decodeStream(input) ?: throw Exception("Failed to decode bitmap from stream")

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

    // ── Live HTML Wallpaper Triggers ──

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

    Function("saveHtmlWallpaperPath") { path: String ->
      val context = appContext.reactContext ?: return@Function false
      context
        .getSharedPreferences(HtmlWallpaperService.PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putString(HtmlWallpaperService.PREF_KEY_PATH, path)
        .apply()
      return@Function true
    }

    Function("applyHtmlWallpaper") {
      val context = appContext.reactContext ?: return@Function false
      return@Function try {
        val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
        val pkgName = context.packageName
        
        // Use the explicit service class name to avoid package name mismatch issues
        // with implicit relative paths.
        val serviceClass = "com.macwell.vibewalls.HtmlWallpaperService"
        val componentName = ComponentName(pkgName, serviceClass)

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