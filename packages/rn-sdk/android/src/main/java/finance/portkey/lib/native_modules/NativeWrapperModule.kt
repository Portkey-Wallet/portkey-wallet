package finance.portkey.lib.native_modules

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import finance.portkey.core.JSNameSpace
import finance.portkey.lib.components.logic.JSEventBus
import finance.portkey.lib.navigation.NavigationHolder
import java.lang.ref.WeakReference

internal var NativeWrapperModuleInstance: NativeWrapperModule? = null

class NativeWrapperModule(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    private var contextHolder: WeakReference<ReactApplicationContext>

    init {
        contextHolder = WeakReference(context)
        NativeWrapperModuleInstance = this
    }

    @ReactMethod
    override fun getName(): String {
        return "NativeWrapperModule"
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            Pair("platformName", "android"),
            Pair("tempStorageIdentifier", JSNameSpace.nameSpace)
        )
    }

    @ReactMethod
    fun onError(from: String, errMsg: String, data: ReadableMap) {
        Log.e("NativeWrapperModule", "Entry $from, onError: $errMsg, data: ${data.toHashMap()}")
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun onFatalError(from: String, errMsg: String, data: ReadableMap) {
        onError(from, errMsg, data)
        NavigationHolder.getTopComponent()?.finish()
    }

    @ReactMethod
    fun onWarning(from: String, warnMsg: String) {
        Log.w("NativeWrapperModule", "Entry $from, onWarning: $warnMsg")
    }

    @ReactMethod
    fun emitJSMethodResult(eventId: String, result: String) {
        JSEventBus.invoke(eventId, result)
    }

    @ReactMethod
    fun addListener(type: String?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(type: Int?) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    fun sendGeneralEvent(eventName: String, params: ReadableMap) {
        this.reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}



