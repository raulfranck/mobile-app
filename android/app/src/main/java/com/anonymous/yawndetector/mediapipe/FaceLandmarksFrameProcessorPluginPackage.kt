package com.anonymous.yawndetector.mediapipe

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry
import android.util.Log

class FaceLandmarksFrameProcessorPluginPackage : ReactPackage {
  companion object {
    init {
      try {
        FrameProcessorPluginRegistry.addFrameProcessorPlugin("faceLandmarks") { proxy, options ->
          FaceLandmarksFrameProcessorPlugin(proxy, options)
        }
        Log.d("MediaPipe", "Registered VisionCamera FrameProcessor plugin: faceLandmarks")
      } catch (t: Throwable) {
        Log.e("MediaPipe", "Failed to register FrameProcessor plugin", t)
      }
    }
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = emptyList()
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}

