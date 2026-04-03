package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import kotlin.math.sqrt
import kotlin.random.Random

class NeuralWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine = NeuralEngine()

    inner class NeuralEngine : Engine() {

        private val nodePaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val linePaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val handler = Handler(Looper.getMainLooper())

        private var width = 0f
        private var height = 0f
        private var isVisible = false

        private val frameDelay = 16L
        private val drawRunner = Runnable { drawFrame() }

        private val nodeCount = 90
        private val nodes = Array(nodeCount) { Node() }

        // touch
        private var touchX = -1f
        private var touchY = -1f

        inner class Node {
            var x = 0f
            var y = 0f
            var vx = 0f
            var vy = 0f

            fun init() {
                x = Random.nextFloat() * width
                y = Random.nextFloat() * height
                vx = (Random.nextFloat() - 0.5f) * 0.5f
                vy = (Random.nextFloat() - 0.5f) * 0.5f
            }
        }

        override fun onSurfaceChanged(holder: SurfaceHolder, format: Int, w: Int, h: Int) {
            width = w.toFloat()
            height = h.toFloat()
            nodes.forEach { it.init() }
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
            when (event.action) {
                MotionEvent.ACTION_MOVE, MotionEvent.ACTION_DOWN -> {
                    touchX = event.x
                    touchY = event.y
                }
                MotionEvent.ACTION_UP -> {
                    touchX = -1f
                    touchY = -1f
                }
            }
        }

        private fun update() {
            for (n in nodes) {
                n.x += n.vx
                n.y += n.vy

                // bounce edges
                if (n.x < 0 || n.x > width) n.vx *= -1
                if (n.y < 0 || n.y > height) n.vy *= -1

                // slight pull to touch
                if (touchX != -1f) {
                    val dx = touchX - n.x
                    val dy = touchY - n.y
                    val dist = sqrt(dx * dx + dy * dy)

                    if (dist < 200f) {
                        n.x += dx * 0.002f
                        n.y += dy * 0.002f
                    }
                }
            }
        }

        private fun drawFrame() {
            val holder = surfaceHolder
            var canvas: Canvas? = null

            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {

                    canvas.drawColor(Color.BLACK)

                    update()

                    // draw connections
                    for (i in nodes.indices) {
                        for (j in i + 1 until nodes.size) {

                            val dx = nodes[i].x - nodes[j].x
                            val dy = nodes[i].y - nodes[j].y
                            val dist = sqrt(dx * dx + dy * dy)

                            if (dist < 180f) {
                                val alpha = ((1f - dist / 180f) * 120).toInt()

                                linePaint.color = Color.CYAN
                                linePaint.alpha = alpha
                                linePaint.strokeWidth = 1.5f

                                canvas.drawLine(
                                    nodes[i].x, nodes[i].y,
                                    nodes[j].x, nodes[j].y,
                                    linePaint
                                )
                            }
                        }
                    }

                    // draw nodes
                    for (n in nodes) {
                        nodePaint.color = Color.WHITE
                        nodePaint.alpha = 200

                        canvas.drawCircle(n.x, n.y, 3f, nodePaint)
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