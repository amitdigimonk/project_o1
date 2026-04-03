package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import kotlin.math.cos
import kotlin.math.sin

class OrbitWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = OrbitEngine()

    inner class OrbitEngine : Engine() {

        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val handler = Handler(Looper.getMainLooper())

        private var width = 0f
        private var height = 0f
        private var centerX = 0f
        private var centerY = 0f

        private var time = 0f
        private var isVisible = false

        private val frameDelay = 16L
        private val drawRunner = Runnable { drawFrame() }

        // touch boost
        private var speedBoost = 1f

        // orbit config
        private val rings = listOf(
            Orbit(120f, 0.4f, 6, Color.parseColor("#60A5FA")),
            Orbit(180f, -0.3f, 8, Color.parseColor("#A78BFA")),
            Orbit(240f, 0.2f, 10, Color.parseColor("#F472B6"))
        )

        inner class Orbit(
            val radius: Float,
            val speed: Float,
            val count: Int,
            val color: Int
        )

        override fun onSurfaceChanged(holder: SurfaceHolder, format: Int, w: Int, h: Int) {
            width = w.toFloat()
            height = h.toFloat()
            centerX = width / 2f
            centerY = height / 2f
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isVisible = visible
            if (visible) drawRunner.run()
            else handler.removeCallbacks(drawRunner)
        }

        override fun onDestroy() {
            handler.removeCallbacks(drawRunner)
        }

        override fun onTouchEvent(event: MotionEvent) {
            if (event.action == MotionEvent.ACTION_DOWN) {
                speedBoost = 2.5f // temporary boost
            }
        }

        private fun drawFrame() {
            val holder = surfaceHolder
            var canvas: Canvas? = null

            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {

                    canvas.drawColor(Color.BLACK)

                    time += 0.01f * speedBoost

                    // decay boost smoothly
                    speedBoost *= 0.96f
                    if (speedBoost < 1f) speedBoost = 1f

                    drawCenterGlow(canvas)

                    for (orbit in rings) {
                        drawOrbit(canvas, orbit)
                    }
                }

            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }

        private fun drawOrbit(canvas: Canvas, orbit: Orbit) {

            val angleStep = (2 * Math.PI / orbit.count).toFloat()

            for (i in 0 until orbit.count) {

                val angle = time * orbit.speed + i * angleStep

                val x = centerX + cos(angle) * orbit.radius
                val y = centerY + sin(angle) * orbit.radius

                // glow (outer)
                paint.color = orbit.color
                paint.alpha = 60
                canvas.drawCircle(x.toFloat(), y.toFloat(), 10f, paint)

                // core dot
                paint.alpha = 200
                canvas.drawCircle(x.toFloat(), y.toFloat(), 4f, paint)
            }
        }

        private fun drawCenterGlow(canvas: Canvas) {
            val gradient = RadialGradient(
                centerX,
                centerY,
                80f,
                Color.argb(80, 255, 255, 255),
                Color.TRANSPARENT,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawCircle(centerX, centerY, 80f, paint)
            paint.shader = null
        }
    }
}