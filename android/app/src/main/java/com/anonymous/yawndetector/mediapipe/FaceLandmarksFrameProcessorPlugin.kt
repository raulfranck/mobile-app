package com.anonymous.yawndetector.mediapipe

import android.graphics.Bitmap
import android.graphics.Matrix
import android.util.Log
import android.os.SystemClock
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class FaceLandmarksFrameProcessorPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {
  override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
    val landmarker = FaceLandmarkerHolder.faceLandmarker ?: run {
      Log.w("MediaPipe", "FaceLandmarker not initialized in plugin callback")
      return null
    }
    return try {
      val imageProxy = frame.imageProxy ?: return null
      val rotationDegrees = imageProxy.imageInfo?.rotationDegrees ?: 0

      // Converter para Bitmap e aplicar rotação para máxima compatibilidade
      val srcBitmap: Bitmap = imageProxy.toBitmap() ?: return null
      val matrix = Matrix().apply { if (rotationDegrees != 0) postRotate(rotationDegrees.toFloat()) }
      val rotatedBitmap = Bitmap.createBitmap(srcBitmap, 0, 0, srcBitmap.width, srcBitmap.height, matrix, true)
      val mpImage: MPImage = BitmapImageBuilder(rotatedBitmap).build()

      // Em RunningMode.VIDEO devemos chamar detectForVideo com um timestamp crescente (ms)
      val ts = SystemClock.uptimeMillis()
      val result: FaceLandmarkerResult = landmarker.detectForVideo(mpImage, ts)
      val faces = result.faceLandmarks().size
      Log.d("MediaPipe", "detect(Bitmap) rotation=$rotationDegrees faces=$faces")

      if (faces == 0) return emptyList<List<Map<String, Double>>>()

      val first = result.faceLandmarks()[0]
      val points = first.map { lm ->
        mapOf(
          "x" to lm.x().toDouble(),
          "y" to lm.y().toDouble(),
          "z" to lm.z().toDouble(),
        )
      }
      listOf(points)
    } catch (t: Throwable) {
      Log.e("MediaPipe", "FrameProcessor error", t)
      null
    }
  }
}

