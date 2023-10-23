package io.aelf.portkey.components.logic

import android.annotation.SuppressLint
import android.app.Application
import com.facebook.hermes.reactexecutor.HermesExecutorFactory
import com.facebook.react.PackageList
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.CatalystInstance
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableNativeArray
import io.aelf.portkey.native_modules.PortkeyNativePackages
import io.aelf.portkey.tools.generateUniqueCallbackID

var hostInstance: PortkeyReactNativeHost? = null

class PortkeyReactNativeHost(
    application: Application, private val isDebug: Boolean = false
) : ReactNativeHost(application) {

    init {
        hostInstance = this
    }

    override fun getUseDeveloperSupport(): Boolean = isDebug
    override fun getPackages(): MutableList<ReactPackage> {
        return PackageList(this).packages.apply {
            add(PortkeyNativePackages())
        }
    }

    override fun getJSMainModuleName(): String {
        return "index"
    }

    override fun getBundleAssetName(): String {
        return "index.android.bundle"
    }

    override fun getJavaScriptExecutorFactory() = HermesExecutorFactory()

    @SuppressLint("VisibleForTests")
    fun getCatalystInstance(): CatalystInstance? {
        val context = reactInstanceManager?.currentReactContext ?: return null
        val field = ReactContext::class.java.getDeclaredField("mCatalystInstance")
        field.isAccessible = true
        return field.get(context) as? CatalystInstance
    }
}

fun <T> CatalystInstance.callJSMethodWithCallback(
    moduleName: String,
    methodName: String,
    params: WritableNativeArray = Arguments.fromJavaArgs(arrayOf<Any>()),
    callback: (T) -> Unit,
    tClass: Class<T>
) {
    val callbackId = generateUniqueCallbackID()
    if (this.isDestroyed) {
        throw UnsupportedOperationException("CatalystInstance is destroyed")
    }
    params.pushString(callbackId)
    JSEventBus.registerCallback(callbackId, callback, tClass)
    this.jsMethodCaller(moduleName, methodName, params)
}

/** Used just to inform the parameter name of catalystInstance */
fun CatalystInstance.jsMethodCaller(
    moduleName: String,
    methodName: String,
    params: WritableNativeArray
) {
    this.callFunction(moduleName, methodName, params)
}
