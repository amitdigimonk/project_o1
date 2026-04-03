package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.sin

class PlasmaWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = PlasmaEngine()

    inner class PlasmaEngine : Engine() {

        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val handler = Handler(Looper.getMainLooper())

        private var width = 0f
        private var height = 0f
        private var time = 0f
        private var isVisible = false

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

        private fun drawFrame() {
            val holder = surfaceHolder
            var canvas: Canvas? = null

            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {

                    canvas.drawColor(Color.BLACK)

                    time += 0.03f

                    drawLayer(canvas, "#FF3B30", 0.6f, 120f)
                    drawLayer(canvas, "#FF9500", 0.8f, 90f)
                    drawLayer(canvas, "#FF2D55", 1.2f, 60f)
                }

            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }

        private fun drawLayer(
            canvas: Canvas,
            colorHex: String,
            speed: Float,
            amplitude: Float
        ) {
            val path = Path()

            path.moveTo(0f, height)

            var x = 0f
            while (x <= width) {

                val y = height * 0.5f +
                        sin(x * 0.01f + time * speed) * amplitude +
                        sin(x * 0.02f - time * speed * 0.7f) * (amplitude * 0.5f)

                path.lineTo(x, y)
                x += 8f
            }

            path.lineTo(width, height)
            path.close()

            val color = Color.parseColor(colorHex)

            val gradient = LinearGradient(
                0f, 0f, 0f, height,
                ColorUtils.adjustAlpha(color, 0.7f),
                Color.TRANSPARENT,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawPath(path, paint)
            paint.shader = null
        }
    }
}