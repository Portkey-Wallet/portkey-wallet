package io.aelf.portkey.navigation

import android.content.Intent
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.CatalystInstance
import io.aelf.portkey.activities.BasePortkeyReactActivity
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import java.lang.ref.WeakReference

internal object NavigationHolder {
    private val navigationMap: MutableMap<String, WeakReference<BasePortkeyReactActivity>> =
        mutableMapOf()
    private val callbackMap: MutableMap<String, Callback> = mutableMapOf()
    internal var lastCachedIntent: Intent? = null


    fun pushNewComponent(activity: BasePortkeyReactActivity,entryName:String?) {
        navigationMap[entryName ?: activity.registerEntryName()] = WeakReference(activity)
    }

    fun registerNavigationCallback(callbackId: String, callback: Callback) {
        callbackMap[callbackId] = callback
    }

    @Synchronized
    fun invokeAnnotatedCallback(callbackId: String, after: (Callback) -> Unit) {
        if (callbackId == NO_CALLBACK_METHOD) return
        callbackMap[callbackId]?.let {
            after(it)
            callbackMap.remove(callbackId)
        }
    }

    fun getEntryComponent(name: String): BasePortkeyReactActivity {
        return navigationMap[name]?.get() ?: throw Exception("No entry found for $name")
    }
}
