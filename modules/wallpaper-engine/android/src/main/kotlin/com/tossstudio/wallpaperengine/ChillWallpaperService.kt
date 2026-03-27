package com.tossstudio.wallpaperengine

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Shader
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import java.util.Calendar

class ChillBackgroundView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    private var frameTime = 0f 
    private var screenW = 0f
    private var screenH = 0f
    private var isInitialized = false

    // ── PROPS CONTROLLED BY REACT NATIVE ──
    var manualTime: Float = 12f
    var isLiveTime: Boolean = true
    var weatherOverride: String = "clear"

    // ── Paints ──
    private val sunPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.parseColor("#FFD700"); setShadowLayer(50f, 0f, 0f, Color.parseColor("#FFA500")) }
    private val moonPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.parseColor("#F4F6F0"); setShadowLayer(30f, 0f, 0f, Color.parseColor("#FFFFFF")) }

    private val hillPaintBack = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val hillPaintMid = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val hillPaintFront = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    
    private val shadowPaintBack = Paint(Paint.ANTI_ALIAS_FLAG)
    private val shadowPaintMid = Paint(Paint.ANTI_ALIAS_FLAG)
    private val shadowPaintFront = Paint(Paint.ANTI_ALIAS_FLAG)
    
    private val deepFogPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val shallowFogPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    
    private val hillEdgeMid = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; color = Color.argb(51, 255, 255, 255) }
    private val hillEdgeFront = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; color = Color.argb(76, 255, 255, 255) }

    private val waterPaintShallow = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val waterPaintDeep = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.FILL }
    private val waterShadowPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val waterCrestPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeWidth = 3f; color = Color.argb(100, 255, 255, 255) }

    init {
        // CRITICAL: Tells Android this ViewGroup actually draws things
        setWillNotDraw(false) 
    }

    private fun interpolate(value: Float, inputMin: Float, inputMax: Float, outputMin: Float, outputMax: Float): Float {
        if (value <= inputMin) return outputMin
        if (value >= inputMax) return outputMax
        return outputMin + (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin)
    }

    private fun createWavePath(width: Float, height: Float, startY: Float, amplitude: Float, frequency: Float, phase: Float, offsetX: Float): Path {
        val path = Path()
        path.moveTo(0f, height)
        path.lineTo(0f, startY)
        var x = 0f
        while (x <= width + 15f) {
            val simulatedX = x + offsetX
            val angle = (simulatedX / width).toDouble() * 2.0 * Math.PI * frequency.toDouble() + phase.toDouble()
            val y = startY + (Math.sin(angle) * amplitude.toDouble()).toFloat()
            path.lineTo(x, y)
            x += 15f 
        }
        path.lineTo(width, height)
        path.close()
        return path
    }

    private fun setupGradients(width: Float, height: Float, density: Float) {
        val landscapeH = height * 0.35f
        val landscapeTop = (height * 0.82f) - landscapeH
        val waterHorizon = height * 0.90f

        hillEdgeMid.strokeWidth = 1f * density
        hillEdgeFront.strokeWidth = 1.5f * density

        shadowPaintBack.shader = LinearGradient(0f, landscapeTop + (15f * (landscapeH/100f)), 0f, landscapeTop + landscapeH, intArrayOf(Color.argb(51, 255,255,255), Color.argb(25, 0,0,0)), floatArrayOf(0f, 1f), Shader.TileMode.CLAMP)
        shadowPaintMid.shader = LinearGradient(0f, landscapeTop + (30f * (landscapeH/100f)), 0f, landscapeTop + landscapeH, intArrayOf(Color.argb(25, 255,255,255), Color.argb(76, 0,0,0)), floatArrayOf(0f, 1f), Shader.TileMode.CLAMP)
        shadowPaintFront.shader = LinearGradient(0f, landscapeTop + (70f * (landscapeH/100f)), 0f, landscapeTop + landscapeH, intArrayOf(Color.TRANSPARENT, Color.argb(153, 0,0,0)), floatArrayOf(0f, 1f), Shader.TileMode.CLAMP)

        val fogColor = Color.parseColor("#e2e8f0")
        deepFogPaint.shader = LinearGradient(0f, landscapeTop, 0f, landscapeTop + landscapeH, intArrayOf(Color.TRANSPARENT, fogColor), floatArrayOf(0.3f, 1f), Shader.TileMode.CLAMP)
        shallowFogPaint.shader = LinearGradient(0f, landscapeTop, 0f, landscapeTop + landscapeH, intArrayOf(Color.TRANSPARENT, fogColor), floatArrayOf(0.6f, 1f), Shader.TileMode.CLAMP)

        waterShadowPaint.shader = LinearGradient(0f, waterHorizon, 0f, height, intArrayOf(Color.TRANSPARENT, Color.argb(51, 0,0,0), Color.argb(178, 0,0,0)), floatArrayOf(0f, 0.4f, 1f), Shader.TileMode.CLAMP)
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        
        val w = width.toFloat()
        val h = height.toFloat()
        if (w == 0f || h == 0f) return

        val density = context.resources.displayMetrics.density

        if (!isInitialized || screenW != w || screenH != h) {
            screenW = w; screenH = h
            setupGradients(w, h, density)
            isInitialized = true
        }

        // ── Use the Props sent from React Native! ──
        val time: Float = if (isLiveTime) {
            val calendar = Calendar.getInstance()
            calendar.get(Calendar.HOUR_OF_DAY).toFloat() + (calendar.get(Calendar.MINUTE).toFloat() / 60f)
        } else manualTime

        val isNight = time < 6f || time > 18f

        // 1. Colors
        canvas.drawColor(if (isNight) Color.parseColor("#020818") else Color.parseColor("#87CEEB"))
        hillPaintBack.color = if (isNight) Color.parseColor("#1B2735") else Color.parseColor("#5a7e3a")
        hillPaintMid.color = if (isNight) Color.parseColor("#0e141a") else Color.parseColor("#3e4b25")
        hillPaintFront.color = if (isNight) Color.parseColor("#061009") else Color.parseColor("#2d5a27")
        waterPaintShallow.color = if (isNight) Color.parseColor("#1a252f") else Color.parseColor("#75bec3")
        waterPaintDeep.color = if (isNight) Color.parseColor("#0B1026") else Color.parseColor("#1f71d5")

        val landscapeH = h * 0.35f
        val topY = (h * 0.82f) - landscapeH
        val scaleX = w / 100f
        val scaleY = landscapeH / 100f

        // --- LAYER 1: BACK HILL ---
        val backPath = Path().apply {
            moveTo(0f, topY + 50f * scaleY)
            quadTo(30f * scaleX, topY + 15f * scaleY, 100f * scaleX, topY + 60f * scaleY)
            lineTo(100f * scaleX, topY + 100f * scaleY)
            lineTo(0f, topY + 100f * scaleY)
            close()
        }
        canvas.drawPath(backPath, hillPaintBack); canvas.drawPath(backPath, shadowPaintBack)

        // --- LAYER 2: DEEP FOG ---
        deepFogPaint.alpha = (255 * 0.85f).toInt()
        canvas.drawRect(0f, topY, w, topY + landscapeH, deepFogPaint)

        // --- LAYER 3: MID HILL ---
        val midOffset = 10f * density
        val midPath = Path().apply {
            moveTo(-10f * scaleX, topY + midOffset + 75f * scaleY)
            quadTo(40f * scaleX, topY + midOffset + 30f * scaleY, 110f * scaleX, topY + midOffset + 80f * scaleY)
            lineTo(110f * scaleX, topY + midOffset + 100f * scaleY)
            lineTo(-10f * scaleX, topY + midOffset + 100f * scaleY)
            close()
        }
        canvas.drawPath(midPath, hillPaintMid); canvas.drawPath(midPath, shadowPaintMid); canvas.drawPath(midPath, hillEdgeMid)

        // --- LAYER 4: SHALLOW FOG ---
        shallowFogPaint.alpha = (255 * 0.45f).toInt()
        canvas.drawRect(0f, topY + (15f * density), w, topY + landscapeH + (15f * density), shallowFogPaint)

        // --- LAYER 5: FRONT HILL ---
        val frontOffset = 20f * density
        val frontPath = Path().apply {
            moveTo(0f, topY + frontOffset + 90f * scaleY)
            quadTo(35f * scaleX, topY + frontOffset + 70f * scaleY, 70f * scaleX, topY + frontOffset + 85f * scaleY)
            quadTo(105f * scaleX, topY + frontOffset + 100f * scaleY, 110f * scaleX, topY + frontOffset + 95f * scaleY)
            lineTo(110f * scaleX, topY + frontOffset + 100f * scaleY)
            lineTo(0f, topY + frontOffset + 100f * scaleY)
            close()
        }
        canvas.drawPath(frontPath, hillPaintFront); canvas.drawPath(frontPath, shadowPaintFront); canvas.drawPath(frontPath, hillEdgeFront)

        // --- WATER ---
        val waterHorizon = h * 0.90f
        val wave1 = createWavePath(w, h, waterHorizon, 12f, 2f, 0f, frameTime * 150f)
        canvas.drawPath(wave1, waterPaintDeep); canvas.drawPath(wave1, waterShadowPaint)

        val wave2 = createWavePath(w, h, waterHorizon + (20f * density), 20f, 3f, Math.PI.toFloat(), frameTime * 250f)
        canvas.drawPath(wave2, waterPaintShallow); canvas.drawPath(wave2, waterShadowPaint)

        val wave3 = createWavePath(w, h, waterHorizon + (40f * density), 30f, 4f, (Math.PI / 2.0).toFloat(), frameTime * 400f)
        canvas.drawPath(wave3, waterPaintDeep); canvas.drawPath(wave3, waterShadowPaint); canvas.drawPath(wave3, waterCrestPaint)

        // --- CELESTIAL ---
        if (time in 5.5f..18.5f) {
            val progress = interpolate(time, 6f, 18f, 0f, 1f)
            val cx = interpolate(progress, 0f, 1f, -20f, w - 80f)
            val cy = interpolate(Math.sin(progress.toDouble() * Math.PI).toFloat(), 0f, 1f, h * 0.45f, h * 0.1f)
            val scale = interpolate(Math.abs(progress - 0.5f), 0f, 0.5f, 0.55f, 0.95f)
            canvas.save(); canvas.translate(cx, cy); canvas.scale(scale, scale); canvas.drawCircle(0f, 0f, 100f, sunPaint); canvas.restore()
        }

        if (time >= 17.5f || time <= 6.5f) {
            val progress = if (time >= 18f) interpolate(time, 18f, 24f, 0f, 0.5f) else interpolate(time, 0f, 6f, 0.5f, 1f)
            val cx = interpolate(progress, 0f, 1f, -20f, w - 80f)
            val cy = interpolate(Math.sin(progress.toDouble() * Math.PI).toFloat(), 0f, 1f, h * 0.45f, h * 0.1f)
            canvas.save(); canvas.translate(cx, cy); canvas.scale(0.8f, 0.8f); canvas.drawCircle(0f, 0f, 80f, moonPaint); canvas.restore()
        }

        frameTime += 0.016f
        invalidate() // CRITICAL: This creates the 60fps render loop!
    }
}