package io.aelf.portkey.native_modules

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import io.aelf.portkey.activities.navigateToAnotherReactActivity
import io.aelf.portkey.navigation.NavigationHolder
import io.aelf.portkey.tools.generateUniqueCallbackID

class RouterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RouterModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateTo(entry: String, from: String, targetScene: String? = null) {
        val activity = NavigationHolder.getTopComponent()
        activity?.navigateToAnotherReactActivity(
            entryName = entry,
            targetScene = targetScene,
            from = from
        )
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateToWithOptions(
        targetEntry: String,
        from: String,
        params: ReadableMap,
        callback: Callback
    ) {
        val activity = NavigationHolder.getTopComponent()
        val targetScene = params.getString("targetScene")
        val callbackId = generateUniqueCallbackID()
        activity?.navigateToAnotherReactActivity(
            entryName = targetEntry,
            params = params.getMap("params"),
            targetScene = targetScene,
            callbackId = callbackId,
            from = from
        )
        NavigationHolder.registerNavigationCallback(callbackId, callback)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateBack(result: ReadableMap) {
        val activity = NavigationHolder.getTopComponent()
        activity?.navigateBackWithResult(result)
    }
}
