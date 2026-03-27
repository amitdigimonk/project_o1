package com.tossstudio.wallpaperengine

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder

class DinoWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine {
        return DinoEngine()
    }

    private inner class DinoEngine : Engine() {
        private val handler = Handler(Looper.getMainLooper())
        private val drawRunner = Runnable { draw() }
        
        // Define how our "Dino" looks
        private val paint = Paint().apply {
            color = Color.parseColor("#10B981") // Emerald Green
            style = Paint.Style.FILL
            isAntiAlias = true
            textSize = 80f
            textAlign = Paint.Align.CENTER
        }
        
        private var isVisible = false
        private var xPos = 200f
        private var yPos = 200f
        private var xSpeed = 12f
        private var ySpeed = 15f

        override fun onVisibilityChanged(visible: Boolean) {
            this.isVisible = visible
            if (visible) {
                handler.post(drawRunner)
            } else {
                handler.removeCallbacks(drawRunner)
            }
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder) {
            super.onSurfaceDestroyed(holder)
            isVisible = false
            handler.removeCallbacks(drawRunner)
        }

        private fun draw() {
            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    // 1. Clear the background (Deep Dark Gray)
                    canvas.drawColor(Color.parseColor("#111827"))

                    // 2. Calculate the next position
                    xPos += xSpeed
                    yPos += ySpeed

                    // 3. Bounce off the walls
                    if (xPos < 100 || xPos > canvas.width - 100) xSpeed = -xSpeed
                    if (yPos < 100 || yPos > canvas.height - 100) ySpeed = -ySpeed

                    // 4. Draw the actual graphic
                    canvas.drawCircle(xPos, yPos, 60f, paint)
                    paint.color = Color.WHITE
                    canvas.drawText("DINO", xPos, yPos - 100, paint)
                    paint.color = Color.parseColor("#10B981") // Reset color
                }
            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas)
                }
            }
            
            // 5. Loop the animation at ~60fps
            handler.removeCallbacks(drawRunner)
            if (isVisible) {
                handler.postDelayed(drawRunner, 16) 
            }
        }
    }
}