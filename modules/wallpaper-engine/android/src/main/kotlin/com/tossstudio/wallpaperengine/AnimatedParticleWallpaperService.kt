package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import kotlin.math.*
import kotlin.random.Random

class AnimatedParticleWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine = ParticleEngine()

    inner class ParticleEngine : Engine() {
        // ── DEDICATED HARDWARE RENDER THREAD ──
        private var renderThread: HandlerThread? = null
        private var renderHandler: Handler? = null
        private val drawRunner = Runnable { drawFrame() }
        private var isVisible = false

        // ── ZERO-ALLOCATION PAINTS ──
        private val bgPaint = Paint().apply {
            color = Color.parseColor("#03050A") // Deep cosmic void
        }
        private val particlePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL
        }

        private var screenW = 0f
        private var screenH = 0f
        private var centerX = 0f
        private var centerY = 0f

        // ── PHYSICS STATE ──
        // 3000 particles is easily handled by modern Android Canvas if no objects are allocated in the loop
        private val numParticles = 3000 
        private val particles = Array(numParticles) { Particle() }
        
        private var globalRotation = 0f // Slowly spins the entire 3D structure

        // Ring configurations (Angles to tilt the 4 intersecting orbits)
        private val ringRotations = floatArrayOf(0f, 60f, 120f, -45f)
        private val ringColors = intArrayOf(
            Color.parseColor("#38BDF8"), // Bright Blue
            Color.parseColor("#D946EF"), // Neon Pink/Purple
            Color.parseColor("#10B981"), // Emerald Green
            Color.parseColor("#FBBF24")  // Radiant Gold
        )

        inner class Particle {
            var type: Int = 0 // 0-3 for Rings, 4 for Ambient Dust
            
            // Ring Properties
            var angle: Float = 0f
            var speed: Float = 0f
            var radiusOffset: Float = 0f
            var color: Int = 0
            var baseSize: Float = 0f
            var baseAlpha: Float = 0f

            // Dust Properties
            var x: Float = 0f
            var y: Float = 0f
            var speedX: Float = 0f
            var speedY: Float = 0f

            fun init(index: Int, maxRadius: Float) {
                // 80% of particles belong to the intersecting rings, 20% are ambient background dust
                if (index < numParticles * 0.8) {
                    type = index % 4
                    color = ringColors[type]
                    
                    angle = Random.nextFloat() * PI.toFloat() * 2f
                    // Speeds vary so they smear into continuous lines
                    speed = (Random.nextFloat() * 0.015f) + 0.005f 
                    
                    // Gaussian-like distribution: densely packed in the center of the ring, scattered at edges
                    val thickness = maxRadius * 0.15f
                    val randomScatter = (Random.nextFloat() - 0.5f)
                    val cluster = (Random.nextFloat() - 0.5f)
                    radiusOffset = (randomScatter * cluster * thickness)
                    
                    baseSize = Random.nextFloat() * 4f + 1.5f
                    baseAlpha = Random.nextFloat() * 155f + 100f // 100 to 255
                } else {
                    type = 4 // Dust
                    color = Color.parseColor("#88AABB") // Faint starlight blue
                    x = Random.nextFloat() * screenW
                    y = Random.nextFloat() * screenH
                    speedX = (Random.nextFloat() - 0.5f) * 1f
                    speedY = (Random.nextFloat() - 0.5f) * 1f
                    baseSize = Random.nextFloat() * 2.5f + 0.5f
                    baseAlpha = Random.nextFloat() * 100f + 50f
                }
            }
        }

        override fun onCreate(surfaceHolder: SurfaceHolder?) {
            super.onCreate(surfaceHolder)
            // Interaction completely disabled for pure performance
            setTouchEventsEnabled(false) 
            
            renderThread = HandlerThread("GalaxyRenderThread").apply { start() }
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
            centerX = screenW / 2f
            centerY = screenH / 2f
            
            // Base size of the 3D sphere
            val maxRadius = min(screenW, screenH) * 0.45f 
            
            for (i in particles.indices) {
                particles[i].init(i, maxRadius)
            }
            renderHandler?.post(drawRunner)
        }

        private fun updatePhysics() {
            // Slowly rotate the entire camera/structure
            globalRotation += 0.003f 

            val baseRadius = min(screenW, screenH) * 0.45f

            for (p in particles) {
                if (p.type < 4) {
                    // Swirl the particle along its specific ring
                    p.angle += p.speed
                } else {
                    // Drift ambient dust
                    p.x += p.speedX
                    p.y += p.speedY
                    
                    // Seamless screen wrapping for dust
                    if (p.x < -10f) p.x = screenW + 10f
                    if (p.x > screenW + 10f) p.x = -10f
                    if (p.y < -10f) p.y = screenH + 10f
                    if (p.y > screenH + 10f) p.y = -10f
                }
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
                    // Fast background clear
                    canvas.drawColor(bgPaint.color)

                    val baseRadius = min(screenW, screenH) * 0.45f

                    // ── ZERO ALLOCATION LOOP ──
                    for (i in 0 until numParticles) {
                        val p = particles[i]

                        if (p.type < 4) {
                            // 1. Calculate base 2D circle with 3D Y-Axis Squish
                            val r = baseRadius + p.radiusOffset
                            val localX = r * cos(p.angle)
                            // Squish the Y axis by 0.35 to make the rings look like tilted 3D plates
                            val localY = r * sin(p.angle) * 0.35f 

                            // 2. Get the specific tilt for this ring, plus the global camera spin
                            val ringRotRad = Math.toRadians(ringRotations[p.type].toDouble()).toFloat()
                            val finalRot = ringRotRad + globalRotation

                            // 3. Apply 2D Rotation Matrix to position the ring on the screen
                            val drawX = centerX + localX * cos(finalRot) - localY * sin(finalRot)
                            val drawY = centerY + localX * sin(finalRot) + localY * cos(finalRot)

                            // 4. Fake Z-Depth (Crucial for 3D realism without performance drop)
                            // sin(p.angle) goes from -1 (back) to 1 (front)
                            val zDepth = sin(p.angle) 
                            
                            // Particles in front are 30% larger, particles in back are 30% smaller
                            val dynamicSize = p.baseSize * (1f + zDepth * 0.3f)
                            
                            // Particles in back fade into the darkness
                            val dynamicAlpha = (p.baseAlpha * (0.6f + zDepth * 0.4f)).toInt()

                            particlePaint.color = p.color
                            particlePaint.alpha = dynamicAlpha.coerceIn(0, 255)
                            
                            canvas.drawCircle(drawX, drawY, dynamicSize, particlePaint)
                        } else {
                            // Draw ambient dust
                            particlePaint.color = p.color
                            particlePaint.alpha = p.baseAlpha.toInt()
                            canvas.drawCircle(p.x, p.y, p.baseSize, particlePaint)
                        }
                    }
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            renderHandler?.removeCallbacks(drawRunner)
            if (isVisible) {
                renderHandler?.postDelayed(drawRunner, 16) // Locked 60fps
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