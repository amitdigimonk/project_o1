package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import kotlin.math.*

class AuroraWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = AuroraEngine()

    inner class AuroraEngine : Engine() {

        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val handler = Handler(Looper.getMainLooper())

        private var width = 0f
        private var height = 0f
        private var time = 0f
        private var isVisible = false

        // touch
        private var touchX = -1f
        private var touchY = -1f
        private var touchInfluence = 0f

        // parallax
        private var offsetX = 0f

        // theme
        private var theme = 1
        private var lastTapTime = 0L

        private val frameDelay = 16L

        private val drawRunner = Runnable { drawFrame() }

        override fun onSurfaceChanged(holder: SurfaceHolder, format: Int, w: Int, h: Int) {
            width = w.toFloat()
            height = h.toFloat()
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isVisible = visible
            if (visible) drawRunner.run()
            else handler.removeCallbacks(drawRunner)
        }

        override fun onDestroy() {
            handler.removeCallbacks(drawRunner)
        }

        // 👆 TOUCH + DOUBLE TAP
        override fun onTouchEvent(event: MotionEvent) {
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    val now = System.currentTimeMillis()

                    // double tap → change theme
                    if (now - lastTapTime < 300) {
                        theme = (theme + 1) % 3
                    }
                    lastTapTime = now

                    touchX = event.x
                    touchY = event.y
                    touchInfluence = 1f
                }

                MotionEvent.ACTION_MOVE -> {
                    touchX = event.x
                    touchY = event.y
                    touchInfluence = 1f
                }

                MotionEvent.ACTION_UP -> {
                    // fade out effect instead of instant stop
                }
            }
        }

        // 📱 PARALLAX
        override fun onOffsetsChanged(
            xOffset: Float,
            yOffset: Float,
            xOffsetStep: Float,
            yOffsetStep: Float,
            xPixelOffset: Int,
            yPixelOffset: Int
        ) {
            offsetX = xOffset
        }

        private fun drawFrame() {
            val holder = surfaceHolder
            var canvas: Canvas? = null

            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {

                    canvas.drawColor(Color.BLACK)

                    time += 0.02f

                    // smooth touch fade
                    touchInfluence *= 0.95f

                    val colors = getThemeColors()

                    drawWave(canvas, colors[0], 0.5f, 80f, 0.6f)
                    drawWave(canvas, colors[1], 0.8f, 120f, 0.4f)
                    drawWave(canvas, colors[2], 1.2f, 60f, 0.3f)
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }

        private fun drawWave(
            canvas: Canvas,
            color: Int,
            speed: Float,
            amplitude: Float,
            alphaFactor: Float
        ) {
            val path = Path()
            val baseY = height * 0.5f

            path.moveTo(0f, height)

            var x = 0f
            while (x <= width) {

                // smoother parallax
                val parallax = (offsetX - 0.5f) * 60f

                var y = baseY + sin((x * 0.01f) + time * speed + parallax) * amplitude

                // 👆 TOUCH DISTORTION (smooth)
                if (touchInfluence > 0.01f && touchX != -1f) {
                    val dx = x - touchX
                    val dy = y - touchY
                    val dist = sqrt(dx * dx + dy * dy)

                    if (dist < 300f) {
                        val force = (1f - dist / 300f) * touchInfluence
                        y += sin(dist * 0.05f - time * 3f) * 40f * force
                    }
                }

                path.lineTo(x, y)
                x += 10f
            }

            path.lineTo(width, height)
            path.close()

            val gradient = LinearGradient(
                0f, 0f, 0f, height,
                ColorUtils.adjustAlpha(color, alphaFactor),
                Color.TRANSPARENT,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawPath(path, paint)
            paint.shader = null
        }

        private fun getThemeColors(): IntArray {
            return when (theme) {

                // DARK
                0 -> intArrayOf(
                    Color.parseColor("#3B82F6"),
                    Color.parseColor("#A855F7"),
                    Color.parseColor("#EC4899")
                )

                // NEON
                1 -> intArrayOf(
                    Color.parseColor("#00FFFF"),
                    Color.parseColor("#FF00FF"),
                    Color.parseColor("#00FF88")
                )

                // SUNSET
                else -> intArrayOf(
                    Color.parseColor("#FF7E5F"),
                    Color.parseColor("#FEB47B"),
                    Color.parseColor("#FF9966")
                )
            }
        }
    }
}