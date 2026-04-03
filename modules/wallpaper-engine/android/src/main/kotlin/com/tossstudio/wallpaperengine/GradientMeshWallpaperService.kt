package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.sin

class GradientMeshWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = MeshEngine()

    inner class MeshEngine : Engine() {

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

                    time += 0.01f

                    drawBlob(canvas, width * (0.3f + sin(time) * 0.1f), height * 0.4f, 300f, "#3B82F6")
                    drawBlob(canvas, width * (0.7f + sin(time * 1.2f) * 0.1f), height * 0.6f, 350f, "#A855F7")
                    drawBlob(canvas, width * 0.5f, height * (0.3f + sin(time * 0.8f) * 0.1f), 280f, "#EC4899")
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
            radius: Float,
            colorHex: String
        ) {
            val color = Color.parseColor(colorHex)

            val gradient = RadialGradient(
                cx,
                cy,
                radius,
                ColorUtils.adjustAlpha(color, 0.6f),
                Color.TRANSPARENT,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawCircle(cx, cy, radius, paint)
            paint.shader = null
        }
    }
}