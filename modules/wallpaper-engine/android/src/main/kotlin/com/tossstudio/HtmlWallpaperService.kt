package com.tossstudio

import android.annotation.SuppressLint
import android.app.Presentation
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.View
import android.view.ViewGroup
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import java.io.File

class HtmlWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = HtmlEngine()

    inner class HtmlEngine : Engine() {

        private val mainHandler = Handler(Looper.getMainLooper())
        private var webView: WebView? = null
        
        private var virtualDisplay: VirtualDisplay? = null
        private var presentation: Presentation? = null

        private var isEngineVisible = false
        
        // BATTERY FIX: Sensor throttling variables
        private var lastSensorUpdate = 0L
        private val SENSOR_THROTTLE_MS = 32L // ~30 FPS is plenty for smooth parallax

        // ── LIVE HOT-RELOAD FIX (Listens for RN app changes) ─────────────────
        private val prefs by lazy { 
            this@HtmlWallpaperService.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE) 
        }

        private val prefsListener = android.content.SharedPreferences.OnSharedPreferenceChangeListener { sharedPrefs, key ->
            if (key == PREF_KEY_PATH) {
                val newPath = sharedPrefs.getString(key, null)
                if (newPath != null) {
                    val cleanPath = when {
                        newPath.startsWith("file://") -> newPath
                        newPath.startsWith("/") -> "file://$newPath"
                        else -> "file://$newPath"
                    }
                    val diskPath = cleanPath.replace("file://", "").replace("//", "/")
                    
                    // Instantly load the new wallpaper without tearing down the engine
                    mainHandler.post {
                        if (File(diskPath).exists()) {
                            webView?.loadUrl(cleanPath)
                        } else {
                            webView?.loadUrl("file:///android_asset/wallpaper-payload/index.html")
                        }
                    }
                }
            }
        }

        // ── Lifecycle ─────────────────────────────────────────────────────────

        override fun onCreate(surfaceHolder: SurfaceHolder) {
            super.onCreate(surfaceHolder)
            setTouchEventsEnabled(true)
            // Start listening for new wallpapers from React Native
            prefs.registerOnSharedPreferenceChangeListener(prefsListener)
        }

        override fun onSurfaceChanged(
            holder: SurfaceHolder,
            format: Int,
            width: Int,
            height: Int
        ) {
            super.onSurfaceChanged(holder, format, width, height)
            mainHandler.post { 
                setupVirtualDisplay(holder, width, height) 
            }
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder) {
            super.onSurfaceDestroyed(holder)
            mainHandler.post { teardownEngine() }
        }

        override fun onDestroy() {
            super.onDestroy()
            // Stop listening to prevent memory leaks
            prefs.unregisterOnSharedPreferenceChangeListener(prefsListener)
            mainHandler.post { teardownEngine() }
        }

        // ── Virtual Display Setup ─────────────────────────────────────────────

        private fun setupVirtualDisplay(holder: SurfaceHolder, width: Int, height: Int) {
            teardownEngine() 

            val displayManager = getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            val density = resources.displayMetrics.densityDpi

            virtualDisplay = displayManager.createVirtualDisplay(
                "VibeWalls_GPU_Display",
                width,
                height,
                density,
                holder.surface,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY or DisplayManager.VIRTUAL_DISPLAY_FLAG_PRESENTATION
            )

            virtualDisplay?.display?.let { display ->
                presentation = object : Presentation(this@HtmlWallpaperService, display) {
                    override fun onCreate(savedInstanceState: Bundle?) {
                        super.onCreate(savedInstanceState)
                        
                        setupWebView(this.context)
                        
                        setContentView(webView!!, ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        ))
                    }
                }
                presentation?.show()
            }
        }

        private fun teardownEngine() {
            webView?.evaluateJavascript("window.dispatchEvent(new CustomEvent('pauseWallpaper'));", null)
            webView?.stopLoading()
            webView?.destroy()
            webView = null

            presentation?.dismiss()
            presentation = null

            virtualDisplay?.release()
            virtualDisplay = null
        }

        // ── Visibility & Battery Optimization ────────────────────────────────

        private val sensorManager: SensorManager by lazy {
            this@HtmlWallpaperService.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        }
        private val rotationSensor: Sensor? by lazy {
            sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)
        }

        private val sensorListener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent) {
                if (event.sensor.type == Sensor.TYPE_ROTATION_VECTOR) {
                    
                    // BATTERY FIX: Throttle the JS Bridge
                    val now = System.currentTimeMillis()
                    if (now - lastSensorUpdate < SENSOR_THROTTLE_MS) return
                    lastSensorUpdate = now

                    val rotationMatrix = FloatArray(9)
                    SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
                    val orientation = FloatArray(3)
                    SensorManager.getOrientation(rotationMatrix, orientation)
                    
                    val azimuth = Math.toDegrees(orientation[0].toDouble()).toFloat()
                    val pitch = Math.toDegrees(orientation[1].toDouble()).toFloat()
                    val roll = Math.toDegrees(orientation[2].toDouble()).toFloat()

                    mainHandler.post {
                        webView?.evaluateJavascript(
                            "window.rotationData = { alpha: $azimuth, beta: $pitch, gamma: $roll };", null
                        )
                    }
                }
            }
            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isEngineVisible = visible
            mainHandler.post {
                if (visible) {
                    rotationSensor?.let {
                        sensorManager.registerListener(sensorListener, it, SensorManager.SENSOR_DELAY_UI)
                    }
                    webView?.onResume()
                    webView?.evaluateJavascript("window.dispatchEvent(new CustomEvent('playWallpaper'));", null)
                } else {
                    sensorManager.unregisterListener(sensorListener)
                    webView?.evaluateJavascript("window.dispatchEvent(new CustomEvent('pauseWallpaper'));", null)
                    webView?.onPause()
                }
            }
        }

        override fun onOffsetsChanged(
            xOffset: Float, yOffset: Float,
            xStep: Float, yStep: Float,
            xPixels: Int, yPixels: Int
        ) {
            mainHandler.post {
                webView?.evaluateJavascript("window.scrollOffset = $xOffset;", null)
            }
        }

        // ── Touch Forwarding ──────────────────────────────────────────────────

        override fun onTouchEvent(event: MotionEvent) {
            mainHandler.post { webView?.dispatchTouchEvent(event) }
        }

        // ── GPU Accelerated WebView ───────────────────────────────────────────

        @SuppressLint("SetJavaScriptEnabled")
        private fun setupWebView(displayContext: Context) {
            webView = WebView(this@HtmlWallpaperService).apply {
                setLayerType(View.LAYER_TYPE_HARDWARE, null)
                setBackgroundColor(android.graphics.Color.TRANSPARENT)

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    allowFileAccess = true
                    allowContentAccess = true
                    @Suppress("DEPRECATION")
                    allowFileAccessFromFileURLs = true
                    @Suppress("DEPRECATION")
                    allowUniversalAccessFromFileURLs = true
                    cacheMode = WebSettings.LOAD_NO_CACHE
                    useWideViewPort = true
                    loadWithOverviewMode = true
                }

                // BUG-PROOF FIX: Handle Silent WebGL Crashes
                webViewClient = object : WebViewClient() {
                    override fun onRenderProcessGone(
                        view: WebView?,
                        detail: RenderProcessGoneDetail?
                    ): Boolean {
                        mainHandler.post {
                            surfaceHolder?.let { holder ->
                                val w = virtualDisplay?.display?.width ?: 1080
                                val h = virtualDisplay?.display?.height ?: 1920
                                setupVirtualDisplay(holder, w, h)
                            }
                        }
                        return true
                    }
                }
                
                webChromeClient = WebChromeClient()
            }

            // Initial load of the wallpaper
            val htmlPath = prefs.getString(PREF_KEY_PATH, null)

            if (htmlPath != null) {
                val cleanPath = when {
                    htmlPath.startsWith("file://") -> htmlPath
                    htmlPath.startsWith("/") -> "file://$htmlPath"
                    else -> "file://$htmlPath"
                }
                
                val diskPath = cleanPath.replace("file://", "").replace("//", "/")
                
                if (File(diskPath).exists()) {
                    webView?.loadUrl(cleanPath)
                } else {
                    webView?.loadUrl("file:///android_asset/wallpaper-payload/index.html")
                }
            } else {
                webView?.loadUrl("file:///android_asset/wallpaper-payload/index.html")
            }
        }
    }

    companion object {
        const val PREFS_NAME = "HtmlWallpaperPrefs"
        const val PREF_KEY_PATH = "htmlFilePath"
    }
}