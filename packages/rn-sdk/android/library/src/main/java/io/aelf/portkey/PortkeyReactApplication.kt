package io.aelf.portkey

import android.app.Application
import com.facebook.hermes.reactexecutor.HermesExecutorFactory
import com.facebook.react.BuildConfig
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage

class PortkeyReactApplication : Application(), ReactApplication {
    override fun getReactNativeHost(): ReactNativeHost {
        return object : ReactNativeHost(this) {
            override fun getUseDeveloperSupport(): Boolean {
                return BuildConfig.DEBUG
            }

            override fun getPackages(): MutableList<ReactPackage> {
                return PackageList(this).packages
            }

            override fun getJSMainModuleName(): String {
                return "index"
            }

            override fun getBundleAssetName(): String {
                return "index.android.bundle"
            }

            override fun getJavaScriptExecutorFactory() = HermesExecutorFactory()
        }
    }

}
