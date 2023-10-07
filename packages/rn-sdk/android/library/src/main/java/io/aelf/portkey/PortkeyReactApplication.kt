package io.aelf.portkey

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.tencent.mmkv.MMKV
import io.aelf.portkey.components.PortkeyReactNativeHost

class PortkeyReactApplication : Application(), ReactApplication {

    override fun onCreate() {
        super.onCreate()
        MMKV.initialize(this)
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return PortkeyReactNativeHost(application = this, isDebug = BuildConfig.IS_DEBUG)
    }

}
