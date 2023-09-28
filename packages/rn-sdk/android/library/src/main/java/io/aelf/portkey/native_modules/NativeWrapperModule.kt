package io.aelf.portkey.native_modules

import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.annotations.ReactProp
import io.aelf.portkey.navigation.NavigationHolder

internal class NativeWrapperModule(private val context: ReactContext) :
    ReactContextBaseJavaModule() {
    @ReactMethod
    override fun getName(): String {
        return "NativeWrapperModule"
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            Pair("platformName","android")
        )
    }

    @ReactMethod
    fun onError(from: String, errMsg: String, data: ReadableMap) {
        Log.e("NativeWrapperModule:Entry $from ", "onError: $errMsg, data: ${data.toHashMap()}")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun onFatalError(from: String, errMsg: String, data: ReadableMap) {
        NavigationHolder.getEntryComponent(from).finish()
        onError(from, errMsg, data)
    }

    @ReactMethod
    fun onWarning(from: String, warnMsg: String) {
        Log.w("NativeWrapperModule:Entry $from ", "onWarning: $warnMsg")
    }

}


/**
 * export interface NativeWrapperModule {
 *   onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
 *   onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
 *   onWarning: (from: string, warnMsg: string) => void;
 *   getPlatformName: () => string;
 * }
 */
