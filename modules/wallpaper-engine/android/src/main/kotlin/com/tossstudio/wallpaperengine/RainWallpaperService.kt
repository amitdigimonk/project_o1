package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.random.Random

class RainWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = RainEngine()

    inner class RainEngine : Engine() {

        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val handler = Handler(Looper.getMainLooper())

        private var width = 0f
        private var height = 0f
        private var isVisible = false

        private val frameDelay = 16L
        private val drawRunner = Runnable { drawFrame() }

        private val dropCount = 120
        private val drops = Array(dropCount) { Drop() }

        inner class Drop {
            var x = 0f
            var y = 0f
            var speed = 0f
            var length = 0f
            var alpha = 0

            fun init() {
                x = Random.nextFloat() * width
                y = Random.nextFloat() * height
                speed = 5f + Random.nextFloat() * 10f
                length = 20f + Random.nextFloat() * 40f
                alpha = 80 + Random.nextInt(120)
            }
        }

        override fun onSurfaceChanged(holder: SurfaceHolder, format: Int, w: Int, h: Int) {
            width = w.toFloat()
            height = h.toFloat()
            drops.forEach { it.init() }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isVisible = visible
            if (visible) drawRunner.run()
            else handler.removeCallbacks(drawRunner)
        }

        override fun onDestroy() {
            handler.removeCallbacks(drawRunner)
        }

        private fun update() {
            for (d in drops) {
                d.y += d.speed

                if (d.y > height) {
                    d.y = -d.length
                    d.x = Random.nextFloat() * width
                }
            }
        }

        private fun drawFrame() {
            val holder = surfaceHolder
            var canvas: Canvas? = null

            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {

                    // subtle fade background for trail
                    canvas.drawColor(Color.argb(40, 0, 0, 0))

                    update()

                    for (d in drops) {

                        val gradient = LinearGradient(
                            d.x, d.y,
                            d.x, d.y + d.length,
                            Color.argb(d.alpha, 200, 200, 255),
                            Color.TRANSPARENT,
                            Shader.TileMode.CLAMP
                        )

                        paint.shader = gradient
                        paint.strokeWidth = 2f

                        canvas.drawLine(
                            d.x,
                            d.y,
                            d.x,
                            d.y + d.length,
                            paint
                        )

                        paint.shader = null
                    }
                }

            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            handler.removeCallbacks(drawRunner)
            if (isVisible) handler.postDelayed(drawRunner, frameDelay)
        }
    }
}