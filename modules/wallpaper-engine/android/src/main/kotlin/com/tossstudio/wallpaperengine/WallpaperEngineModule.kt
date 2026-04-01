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

class WallpaperEngineModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WallpaperEngine")

    // The Native View Manager binding for React Native
    View(ChillBackgroundView::class) {
      Prop("manualTime") { view: ChillBackgroundView, prop: Float -> 
          view.manualTime = prop 
      }
      Prop("isLiveTime") { view: ChillBackgroundView, prop: Boolean -> 
          view.isLiveTime = prop 
      }
      Prop("weatherOverride") { view: ChillBackgroundView, prop: String -> 
          view.weatherOverride = prop 
      }
    }

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
          connection.doInput = true
          connection.connect()
          
          val input = connection.inputStream
          val bitmap = BitmapFactory.decodeStream(input)

          val flag = when (location.uppercase()) {
            "HOME" -> WallpaperManager.FLAG_SYSTEM
            "LOCK" -> WallpaperManager.FLAG_LOCK
            "BOTH" -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
            else -> WallpaperManager.FLAG_SYSTEM or WallpaperManager.FLAG_LOCK
          }

          wallpaperManager.setBitmap(bitmap, null, true, flag)
          promise.resolve(true)
        } catch (e: Exception) {
          promise.reject("ERR_WALLPAPER", "Failed to set wallpaper: ${e.message}", e)
        }
      }
    }

    Function("setInteractiveWallpaper") { serviceName: String ->
      val context = appContext.reactContext ?: return@Function false
      try {
        val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER)
        val componentName = ComponentName(
            context.packageName,
            "com.tossstudio.wallpaperengine.$serviceName"
        )
        intent.putExtra(WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT, componentName)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
        return@Function true
      } catch (e: Exception) {
        e.printStackTrace()
        return@Function false
      }
    }

    Function("syncChillSettings") { settings: Map<String, Any> ->
      val context = appContext.reactContext ?: return@Function
      
      val prefs = context.getSharedPreferences("ChillWallpaperPrefs", Context.MODE_PRIVATE)
      
      prefs.edit().apply {
          putString("weatherOverride", settings["weatherOverride"] as? String ?: "clear")
          putString("seasonOverride", settings["seasonOverride"] as? String ?: "spring")
          putBoolean("liveTime", settings["liveTime"] as? Boolean ?: true)
          
          val manualTimeNum = settings["manualTime"] as? Number
          putFloat("manualTime", manualTimeNum?.toFloat() ?: 12f)
          
          apply()
      }
    }
  }
}