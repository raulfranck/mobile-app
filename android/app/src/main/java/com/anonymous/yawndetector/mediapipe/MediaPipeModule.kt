package com.anonymous.yawndetector.mediapipe

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.SurfaceTexture
import android.util.Log
import android.view.TextureView
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage

class MediaPipeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MediaPipeModule"
    }

    @ReactMethod
    fun captureAndDetect(promise: Promise) {
        try {
            val landmarker = FaceLandmarkerHolder.faceLandmarker
            if (landmarker == null) {
                Log.w("MediaPipeModule", "FaceLandmarker not initialized")
                promise.resolve(null)
                return
            }

            // Criar bitmap de teste 640x480 com cor sólida para teste
            val testBitmap = Bitmap.createBitmap(640, 480, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(testBitmap)
            canvas.drawColor(android.graphics.Color.GRAY)
            
            val mpImage: MPImage = BitmapImageBuilder(testBitmap).build()
            val result = landmarker.detect(mpImage)
            
            Log.d("MediaPipeModule", "Direct detection - faces: ${result.faceLandmarks().size}")
            
            if (result.faceLandmarks().isEmpty()) {
                promise.resolve(null)
                return
            }

            val landmarks = result.faceLandmarks()[0]
            val landmarksArray: WritableArray = WritableNativeArray()
            
            for (landmark in landmarks) {
                val point: WritableMap = WritableNativeMap()
                point.putDouble("x", landmark.x().toDouble())
                point.putDouble("y", landmark.y().toDouble())
                point.putDouble("z", landmark.z().toDouble())
                landmarksArray.pushMap(point)
            }

            val resultMap: WritableMap = WritableNativeMap()
            resultMap.putArray("landmarks", landmarksArray)
            resultMap.putDouble("confidence", 1.0)
            
            promise.resolve(resultMap)
            
        } catch (e: Exception) {
            Log.e("MediaPipeModule", "Error in captureAndDetect", e)
            promise.reject("DETECTION_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun testFaceLandmarker(promise: Promise) {
        try {
            val landmarker = FaceLandmarkerHolder.faceLandmarker
            if (landmarker == null) {
                promise.resolve("FaceLandmarker not initialized")
                return
            }
            
            promise.resolve("FaceLandmarker available")
        } catch (e: Exception) {
            promise.reject("TEST_ERROR", e.message, e)
        }
    }
}