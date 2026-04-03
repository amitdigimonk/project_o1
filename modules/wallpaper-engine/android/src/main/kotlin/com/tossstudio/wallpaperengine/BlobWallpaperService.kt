package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.*

class BlobWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = BlobEngine()

    inner class BlobEngine : Engine() {

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

                    time += 0.02f

                    drawBlob(canvas, width * 0.4f, height * 0.5f, 180f, "#3B82F6", 0.0f)
                    drawBlob(canvas, width * 0.6f, height * 0.55f, 200f, "#A855F7", 1.5f)
                    drawBlob(canvas, width * 0.5f, height * 0.4f, 150f, "#EC4899", 3.0f)
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }

        private fun drawBlob(
            canvas: Canvas,
            cx: Float,
            cy: Float,
            baseRadius: Float,
            colorHex: String,
            phase: Float
        ) {
            val path = Path()
            val points = 60 // smoothness

            for (i in 0..points) {
                val angle = (i.toFloat() / points) * (2f * PI).toFloat()

                // morphing radius
                val noise = sin(angle * 3 + time + phase) * 20f +
                            sin(angle * 5 - time * 1.2f) * 10f

                val radius = baseRadius + noise

                val x = cx + cos(angle) * radius
                val y = cy + sin(angle) * radius

                if (i == 0) path.moveTo(x, y)
                else path.lineTo(x, y)
            }

            path.close()

            val color = Color.parseColor(colorHex)

            val gradient = RadialGradient(
                cx, cy, baseRadius * 1.2f,
                ColorUtils.adjustAlpha(color, 0.6f),
                Color.TRANSPARENT,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawPath(path, paint)
            paint.shader = null
        }
    }
}