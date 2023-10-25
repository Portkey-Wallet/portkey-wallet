package io.aelf.portkey.native_modules

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import io.aelf.portkey.components.activities.navigateToAnotherReactActivity
import io.aelf.portkey.navigation.NavigationHolder
import io.aelf.portkey.tools.generateUniqueCallbackID

class RouterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RouterModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateTo(
        entry: String,
        from: String,
        targetScene: String = "",
        closeSelf: Boolean = false,
        params: ReadableMap = Arguments.createMap()
    ) {
        val activity = NavigationHolder.getTopComponent()
        activity?.navigateToAnotherReactActivity(
            entryName = entry,
            targetScene = targetScene,
            from = from,
            closeSelf = closeSelf,
            params = params
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
        val closeSelf = params.getBoolean("closeCurrentScreen")
//        val navigationAnimation = params.getString("navigationAnimation")
//        val navigationAnimationDuration: Long =
//            params.getDouble("navigationAnimationDuration").toLong()
        val callbackId = generateUniqueCallbackID()
        activity?.navigateToAnotherReactActivity(
            entryName = targetEntry,
            params = params.getMap("params"),
            targetScene = targetScene,
            callbackId = callbackId,
            from = from,
            closeSelf = closeSelf
        )
        NavigationHolder.registerNavigationCallback(callbackId, callback)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateBack(result: ReadableMap) {
        val activity = NavigationHolder.getTopComponent()
        activity?.navigateBackWithResult(result)
    }
}
