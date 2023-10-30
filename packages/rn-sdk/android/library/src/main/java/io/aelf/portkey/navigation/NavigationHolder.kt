package io.aelf.portkey.navigation

import android.content.Intent
import com.facebook.react.bridge.Callback
import io.aelf.portkey.components.activities.BasePortkeyReactActivity
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import java.lang.ref.WeakReference
import java.util.LinkedList

internal object NavigationHolder {
    private val naviStack = LinkedList<WeakReference<BasePortkeyReactActivity>>();
    private val callbackMap: MutableMap<String, Callback> = mutableMapOf()

    fun pushNewComponent(activity: BasePortkeyReactActivity) {
        naviStack.push(WeakReference(activity))
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

    fun getTopComponent(): BasePortkeyReactActivity? {
        return naviStack.peek()?.get()
    }

    fun popTopComponent() {
        naviStack.pop()
    }
}
