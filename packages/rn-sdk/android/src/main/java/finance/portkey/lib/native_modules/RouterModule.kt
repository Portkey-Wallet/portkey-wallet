package finance.portkey.lib.native_modules

import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import finance.portkey.lib.components.activities.navigateToAnotherReactActivity
import finance.portkey.lib.components.activities.toBundle
import finance.portkey.lib.config.StorageIdentifiers
import finance.portkey.lib.navigation.NavigationHolder
import finance.portkey.lib.tools.generateUniqueID

class RouterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RouterModule"
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateTo(
        targetEntry: String,
        launchMode: String,
        from: String,
        targetScene: String = "",
        closeCurrentScreen: Boolean = false,
        params: ReadableMap = Arguments.createMap()
    ) {
        val activity = NavigationHolder.getTopComponent()
        if(closeCurrentScreen) {
            NavigationHolder.popAndFinish(activity)
        }
        val bundle = params.toBundle()
        if(startLaunchModeActivity(launchMode, targetEntry, bundle)){
            return
        }

        currentActivity?.navigateToAnotherReactActivity(
            entryName = targetEntry,
            targetScene = targetScene,
            from = from,
            params = params
        )
    }

    private fun startLaunchModeActivity(launchMode: String, targetEntry: String, bundle: Bundle): Boolean {
        if((launchMode == "single_task" || launchMode == "single_top")&& NavigationHolder.hasEntry(targetEntry)){
            // 1. mode match, 2.task stack has entry instance
            return if(launchMode == "single_task"){
                NavigationHolder.singleTaskOp(targetEntry, bundle)
            } else{
                NavigationHolder.singleTopOp(targetEntry, bundle)
            }
        }
        return false
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateToWithOptions(
        targetEntry: String,
        launchMode: String,
        from: String,
        params: ReadableMap,
        callback: Callback
    ) {
        val activity = NavigationHolder.getTopComponent()
        val targetScene = params.getString("targetScene")
        val closeSelf = if(params.hasKey("closeCurrentScreen")) params.getBoolean("closeCurrentScreen") else false
        val callbackId = generateUniqueID()
        if(closeSelf) {
            NavigationHolder.popAndFinish(activity)
        }
        val bundle = (params.getMap("params")?:Arguments.createMap()).toBundle(
            extraEntries = arrayOf(
                Pair(StorageIdentifiers.PAGE_FROM, from ?: ""),
                Pair(
                    StorageIdentifiers.TARGET_SCENE, targetScene ?: ""
                ),
                Pair(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId),
            )
        )
        if(startLaunchModeActivity(launchMode, targetEntry, bundle)){
            return
        }

        currentActivity?.navigateToAnotherReactActivity(
            entryName = targetEntry,
            params = params.getMap("params"),
            targetScene = targetScene,
            callbackId = callbackId,
            from = from,
        )
        NavigationHolder.registerNavigationCallback(callbackId, callback)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun navigateBack(result: ReadableMap, from: String) {
        val activity = NavigationHolder.getTopComponent()
        activity?.navigateBackWithResult(result)
        println("navigateBack invoke, from is $from")
    }
}
