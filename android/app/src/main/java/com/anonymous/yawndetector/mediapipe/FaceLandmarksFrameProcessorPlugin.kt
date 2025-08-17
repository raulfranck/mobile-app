package com.anonymous.yawndetector.mediapipe

import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarkerResult
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class FaceLandmarksFrameProcessorPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {
  override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
    val landmarker = FaceLandmarkerHolder.faceLandmarker ?: return null
    return try {
      val bitmap = frame.imageProxy?.toBitmap() ?: return null
      val mpImage: MPImage = BitmapImageBuilder(bitmap).build()
      val timestamp = frame.timestamp ?: System.currentTimeMillis()
      val result: FaceLandmarkerResult = landmarker.detectForVideo(mpImage, timestamp)

      if (result.faceLandmarks().isEmpty()) return null

      val first = result.faceLandmarks()[0]
      val points = first.map { lm -> mapOf("x" to lm.x(), "y" to lm.y(), "z" to lm.z()) }
      listOf(points)
    } catch (_: Exception) {
      null
    }
  }
}

