package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.HandlerThread
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.sin
import kotlin.random.Random

class FloatingBokehWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine = ParticleEngine()

    inner class ParticleEngine : Engine() {
        // ── DEDICATED HARDWARE RENDER THREAD ──
        private var renderThread: HandlerThread? = null
        private var renderHandler: Handler? = null
        private val drawRunner = Runnable { drawFrame() }
        private var isVisible = false

        // ── ZERO-ALLOCATION PAINTS ──
        private val bgPaint = Paint()
        private val particlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
            // Screen blend mode makes overlapping orbs look like glowing light
            blendMode = BlendMode.SCREEN 
        }

        private var screenW = 0f
        private var screenH = 0f

        // ── OPTIMIZED PHYSICS STATE ──
        // Low particle count for battery optimization. Relies on size and opacity for the vibe.
        private val numParticles = 150 
        private val particles = Array(numParticles) { Particle() }

        // ── MIDNIGHT AURORA PALETTE (Modern, Sleek, OLED-Friendly) ──
        private val vibeColors = intArrayOf(
            Color.parseColor("#7C3AED"), // Deep modern violet
            Color.parseColor("#2DD4BF"), // Soft glowing mint/teal
            Color.parseColor("#3B82F6"), // Clean azure blue
            Color.parseColor("#818CF8"), // Soft periwinkle
            Color.parseColor("#E0E7FF")  // Icy white-blue highlight
        )

        inner class Particle {
            var x: Float = 0f
            var y: Float = 0f
            var size: Float = 0f
            var color: Int = 0
            
            // Movement mechanics
            var speedY: Float = 0f
            var speedX: Float = 0f
            var phase: Float = 0f       // For organic sine-wave drifting
            var phaseSpeed: Float = 0f

            // Pulsing mechanics
            var baseAlpha: Float = 0f
            var alphaPhase: Float = 0f
            var alphaSpeed: Float = 0f

            fun init(width: Float, height: Float, randomizeY: Boolean = true) {
                x = Random.nextFloat() * width
                // Start scattered on screen, or respawn at the bottom
                y = if (randomizeY) Random.nextFloat() * height else height + 100f
                
                color = vibeColors.random()
                
                // Varied sizes: massive background blurs and smaller foreground dots
                size = Random.nextFloat() * (width * 0.15f) + 20f 
                
                // Slower, relaxing movement
                speedY = Random.nextFloat() * 1.5f + 0.5f 
                speedX = (Random.nextFloat() - 0.5f) * 0.5f
                
                phase = Random.nextFloat() * Math.PI.toFloat() * 2f
                phaseSpeed = Random.nextFloat() * 0.02f + 0.005f
                
                baseAlpha = Random.nextFloat() * 80f + 20f // 20 to 100 opacity
                alphaPhase = Random.nextFloat() * Math.PI.toFloat() * 2f
                alphaSpeed = Random.nextFloat() * 0.03f + 0.01f
            }
        }

        override fun onCreate(surfaceHolder: SurfaceHolder?) {
            super.onCreate(surfaceHolder)
            setTouchEventsEnabled(false) // Disabled for battery saving
            
            renderThread = HandlerThread("AuraRenderThread").apply { start() }
            renderHandler = Handler(renderThread!!.looper)
        }

        override fun onDestroy() {
            super.onDestroy()
            renderHandler?.removeCallbacks(drawRunner)
            renderThread?.quitSafely()
        }

        override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {
            screenW = width.toFloat()
            screenH = height.toFloat()
            
            // ── OLED BLACK BACKGROUND GRADIENT ──
            val bgShader = LinearGradient(
                0f, 0f, screenW, screenH,
                intArrayOf(
                    Color.parseColor("#000000"), // True OLED Black
                    Color.parseColor("#090E17"), // Barely visible deep navy
                    Color.parseColor("#000000")  // True OLED Black
                ),
                null, 
                Shader.TileMode.CLAMP
            )
            bgPaint.shader = bgShader

            // Initialize all particles
            for (p in particles) {
                p.init(screenW, screenH, randomizeY = true)
            }
            renderHandler?.post(drawRunner)
        }

        private fun updatePhysics() {
            for (p in particles) {
                // Organic upward drift
                p.y -= p.speedY
                
                // Smooth sine-wave horizontal swaying
                p.phase += p.phaseSpeed
                p.x += sin(p.phase) * 1.5f + p.speedX
                
                // Gentle pulsing in opacity
                p.alphaPhase += p.alphaSpeed

                // Reset particle to the bottom if it drifts entirely off the top
                if (p.y < -p.size) {
                    p.init(screenW, screenH, randomizeY = false)
                }
                
                // Horizontal screen wrap
                if (p.x < -p.size) p.x = screenW + p.size
                if (p.x > screenW + p.size) p.x = -p.size
            }
        }

        private fun drawFrame() {
            if (!isVisible) return

            updatePhysics()

            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    // Draw the static rich background gradient
                    canvas.drawRect(0f, 0f, screenW, screenH, bgPaint)

                    // ── ZERO ALLOCATION DRAW LOOP ──
                    for (i in 0 until numParticles) {
                        val p = particles[i]

                        // Calculate current pulsing alpha
                        val pulse = (sin(p.alphaPhase) + 1f) / 2f // normalizes to 0.0 - 1.0
                        val currentAlpha = (p.baseAlpha * (0.5f + 0.5f * pulse)).toInt()

                        particlePaint.color = p.color
                        particlePaint.alpha = currentAlpha.coerceIn(0, 255)
                        
                        canvas.drawCircle(p.x, p.y, p.size, particlePaint)
                    }
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            renderHandler?.removeCallbacks(drawRunner)
            if (isVisible) {
                // 20ms delay targets ~50fps. 
                // Because the movement is slow and smooth, 50fps looks identical to 60fps 
                // but drastically reduces CPU waking, saving battery.
                renderHandler?.postDelayed(drawRunner, 20) 
            }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isVisible = visible
            if (visible) {
                renderHandler?.post(drawRunner)
            } else {
                renderHandler?.removeCallbacks(drawRunner)
            }
        }
    }
}