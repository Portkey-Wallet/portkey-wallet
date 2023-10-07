package io.aelf.portkey.native_modules

import android.util.Log
import com.facebook.react.bridge.CatalystInstance
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import io.aelf.portkey.components.JSEventBus
import io.aelf.portkey.navigation.NavigationHolder
import io.aelf.portkey.tools.generateUniqueCallbackID

internal class NativeWrapperModule(private val context: ReactContext) :
    ReactContextBaseJavaModule() {
    companion object {
        @JvmStatic
        lateinit var instance: NativeWrapperModule
    }

    init {
        instance = this
    }

    @ReactMethod
    override fun getName(): String {
        return "NativeWrapperModule"
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            Pair("platformName", "android")
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

    @ReactMethod
    fun emitJSMethodResult(eventId: String, result: String) {
        JSEventBus.invoke(eventId, result)
    }

    fun <T> callJSMethod(
        moduleName: String,
        methodName: String,
        params: WritableNativeArray,
        callback: (T) -> Unit,
        tClass: Class<T>
    ) {
        val callbackId = generateUniqueCallbackID()
        params.pushString(callbackId)
        JSEventBus.registerCallback(callbackId, callback, tClass)
        context.catalystInstance.jsMethodCaller(moduleName, methodName, params)
    }

    fun callJSMethod(
        moduleName: String,
        methodName: String,
        params: WritableNativeArray
    ) {
        val callbackId = generateUniqueCallbackID()
        params.pushString(callbackId)
        context.catalystInstance.jsMethodCaller(moduleName, methodName, params)
    }

}

/**
 * Used just to inform the parameter name of catalystInstance
 */
fun CatalystInstance.jsMethodCaller(
    moduleName: String,
    methodName: String,
    params: WritableNativeArray
) {
    this.callFunction(moduleName, methodName, params)
}


/**
 * export interface NativeWrapperModule {
 *   onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
 *   onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
 *   onWarning: (from: string, warnMsg: string) => void;
 *   getPlatformName: () => string;
 * }
 */
