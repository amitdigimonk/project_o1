// package com.tossstudio.wallpaperengine

// import android.content.Context
// import android.graphics.*
// import android.os.Handler
// import android.os.Looper
// import android.service.wallpaper.WallpaperService
// import android.view.MotionEvent
// import android.view.SurfaceHolder
// import kotlin.random.Random

// data class Obstacle(var x: Float, var y: Float, var bitmap: Bitmap, val type: Int)
// data class Cloud(var x: Float, var y: Float, var speed: Float)

// class DinoWallpaperService : WallpaperService() {
//     override fun onCreateEngine(): Engine = DinoEngine()

//     inner class DinoEngine : Engine() {
//         private val handler = Handler(Looper.getMainLooper())
//         private val drawRunner = Runnable { drawFrame() }
//         private var isVisible = false
        
//         // ── ZERO-ALLOCATION PAINTS ──
//         private val mainPaint = Paint(Paint.ANTI_ALIAS_FLAG)
//         private val uiPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { textAlign = Paint.Align.CENTER }
//         // (bgPaint has been entirely removed for maximum performance)
        
//         // Colors for minimalist, "viby" aesthetic
//         private val bgColor = Color.parseColor("#F5F3ED") // Solid color fallback
//         private val groundColor = Color.parseColor("#D4D0C5")
//         private val spriteColor = Color.parseColor("#4A4A4A")
//         private val cloudColor = Color.parseColor("#E8E5DA")
//         private val uiColor = Color.argb(160, 74, 74, 74)

//         // Bitmaps
//         private lateinit var dinoIdle: Bitmap
//         private lateinit var dinoRun1: Bitmap
//         private lateinit var dinoRun2: Bitmap
//         private lateinit var cactusSmall: Bitmap
//         private lateinit var cactusLarge: Bitmap
//         private lateinit var bird1: Bitmap
//         private lateinit var bird2: Bitmap
//         private lateinit var cloudBmp: Bitmap

//         private val obstacles = mutableListOf<Obstacle>()
//         private val clouds = mutableListOf<Cloud>()

//         // ── ZERO-ALLOCATION HITBOXES & STRINGS ──
//         private val dinoHitbox = Rect()
//         private val obsHitbox = Rect()
//         private var cachedScoreStr = "00000"
//         private var lastCachedScore = -1

//         private var gameStarted = false
//         private var isGameOver = false
//         private var score = 0
//         private var frameCount = 0
        
//         private var groundY = 0f
//         private var dinoY = 0f
//         private var dinoVelocityY = 0f
        
//         private val gravity = 1.9f 
//         private val jumpStrength = -36f
//         private var isGrounded = true

//         private var baseSpeed = 16f
//         private var currentSpeed = 16f
        
//         // ── PRE-CALCULATED SCREEN DIMENSIONS (CPU Saver) ──
//         private var screenW = 0f
//         private var screenH = 0f
//         private var halfScreenW = 0f
//         private var halfScreenH = 0f

//         override fun onCreate(surfaceHolder: SurfaceHolder?) {
//             super.onCreate(surfaceHolder)
//             setTouchEventsEnabled(true)
//             generateAssets()
//         }

//         private fun generateAssets() {
//             val c = spriteColor
//             dinoIdle = createDinoBitmap(0, c)
//             dinoRun1 = createDinoBitmap(1, c)
//             dinoRun2 = createDinoBitmap(2, c)
            
//             cactusSmall = createCactusBitmap(false, c)
//             cactusLarge = createCactusBitmap(true, c)
            
//             bird1 = createBirdBitmap(true, c)
//             bird2 = createBirdBitmap(false, c)
            
//             cloudBmp = createCloudBitmap(cloudColor)
//         }

//         private fun createDinoBitmap(runState: Int, color: Int): Bitmap {
//             val bitmap = Bitmap.createBitmap(120, 120, Bitmap.Config.ARGB_8888)
//             val canvas = Canvas(bitmap)
//             val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = color }
            
//             canvas.drawRoundRect(RectF(40f, 20f, 85f, 85f), 22f, 22f, paint)
//             canvas.drawRoundRect(RectF(55f, 10f, 110f, 35f), 12f, 12f, paint)
            
//             val tailPath = Path().apply {
//                 moveTo(45f, 75f)
//                 quadTo(5f, 85f, 15f, 40f)
//                 quadTo(30f, 75f, 55f, 85f)
//                 close()
//             }
//             canvas.drawPath(tailPath, paint)
            
//             val legPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
//                 this.color = color
//                 style = Paint.Style.STROKE
//                 strokeWidth = 9f
//                 strokeCap = Paint.Cap.ROUND
//                 strokeJoin = Paint.Join.ROUND
//             }
            
//             if (runState == 0 || runState == 2) {
//                 canvas.drawLine(55f, 80f, 55f, 118f, legPaint)
//             } else {
//                 canvas.drawLine(55f, 80f, 55f, 95f, legPaint)
//                 canvas.drawLine(55f, 95f, 65f, 95f, legPaint)
//             }
//             if (runState == 0 || runState == 1) {
//                 canvas.drawLine(75f, 80f, 75f, 118f, legPaint)
//             } else {
//                 canvas.drawLine(75f, 80f, 75f, 95f, legPaint)
//                 canvas.drawLine(75f, 95f, 85f, 95f, legPaint)
//             }
            
//             val eyePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = bgColor }
//             canvas.drawCircle(85f, 20f, 4f, eyePaint)
            
//             return bitmap
//         }

//         private fun createCactusBitmap(isLarge: Boolean, color: Int): Bitmap {
//             val width = if (isLarge) 80 else 50
//             val height = if (isLarge) 110 else 80
//             val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
//             val canvas = Canvas(bitmap)
//             val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
//                 this.color = color
//                 strokeWidth = 14f
//                 strokeCap = Paint.Cap.ROUND
//                 style = Paint.Style.STROKE
//             }
            
//             val centerX = width / 2f
//             canvas.drawLine(centerX, 15f, centerX, height.toFloat() - 2f, paint)
            
//             if (isLarge) {
//                 val leftPath = Path().apply {
//                     moveTo(centerX, 60f); lineTo(centerX - 25f, 60f); lineTo(centerX - 25f, 30f)
//                 }
//                 canvas.drawPath(leftPath, paint)
//                 val rightPath = Path().apply {
//                     moveTo(centerX, 80f); lineTo(centerX + 25f, 80f); lineTo(centerX + 25f, 45f)
//                 }
//                 canvas.drawPath(rightPath, paint)
//             } else {
//                 val rightPath = Path().apply {
//                     moveTo(centerX, 45f); lineTo(centerX + 15f, 45f); lineTo(centerX + 15f, 25f)
//                 }
//                 canvas.drawPath(rightPath, paint)
//             }
//             return bitmap
//         }

//         private fun createBirdBitmap(wingUp: Boolean, color: Int): Bitmap {
//             val bitmap = Bitmap.createBitmap(100, 80, Bitmap.Config.ARGB_8888)
//             val canvas = Canvas(bitmap)
//             val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
//                 this.color = color
//                 style = Paint.Style.FILL
//             }
            
//             val bodyPath = Path().apply {
//                 moveTo(20f, 40f); lineTo(50f, 32f); lineTo(95f, 40f); lineTo(50f, 48f); close()
//             }
//             canvas.drawPath(bodyPath, paint)
            
//             val wingPath = Path().apply {
//                 moveTo(45f, 40f)
//                 if (wingUp) {
//                     quadTo(60f, 5f, 25f, 5f); quadTo(40f, 20f, 65f, 40f)
//                 } else {
//                     quadTo(60f, 75f, 25f, 75f); quadTo(40f, 60f, 65f, 40f)
//                 }
//                 close()
//             }
//             canvas.drawPath(wingPath, paint)
//             return bitmap
//         }

//         private fun createCloudBitmap(color: Int): Bitmap {
//             val bitmap = Bitmap.createBitmap(150, 60, Bitmap.Config.ARGB_8888)
//             val canvas = Canvas(bitmap)
//             val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = color }
            
//             canvas.drawRoundRect(RectF(10f, 30f, 70f, 55f), 15f, 15f, paint)
//             canvas.drawRoundRect(RectF(40f, 10f, 100f, 55f), 25f, 25f, paint)
//             canvas.drawRoundRect(RectF(80f, 25f, 130f, 55f), 17f, 17f, paint)
//             return bitmap
//         }

//         override fun onTouchEvent(event: MotionEvent) {
//             val action = event.actionMasked
            
//             if (event.pointerCount >= 2 && action == MotionEvent.ACTION_POINTER_DOWN) {
//                 if (!gameStarted || isGameOver) {
//                     resetGame()
//                     gameStarted = true
//                     handler.removeCallbacks(drawRunner)
//                     handler.post(drawRunner) 
//                     return
//                 }
//             }

//             if (action == MotionEvent.ACTION_DOWN && event.pointerCount == 1) {
//                 if (gameStarted && !isGameOver && isGrounded) {
//                     dinoVelocityY = jumpStrength
//                     isGrounded = false
//                 }
//             }
//         }

//         private fun resetGame() {
//             score = 0
//             currentSpeed = baseSpeed
//             isGameOver = false
//             frameCount = 0
//             dinoY = groundY
//             dinoVelocityY = 0f
//             obstacles.clear()
            
//             clouds.clear()
//             clouds.add(Cloud(Random.nextFloat() * screenW, groundY - 300f - Random.nextFloat() * 400f, 1f + Random.nextFloat() * 1.5f))
//         }

//         override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {
//             screenW = width.toFloat()
//             screenH = height.toFloat()
//             halfScreenW = screenW / 2f
//             halfScreenH = screenH / 2f
//             groundY = screenH * 0.75f
//             if (!gameStarted) dinoY = groundY
            
//             // Removed the LinearGradient setup entirely.
            
//             drawFrame() 
//         }

//         private fun spawnObstacle() {
//             val type = if (score > 150 && Random.nextFloat() < 0.35f) 1 else 0 
//             val bitmap = if (type == 1) bird1 else if (Random.nextBoolean()) cactusLarge else cactusSmall
            
//             val yPos = if (type == 1) {
//                 if (Random.nextBoolean()) {
//                     groundY - cactusLarge.height - 35f 
//                 } else {
//                     groundY - 55f 
//                 }
//             } else {
//                 groundY 
//             }
            
//             obstacles.add(Obstacle(screenW + 100f, yPos, bitmap, type))
//         }

//         private fun updateGame() {
//             frameCount++
            
//             if (Random.nextFloat() < 0.003f) {
//                 clouds.add(Cloud(screenW + 100f, groundY - 300f - Random.nextFloat() * 400f, 1f + Random.nextFloat() * 1.5f))
//             }
            
//             for (i in clouds.indices.reversed()) {
//                 val c = clouds[i]
//                 c.x -= c.speed
//                 if (c.x < -300f) clouds.removeAt(i)
//             }

//             if (frameCount % 600 == 0) currentSpeed += 1f

//             dinoY += dinoVelocityY
//             if (dinoY < groundY) {
//                 dinoVelocityY += gravity
//                 isGrounded = false
//             } else {
//                 dinoY = groundY
//                 dinoVelocityY = 0f
//                 isGrounded = true
//             }

//             val minGap = 600f + (currentSpeed * 15f) 
//             val randomGap = Random.nextInt(200, 900).toFloat()
            
//             if (obstacles.isEmpty() || obstacles.last().x < screenW - minGap - randomGap) {
//                 spawnObstacle()
//             }

//             for (i in obstacles.indices.reversed()) {
//                 val obs = obstacles[i]
//                 obs.x -= currentSpeed
                
//                 if (obs.type == 1) {
//                     obs.bitmap = if ((frameCount / 15) % 2 == 0) bird1 else bird2
//                 }

//                 if (obs.x < -200f) {
//                     obstacles.removeAt(i)
//                     score += 10
//                 }
//             }

//             val currentDino = if (!isGrounded) dinoIdle else if ((frameCount / 6) % 2 == 0) dinoRun1 else dinoRun2
            
//             val marginX = 20
//             val marginY = 20
            
//             dinoHitbox.set(
//                 150 + marginX, 
//                 (dinoY - currentDino.height).toInt() + marginY, 
//                 150 + currentDino.width - marginX, 
//                 dinoY.toInt() - marginY
//             )

//             for (i in 0 until obstacles.size) {
//                 val obs = obstacles[i]
//                 obsHitbox.set(
//                     obs.x.toInt() + marginX, 
//                     (obs.y - obs.bitmap.height).toInt() + marginY, 
//                     (obs.x + obs.bitmap.width).toInt() - marginX, 
//                     obs.y.toInt() - marginY
//                 )
//                 if (Rect.intersects(dinoHitbox, obsHitbox)) {
//                     isGameOver = true
//                 }
//             }
//         }

//         private fun drawFrame() {
//             if (!isVisible) return

//             if (gameStarted && !isGameOver) {
//                 updateGame()
//             }

//             val holder = surfaceHolder
//             var canvas: Canvas? = null
//             try {
//                 canvas = holder.lockCanvas()
//                 if (canvas != null) {
//                     // ── ULTRA-FAST BACKGROUND CLEAR ──
//                     canvas.drawColor(bgColor)

//                     for (i in 0 until clouds.size) {
//                         val c = clouds[i]
//                         canvas.drawBitmap(cloudBmp, c.x, c.y, mainPaint)
//                     }

//                     mainPaint.color = groundColor
//                     mainPaint.strokeWidth = 4f
//                     canvas.drawLine(0f, groundY, screenW, groundY, mainPaint)

//                     mainPaint.color = spriteColor

//                     val currentDino = if (!gameStarted) dinoIdle else if (!isGrounded) dinoIdle else if ((frameCount / 6) % 2 == 0) dinoRun1 else dinoRun2
//                     canvas.drawBitmap(currentDino, 150f, dinoY - currentDino.height, mainPaint)

//                     for (i in 0 until obstacles.size) {
//                         val obs = obstacles[i]
//                         canvas.drawBitmap(obs.bitmap, obs.x, obs.y - obs.bitmap.height, mainPaint)
//                     }

//                     if (gameStarted) {
//                         if (score != lastCachedScore) {
//                             cachedScoreStr = score.toString().padStart(5, '0')
//                             lastCachedScore = score
//                         }
                        
//                         uiPaint.textSize = 60f
//                         uiPaint.typeface = Typeface.MONOSPACE
//                         uiPaint.color = uiColor
//                         uiPaint.textAlign = Paint.Align.RIGHT
//                         canvas.drawText(cachedScoreStr, screenW - 100f, 150f, uiPaint)
//                     }

//                     uiPaint.textAlign = Paint.Align.CENTER
//                     if (!gameStarted) {
//                         uiPaint.color = uiColor
//                         uiPaint.textSize = 50f
//                         uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL)
//                         canvas.drawText("TAP WITH TWO FINGERS", halfScreenW, halfScreenH - 30f, uiPaint)
//                         canvas.drawText("TO START", halfScreenW, halfScreenH + 40f, uiPaint)
//                     } else if (isGameOver) {
//                         mainPaint.color = Color.argb(200, 245, 243, 237)
//                         canvas.drawRect(0f, 0f, screenW, screenH, mainPaint)
                        
//                         uiPaint.color = spriteColor
//                         uiPaint.textSize = 80f
//                         uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
//                         canvas.drawText("GAME OVER", halfScreenW, halfScreenH - 50f, uiPaint)
                        
//                         uiPaint.color = uiColor
//                         uiPaint.textSize = 45f
//                         uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL)
//                         canvas.drawText("Two-Finger Tap to Restart", halfScreenW, halfScreenH + 50f, uiPaint)
//                     }
//                 }
//             } finally {
//                 if (canvas != null) holder.unlockCanvasAndPost(canvas)
//             }

//             handler.removeCallbacks(drawRunner)
//             if (isVisible && gameStarted && !isGameOver) {
//                 handler.postDelayed(drawRunner, 16)
//             }
//         }

//         override fun onVisibilityChanged(visible: Boolean) {
//             isVisible = visible
//             if (visible) {
//                 handler.post(drawRunner)
//             } else {
//                 handler.removeCallbacks(drawRunner)
//             }
//         }
//     }
// }


package com.tossstudio.wallpaperengine

import android.graphics.*
import android.os.Handler
import android.os.HandlerThread
import android.service.wallpaper.WallpaperService
import android.view.MotionEvent
import android.view.SurfaceHolder
import kotlin.random.Random

data class Obstacle(var x: Float, var y: Float, var bitmap: Bitmap, val type: Int)
data class Cloud(var x: Float, var y: Float, var speed: Float)

class DinoWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine = DinoEngine()

    inner class DinoEngine : Engine() {
        // ── PERFORMANCE: Move rendering to a background thread to prevent UI lag ──
        private var backgroundThread: HandlerThread? = null
        private var backgroundHandler: Handler? = null
        private val drawRunner = Runnable { drawFrame() }
        
        private var isVisible = false
        
        // ── ZERO-ALLOCATION PAINTS ──
        private val mainPaint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val uiPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { textAlign = Paint.Align.CENTER }
        private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG) // Used for the dark gradient
        
        // ── VIBEY DARK MODE COLORS ──
        // Deep Slate to Black gradient for OLED battery savings
        private val gradientTop = Color.parseColor("#0F172A") 
        private val gradientBottom = Color.parseColor("#020617") 
        private val groundColor = Color.parseColor("#334155")
        private val spriteColor = Color.parseColor("#F8FAFC") // Soft stark white for pop
        private val cloudColor = Color.parseColor("#1E293B")
        private val uiColor = Color.argb(180, 248, 250, 252)

        // Bitmaps
        private lateinit var dinoIdle: Bitmap
        private lateinit var dinoRun1: Bitmap
        private lateinit var dinoRun2: Bitmap
        private lateinit var cactusSmall: Bitmap
        private lateinit var cactusLarge: Bitmap
        private lateinit var bird1: Bitmap
        private lateinit var bird2: Bitmap
        private lateinit var cloudBmp: Bitmap

        private val obstacles = mutableListOf<Obstacle>()
        private val clouds = mutableListOf<Cloud>()

        // ── STRINGS ──
        private var cachedScoreStr = "00000"
        private var lastCachedScore = -1

        private var gameStarted = false
        private var isGameOver = false
        private var score = 0
        private var frameCount = 0
        
        private var groundY = 0f
        private var dinoY = 0f
        private var dinoVelocityY = 0f
        
        private val gravity = 1.9f 
        private val jumpStrength = -36f
        private var isGrounded = true

        private var baseSpeed = 16f
        private var currentSpeed = 16f
        
        // ── PRE-CALCULATED DIMENSIONS ──
        private var screenW = 0f
        private var screenH = 0f
        private var halfScreenW = 0f
        private var halfScreenH = 0f

        override fun onCreate(surfaceHolder: SurfaceHolder?) {
            super.onCreate(surfaceHolder)
            setTouchEventsEnabled(true)
            
            // Start the background thread
            backgroundThread = HandlerThread("DinoRenderThread").apply { start() }
            backgroundHandler = Handler(backgroundThread!!.looper)
            
            generateAssets()
        }

        override fun onDestroy() {
            super.onDestroy()
            backgroundThread?.quitSafely()
        }

        private fun generateAssets() {
            val c = spriteColor
            dinoIdle = createDinoBitmap(0, c)
            dinoRun1 = createDinoBitmap(1, c)
            dinoRun2 = createDinoBitmap(2, c)
            
            cactusSmall = createCactusBitmap(false, c)
            cactusLarge = createCactusBitmap(true, c)
            
            bird1 = createBirdBitmap(true, c)
            bird2 = createBirdBitmap(false, c)
            
            cloudBmp = createCloudBitmap(cloudColor)
        }

        private fun createDinoBitmap(runState: Int, color: Int): Bitmap {
            val bitmap = Bitmap.createBitmap(120, 120, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = color }
            
            canvas.drawRoundRect(RectF(40f, 20f, 85f, 85f), 22f, 22f, paint)
            canvas.drawRoundRect(RectF(55f, 10f, 110f, 35f), 12f, 12f, paint)
            
            val tailPath = Path().apply {
                moveTo(45f, 75f)
                quadTo(5f, 85f, 15f, 40f)
                quadTo(30f, 75f, 55f, 85f)
                close()
            }
            canvas.drawPath(tailPath, paint)
            
            val legPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
                this.color = color
                style = Paint.Style.STROKE
                strokeWidth = 9f
                strokeCap = Paint.Cap.ROUND
                strokeJoin = Paint.Join.ROUND
            }
            
            if (runState == 0 || runState == 2) {
                canvas.drawLine(55f, 80f, 55f, 118f, legPaint)
            } else {
                canvas.drawLine(55f, 80f, 55f, 95f, legPaint)
                canvas.drawLine(55f, 95f, 65f, 95f, legPaint)
            }
            if (runState == 0 || runState == 1) {
                canvas.drawLine(75f, 80f, 75f, 118f, legPaint)
            } else {
                canvas.drawLine(75f, 80f, 75f, 95f, legPaint)
                canvas.drawLine(75f, 95f, 85f, 95f, legPaint)
            }
            
            // Eye is "transparent" by drawing the dark background color over it
            val eyePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = gradientTop }
            canvas.drawCircle(85f, 20f, 4f, eyePaint)
            
            return bitmap
        }

        private fun createCactusBitmap(isLarge: Boolean, color: Int): Bitmap {
            val width = if (isLarge) 80 else 50
            val height = if (isLarge) 110 else 80
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
                this.color = color
                strokeWidth = 14f
                strokeCap = Paint.Cap.ROUND
                style = Paint.Style.STROKE
            }
            
            val centerX = width / 2f
            canvas.drawLine(centerX, 15f, centerX, height.toFloat() - 2f, paint)
            
            if (isLarge) {
                val leftPath = Path().apply {
                    moveTo(centerX, 60f); lineTo(centerX - 25f, 60f); lineTo(centerX - 25f, 30f)
                }
                canvas.drawPath(leftPath, paint)
                val rightPath = Path().apply {
                    moveTo(centerX, 80f); lineTo(centerX + 25f, 80f); lineTo(centerX + 25f, 45f)
                }
                canvas.drawPath(rightPath, paint)
            } else {
                val rightPath = Path().apply {
                    moveTo(centerX, 45f); lineTo(centerX + 15f, 45f); lineTo(centerX + 15f, 25f)
                }
                canvas.drawPath(rightPath, paint)
            }
            return bitmap
        }

        private fun createBirdBitmap(wingUp: Boolean, color: Int): Bitmap {
            val bitmap = Bitmap.createBitmap(100, 80, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { 
                this.color = color
                style = Paint.Style.FILL
            }
            
            val bodyPath = Path().apply {
                moveTo(20f, 40f); lineTo(50f, 32f); lineTo(95f, 40f); lineTo(50f, 48f); close()
            }
            canvas.drawPath(bodyPath, paint)
            
            val wingPath = Path().apply {
                moveTo(45f, 40f)
                if (wingUp) {
                    quadTo(60f, 5f, 25f, 5f); quadTo(40f, 20f, 65f, 40f)
                } else {
                    quadTo(60f, 75f, 25f, 75f); quadTo(40f, 60f, 65f, 40f)
                }
                close()
            }
            canvas.drawPath(wingPath, paint)
            return bitmap
        }

        private fun createCloudBitmap(color: Int): Bitmap {
            val bitmap = Bitmap.createBitmap(150, 60, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bitmap)
            val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { this.color = color }
            
            canvas.drawRoundRect(RectF(10f, 30f, 70f, 55f), 15f, 15f, paint)
            canvas.drawRoundRect(RectF(40f, 10f, 100f, 55f), 25f, 25f, paint)
            canvas.drawRoundRect(RectF(80f, 25f, 130f, 55f), 17f, 17f, paint)
            return bitmap
        }

        override fun onTouchEvent(event: MotionEvent) {
            val action = event.actionMasked
            
            if (event.pointerCount >= 2 && action == MotionEvent.ACTION_POINTER_DOWN) {
                if (!gameStarted || isGameOver) {
                    resetGame()
                    gameStarted = true
                    backgroundHandler?.removeCallbacks(drawRunner)
                    backgroundHandler?.post(drawRunner) 
                    return
                }
            }

            if (action == MotionEvent.ACTION_DOWN && event.pointerCount == 1) {
                if (gameStarted && !isGameOver && isGrounded) {
                    dinoVelocityY = jumpStrength
                    isGrounded = false
                }
            }
        }

        private fun resetGame() {
            score = 0
            currentSpeed = baseSpeed
            isGameOver = false
            frameCount = 0
            dinoY = groundY
            dinoVelocityY = 0f
            obstacles.clear()
            
            clouds.clear()
            clouds.add(Cloud(Random.nextFloat() * screenW, groundY - 300f - Random.nextFloat() * 400f, 1f + Random.nextFloat() * 1.5f))
        }

        override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {
            screenW = width.toFloat()
            screenH = height.toFloat()
            halfScreenW = screenW / 2f
            halfScreenH = screenH / 2f
            groundY = screenH * 0.75f
            if (!gameStarted) dinoY = groundY
            
            // Re-create the gradient shader to match the new screen height
            bgPaint.shader = LinearGradient(
                0f, 0f, 0f, screenH,
                gradientTop, gradientBottom,
                Shader.TileMode.CLAMP
            )
            
            // Draw one frame to ensure the screen isn't blank
            backgroundHandler?.post(drawRunner) 
        }

        private fun spawnObstacle() {
            val type = if (score > 150 && Random.nextFloat() < 0.35f) 1 else 0 
            val bitmap = if (type == 1) bird1 else if (Random.nextBoolean()) cactusLarge else cactusSmall
            
            val yPos = if (type == 1) {
                if (Random.nextBoolean()) {
                    groundY - cactusLarge.height - 35f 
                } else {
                    groundY - 55f 
                }
            } else {
                groundY 
            }
            
            obstacles.add(Obstacle(screenW + 100f, yPos, bitmap, type))
        }

        private fun updateGame() {
            frameCount++
            
            if (Random.nextFloat() < 0.003f) {
                clouds.add(Cloud(screenW + 100f, groundY - 300f - Random.nextFloat() * 400f, 1f + Random.nextFloat() * 1.5f))
            }
            
            for (i in clouds.indices.reversed()) {
                val c = clouds[i]
                c.x -= c.speed
                if (c.x < -300f) clouds.removeAt(i)
            }

            if (frameCount % 600 == 0) currentSpeed += 1f

            dinoY += dinoVelocityY
            if (dinoY < groundY) {
                dinoVelocityY += gravity
                isGrounded = false
            } else {
                dinoY = groundY
                dinoVelocityY = 0f
                isGrounded = true
            }

            val minGap = 600f + (currentSpeed * 15f) 
            val randomGap = Random.nextInt(200, 900).toFloat()
            
            if (obstacles.isEmpty() || obstacles.last().x < screenW - minGap - randomGap) {
                spawnObstacle()
            }

            val currentDino = if (!isGrounded) dinoIdle else if ((frameCount / 6) % 2 == 0) dinoRun1 else dinoRun2
            val marginX = 20f
            val marginY = 20f

            // ── PERFORMANCE: AABB Float Math instead of Object creation/intersection ──
            val dinoLeft = 150f + marginX
            val dinoRight = 150f + currentDino.width - marginX
            val dinoTop = dinoY - currentDino.height + marginY
            val dinoBottom = dinoY - marginY

            for (i in obstacles.indices.reversed()) {
                val obs = obstacles[i]
                obs.x -= currentSpeed
                
                if (obs.type == 1) {
                    obs.bitmap = if ((frameCount / 15) % 2 == 0) bird1 else bird2
                }

                if (obs.x < -200f) {
                    obstacles.removeAt(i)
                    score += 10
                    continue // Skip collision check if it's off screen
                }

                // AABB Collision Detection (Blazing Fast)
                val obsLeft = obs.x + marginX
                val obsRight = obs.x + obs.bitmap.width - marginX
                val obsTop = obs.y - obs.bitmap.height + marginY
                val obsBottom = obs.y - marginY

                if (dinoLeft < obsRight && dinoRight > obsLeft && dinoTop < obsBottom && dinoBottom > obsTop) {
                    isGameOver = true
                }
            }
        }

        private fun drawFrame() {
            if (!isVisible) return

            if (gameStarted && !isGameOver) {
                updateGame()
            }

            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    // ── BACKGROUND DRAW (Dark Gradient) ──
                    canvas.drawRect(0f, 0f, screenW, screenH, bgPaint)

                    for (i in 0 until clouds.size) {
                        val c = clouds[i]
                        canvas.drawBitmap(cloudBmp, c.x, c.y, mainPaint)
                    }

                    mainPaint.color = groundColor
                    mainPaint.strokeWidth = 6f
                    canvas.drawLine(0f, groundY, screenW, groundY, mainPaint)

                    mainPaint.color = spriteColor

                    val currentDino = if (!gameStarted) dinoIdle else if (!isGrounded) dinoIdle else if ((frameCount / 6) % 2 == 0) dinoRun1 else dinoRun2
                    canvas.drawBitmap(currentDino, 150f, dinoY - currentDino.height, mainPaint)

                    for (i in 0 until obstacles.size) {
                        val obs = obstacles[i]
                        canvas.drawBitmap(obs.bitmap, obs.x, obs.y - obs.bitmap.height, mainPaint)
                    }

                    if (gameStarted) {
                        if (score != lastCachedScore) {
                            cachedScoreStr = score.toString().padStart(5, '0')
                            lastCachedScore = score
                        }
                        
                        uiPaint.textSize = 60f
                        uiPaint.typeface = Typeface.MONOSPACE
                        uiPaint.color = uiColor
                        uiPaint.textAlign = Paint.Align.RIGHT
                        canvas.drawText(cachedScoreStr, screenW - 100f, 150f, uiPaint)
                    }

                    uiPaint.textAlign = Paint.Align.CENTER
                    if (!gameStarted) {
                        uiPaint.color = uiColor
                        uiPaint.textSize = 50f
                        uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL)
                        canvas.drawText("TAP WITH TWO FINGERS", halfScreenW, halfScreenH - 30f, uiPaint)
                        canvas.drawText("TO START", halfScreenW, halfScreenH + 40f, uiPaint)
                    } else if (isGameOver) {
                        // Soft dimming overlay
                        mainPaint.color = Color.argb(120, 2, 6, 23)
                        canvas.drawRect(0f, 0f, screenW, screenH, mainPaint)
                        
                        uiPaint.color = spriteColor
                        uiPaint.textSize = 80f
                        uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.BOLD)
                        canvas.drawText("GAME OVER", halfScreenW, halfScreenH - 50f, uiPaint)
                        
                        uiPaint.color = uiColor
                        uiPaint.textSize = 45f
                        uiPaint.typeface = Typeface.create(Typeface.SANS_SERIF, Typeface.NORMAL)
                        canvas.drawText("Two-Finger Tap to Restart", halfScreenW, halfScreenH + 50f, uiPaint)
                    }
                }
            } finally {
                if (canvas != null) holder.unlockCanvasAndPost(canvas)
            }

            backgroundHandler?.removeCallbacks(drawRunner)
            
            // ── BATTERY EFFICIENT LOOP ──
            // Only continuously loop if visible and the game is actively playing
            if (isVisible && gameStarted && !isGameOver) {
                backgroundHandler?.postDelayed(drawRunner, 16)
            }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            isVisible = visible
            if (visible) {
                // Post exactly once so the user doesn't stare at a blank screen 
                // when unlocking the phone, but don't start the 60fps loop
                backgroundHandler?.post(drawRunner)
            } else {
                backgroundHandler?.removeCallbacks(drawRunner)
            }
        }
    }
}