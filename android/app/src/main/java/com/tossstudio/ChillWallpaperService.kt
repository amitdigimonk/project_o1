package com.tossstudio

import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import android.view.View
import android.graphics.Canvas
import android.graphics.Color
import com.facebook.react.ReactRootView
import com.facebook.react.ReactApplication

class ChillWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine {
        return ChillEngine()
    }

    inner class ChillEngine : Engine() {
        private var rootView: ReactRootView? = null
        private val handler = Handler(Looper.getMainLooper())
        private var isVisible = false
        
        private val drawRunnable = object : Runnable {
            override fun run() {
                if (isVisible) {
                    draw()
                    // Background wallpapers don't need 60FPS, 30FPS is fine and saves battery
                    handler.postDelayed(this, 32) 
                }
            }
        }

        override fun onCreate(surfaceHolder: SurfaceHolder) {
            super.onCreate(surfaceHolder)
            handler.post {
                val app = application as ReactApplication
                rootView = ReactRootView(this@ChillWallpaperService)
                
                try {
                    // Use the reactNativeHost to get the manager
                    // This works for both old and new architecture in most Expo versions
                    val reactInstanceManager = (app as? MainApplication)?.reactNativeHost?.reactInstanceManager
                    if (reactInstanceManager != null) {
                        rootView?.startReactApplication(
                            reactInstanceManager,
                            "ChillWallpaper",
                            null
                        )
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            this.isVisible = visible
            if (visible) {
                handler.post(drawRunnable)
            } else {
                handler.removeCallbacks(drawRunnable)
            }
        }

        override fun onSurfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
            super.onSurfaceChanged(holder, format, width, height)
            handler.post {
                rootView?.let {
                    it.measure(
                        View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                        View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY)
                    )
                    it.layout(0, 0, width, height)
                }
            }
        }

        private fun draw() {
            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    // Draw a base color to avoid flickering
                    canvas.drawColor(Color.BLACK)
                    rootView?.draw(canvas)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                if (canvas != null) {
                    try {
                        holder.unlockCanvasAndPost(canvas)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }

        override fun onDestroy() {
            super.onDestroy()
            handler.removeCallbacks(drawRunnable)
            handler.post {
                rootView?.unmountReactApplication()
                rootView = null
            }
        }
    }
}
