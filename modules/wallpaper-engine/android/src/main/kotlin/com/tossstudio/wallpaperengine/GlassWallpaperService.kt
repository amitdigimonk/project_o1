package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.sin

class GlassWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = GlassEngine()

    inner class GlassEngine : Engine() {

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

                    drawBackground(canvas)

                    time += 0.01f

                    drawCard(canvas, width * 0.3f, height * (0.4f + sin(time) * 0.05f))
                    drawCard(canvas, width * 0.7f, height * (0.6f + sin(time * 1.2f) * 0.05f))
                }

            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }

        private fun drawBackground(canvas: Canvas) {
            val gradient = LinearGradient(
                0f, 0f, width, height,
                intArrayOf(
                    Color.parseColor("#0F172A"),
                    Color.parseColor("#1E293B"),
                    Color.parseColor("#312E81")
                ),
                null,
                Shader.TileMode.CLAMP
            )

            paint.shader = gradient
            canvas.drawRect(0f, 0f, width, height, paint)
            paint.shader = null
        }

        private fun drawCard(canvas: Canvas, cx: Float, cy: Float) {
            val rectW = 220f
            val rectH = 140f

            val left = cx - rectW / 2
            val top = cy - rectH / 2
            val right = cx + rectW / 2
            val bottom = cy + rectH / 2

            val rect = RectF(left, top, right, bottom)

            // glass fill
            paint.color = Color.argb(40, 255, 255, 255)
            canvas.drawRoundRect(rect, 30f, 30f, paint)

            // border
            paint.style = Paint.Style.STROKE
            paint.strokeWidth = 2f
            paint.color = Color.argb(120, 255, 255, 255)
            canvas.drawRoundRect(rect, 30f, 30f, paint)

            paint.style = Paint.Style.FILL
        }
    }
}