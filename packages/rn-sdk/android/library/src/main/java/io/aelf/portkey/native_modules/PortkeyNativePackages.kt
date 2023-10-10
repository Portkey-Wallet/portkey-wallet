package io.aelf.portkey.native_modules

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage




internal class PortkeyNativePackages : ReactPackage {
    override fun createNativeModules(reactApplicationContext: ReactApplicationContext): MutableList<NativeModule> {
        return mutableListOf(
            RouterModule(reactApplicationContext),
            NativeWrapperModule(reactApplicationContext),
            NetworkModule(reactApplicationContext)
        )
    }

    override fun createViewManagers(reactApplicationContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> {
        return mutableListOf()
    }

}
