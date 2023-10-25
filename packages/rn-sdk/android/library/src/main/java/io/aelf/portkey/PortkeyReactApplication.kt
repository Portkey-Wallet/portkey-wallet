package io.aelf.portkey

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.tencent.mmkv.MMKV
import io.aelf.portkey.components.logic.PortkeyReactNativeHost
import io.aelf.portkey.components.logic.hostInstance

class PortkeyReactApplication : Application(), ReactApplication {

    override fun onCreate() {
        super.onCreate()
        MMKV.initialize(this)
        reactNativeHost
    }


    override fun getReactNativeHost(): ReactNativeHost {
            return hostInstance ?: createNewHost()
    }

    private fun createNewHost(): PortkeyReactNativeHost {
        return PortkeyReactNativeHost(
            application = this,
            isDebug = BuildConfig.IS_DEBUG
        )
    }

}
