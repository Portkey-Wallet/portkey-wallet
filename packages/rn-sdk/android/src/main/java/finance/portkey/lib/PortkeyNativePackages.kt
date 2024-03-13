package finance.portkey.lib

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import finance.portkey.lib.native_modules.BiometricModule
import finance.portkey.lib.native_modules.NativeWrapperModule
import finance.portkey.lib.native_modules.NetworkModule
import finance.portkey.lib.native_modules.PermissionModule
import finance.portkey.lib.native_modules.RouterModule
import finance.portkey.lib.native_modules.StorageModule


class PortkeyNativePackages : ReactPackage {
    override fun createNativeModules(reactApplicationContext: ReactApplicationContext): MutableList<NativeModule> {
        return mutableListOf(
            RouterModule(reactApplicationContext),
            NativeWrapperModule(reactApplicationContext),
            NetworkModule(reactApplicationContext),
            StorageModule(reactApplicationContext),
            PermissionModule(reactApplicationContext),
            BiometricModule(reactApplicationContext)
        )
    }

    override fun createViewManagers(reactApplicationContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> {
        return mutableListOf()
    }

}
