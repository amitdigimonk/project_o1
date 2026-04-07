package com.tossstudio.wallpaperengine

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * HtmlWallpaperService
 *
 * Renders an HTML5/Canvas web page as a live wallpaper using a WebView drawn
 * into the WallpaperService SurfaceHolder canvas every ~16 ms (≈60 fps).
 *
 * Battery optimization:
 *   - onVisibilityChanged(false) → dispatches a JS `pauseWallpaper` event so
 *     the web payload can cancel its requestAnimationFrame loop.
 *   - onVisibilityChanged(true)  → dispatches `playWallpaper` to resume.
 *   - The native draw loop also stops/starts to match visibility.
 *
 * Touch forwarding:
 *   - Raw MotionEvents from the launcher are dispatched directly to the WebView.
 *
 * HTML file path:
 *   - Read from SharedPreferences "HtmlWallpaperPrefs" → key "htmlFilePath".
 *   - Format expected: "file:///data/user/0/com.tossstudio/files/wallpaper/index.html"
 *   - A minimal fallback page is shown when no path is stored yet.
 */
class HtmlWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = HtmlEngine()

    // ── Inner Engine ──────────────────────────────────────────────────────────

    inner class HtmlEngine : Engine() {

        private val mainHandler = Handler(Looper.getMainLooper())
        private var webView: WebView? = null

        private var surfaceWidth = 0
        private var surfaceHeight = 0
        private var isEngineVisible = false

        /** Continuous ~60 fps draw runnable — stopped when wallpaper is not visible. */
        private val drawRunnable = object : Runnable {
            override fun run() {
                drawWebViewToCanvas()
                if (isEngineVisible) {
                    mainHandler.postDelayed(this, FRAME_DELAY_MS)
                }
            }
        }

        // ── Lifecycle ─────────────────────────────────────────────────────────

        override fun onCreate(surfaceHolder: SurfaceHolder) {
            super.onCreate(surfaceHolder)
            setTouchEventsEnabled(true)
        }

        override fun onSurfaceCreated(holder: SurfaceHolder) {
            super.onSurfaceCreated(holder)
            mainHandler.post { setupWebView() }
        }

        override fun onSurfaceChanged(
            holder: SurfaceHolder,
            format: Int,
            width: Int,
            height: Int
        ) {
            super.onSurfaceChanged(holder, format, width, height)
            surfaceWidth = width
            surfaceHeight = height
            mainHandler.post { measureAndLayoutWebView(width, height) }
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder) {
            super.onSurfaceDestroyed(holder)
            stopDrawLoop()
            mainHandler.post {
                webView?.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('pauseWallpaper'));", null
                )
                webView?.stopLoading()
                webView?.destroy()
                webView = null
            }
        }

        override fun onDestroy() {
            super.onDestroy()
            stopDrawLoop()
            mainHandler.post {
                webView?.destroy()
                webView = null
            }
        }

        // ── Visibility & battery optimization ────────────────────────────────

        override fun onVisibilityChanged(visible: Boolean) {
            isEngineVisible = visible
            mainHandler.post {
                if (visible) {
                    webView?.onResume()
                    webView?.evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('playWallpaper'));", null
                    )
                    startDrawLoop()
                } else {
                    webView?.evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('pauseWallpaper'));", null
                    )
                    webView?.onPause()
                    stopDrawLoop()
                }
            }
        }

        // ── Touch forwarding ──────────────────────────────────────────────────

        override fun onTouchEvent(event: MotionEvent) {
            mainHandler.post { webView?.dispatchTouchEvent(event) }
        }

        // ── WebView setup ─────────────────────────────────────────────────────

        @SuppressLint("SetJavaScriptEnabled")
        private fun setupWebView() {
            val ctx: Context = this@HtmlWallpaperService

            webView = WebView(ctx).apply {
                // Software rendering is required for drawing into a Canvas.
                // HTML5 2D canvas, CSS animations, and DOM work perfectly.
                // WebGL / WebGPU are NOT supported in software layer mode.
                setLayerType(View.LAYER_TYPE_SOFTWARE, null)

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    @Suppress("DEPRECATION")
                    allowFileAccessFromFileURLs = true
                    @Suppress("DEPRECATION")
                    allowUniversalAccessFromFileURLs = true
                    mediaPlaybackRequiresUserGesture = false
                    cacheMode = WebSettings.LOAD_DEFAULT
                    useWideViewPort = true
                    loadWithOverviewMode = true
                    builtInZoomControls = false
                    displayZoomControls = false
                }

                // Suppress default error UI
                webViewClient = object : WebViewClient() {
                    override fun onReceivedError(
                        view: WebView,
                        errorCode: Int,
                        description: String,
                        failingUrl: String
                    ) { /* ignore */ }
                }
                webChromeClient = WebChromeClient()
            }

            // Load path from SharedPreferences written by WallpaperEngineModule
            val prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val htmlPath = prefs.getString(PREF_KEY_PATH, null)

            if (!htmlPath.isNullOrBlank()) {
                webView?.loadUrl(htmlPath)
            } else {
                webView?.loadDataWithBaseURL(
                    null, FALLBACK_HTML, "text/html", "UTF-8", null
                )
            }

            // Initial measure so the first frame draws correctly
            if (surfaceWidth > 0 && surfaceHeight > 0) {
                measureAndLayoutWebView(surfaceWidth, surfaceHeight)
            }
        }

        private fun measureAndLayoutWebView(width: Int, height: Int) {
            webView?.let { wv ->
                val wSpec = View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY)
                val hSpec = View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY)
                wv.measure(wSpec, hSpec)
                wv.layout(0, 0, width, height)
            }
        }

        // ── Draw loop ─────────────────────────────────────────────────────────

        private fun startDrawLoop() {
            mainHandler.removeCallbacks(drawRunnable)
            mainHandler.post(drawRunnable)
        }

        private fun stopDrawLoop() {
            mainHandler.removeCallbacks(drawRunnable)
        }

        private fun drawWebViewToCanvas() {
            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                canvas?.let { c ->
                    // Re-measure if surface dimensions changed between frames
                    val wv = webView ?: return
                    if (wv.width != c.width || wv.height != c.height) {
                        measureAndLayoutWebView(c.width, c.height)
                    }
                    wv.draw(c)
                }
            } catch (_: Exception) {
                // Surface may be destroyed mid-frame; silently skip
            } finally {
                canvas?.let { holder.unlockCanvasAndPost(it) }
            }
        }
    }

    // ── Constants ─────────────────────────────────────────────────────────────

    companion object {
        /** SharedPreferences file name shared with WallpaperEngineModule. */
        const val PREFS_NAME = "HtmlWallpaperPrefs"

        /** Key under which the full file:// URL of index.html is stored. */
        const val PREF_KEY_PATH = "htmlFilePath"

        /** Target ~60 fps. Increase to 33 for ~30 fps if battery matters more. */
        private const val FRAME_DELAY_MS = 16L

        /** Minimal fallback rendered when no HTML path has been configured yet. */
        private val FALLBACK_HTML = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                  background: #0d0d1a;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  font-family: sans-serif;
                  color: rgba(255,255,255,0.7);
                  text-align: center;
                  gap: 12px;
                }
                p { font-size: 16px; line-height: 1.5; }
                span { font-size: 28px; }
              </style>
            </head>
            <body>
              <span>🎨</span>
              <p>No wallpaper loaded yet.<br>Select one from <strong>Vibe Walls</strong>!</p>
            </body>
            </html>
        """.trimIndent()
    }
}
