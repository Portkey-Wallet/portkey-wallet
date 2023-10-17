package io.aelf.portkey.components

import android.app.Application
import com.facebook.hermes.reactexecutor.HermesExecutorFactory
import com.facebook.react.PackageList
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import io.aelf.portkey.native_modules.PortkeyNativePackages

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
}
