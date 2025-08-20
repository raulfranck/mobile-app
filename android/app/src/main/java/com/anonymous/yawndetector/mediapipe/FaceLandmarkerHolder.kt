package com.anonymous.yawndetector.mediapipe

import android.content.Context
import android.util.Log
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.facelandmarker.FaceLandmarker

object FaceLandmarkerHolder {
  @Volatile
  var faceLandmarker: FaceLandmarker? = null
    private set

  @JvmStatic
  fun initialize(context: Context, modelPathInAssets: String = "face_landmarker.task", maxFaces: Int = 1) {
    if (faceLandmarker != null) {
      Log.d("MediaPipe", "FaceLandmarker already initialized")
      return
    }
    try {
      Log.d("MediaPipe", "Initializing FaceLandmarker with model: $modelPathInAssets (maxFaces=$maxFaces)")
      val base = BaseOptions.builder()
        .setModelAssetPath(modelPathInAssets)
        .build()

      val options = FaceLandmarker.FaceLandmarkerOptions.builder()
        .setBaseOptions(base)
        .setRunningMode(RunningMode.VIDEO)
        .setMinFaceDetectionConfidence(0.2f)
        .setMinFacePresenceConfidence(0.2f)
        .setMinTrackingConfidence(0.2f)
        .setNumFaces(maxFaces)
        .build()

      faceLandmarker = FaceLandmarker.createFromOptions(context, options)
      Log.d("MediaPipe", "FaceLandmarker initialized: ${faceLandmarker != null}")
    } catch (t: Throwable) {
      Log.e("MediaPipe", "Failed to initialize FaceLandmarker. Ensure android/app/src/main/assets/$modelPathInAssets exists.", t)
      faceLandmarker = null
    }
  }

  @JvmStatic
  fun clear() {
    faceLandmarker?.close()
    faceLandmarker = null
  }
}

