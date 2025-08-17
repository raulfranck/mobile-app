package com.anonymous.yawndetector.mediapipe

import android.content.Context
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker

object FaceLandmarkerHolder {
  @Volatile
  var faceLandmarker: FaceLandmarker? = null
    private set

  @JvmStatic
  fun initialize(context: Context, modelPathInAssets: String = "face_landmarker.task", maxFaces: Int = 1) {
    if (faceLandmarker != null) return
    val base = BaseOptions.builder()
      .setModelAssetPath(modelPathInAssets)
      .build()

    val options = FaceLandmarker.FaceLandmarkerOptions.builder()
      .setBaseOptions(base)
      .setRunningMode(RunningMode.VIDEO)
      .setMinFaceDetectionConfidence(0.3f)
      .setMinFacePresenceConfidence(0.3f)
      .setMinTrackingConfidence(0.3f)
      .setNumFaces(maxFaces)
      .build()

    faceLandmarker = FaceLandmarker.createFromOptions(context, options)
  }

  @JvmStatic
  fun clear() {
    faceLandmarker?.close()
    faceLandmarker = null
  }
}

