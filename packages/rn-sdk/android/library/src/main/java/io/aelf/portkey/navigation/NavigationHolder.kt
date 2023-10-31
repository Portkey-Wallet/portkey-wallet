package io.aelf.portkey.navigation

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import io.aelf.portkey.components.activities.BasePortkeyReactActivity
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import java.lang.ref.WeakReference
import java.util.LinkedList

private fun generateCancelCallbackData(): WritableMap {
    return Arguments.createMap().apply {
        this.putString("status", "cancel")
        this.putString("data", "{}")
    }
}

internal object NavigationHolder {
    private val naviStack = LinkedList<WeakReference<BasePortkeyReactActivity>>()
    private val callbackMap: MutableMap<String, Callback> = mutableMapOf()
    private val nativeCallbackMap: MutableMap<String, (WritableMap) -> Unit> = mutableMapOf()
    internal var lastCachedIntent: Intent? = null


    fun pushNewComponent(activity: BasePortkeyReactActivity) {
        naviStack.push(WeakReference(activity))
    }

    fun registerNavigationCallback(callbackId: String, callback: Callback) {
        callbackMap[callbackId] = callback
    }

    fun registerNativeCallback(callbackId: String, callback: (WritableMap) -> Unit) {
        nativeCallbackMap[callbackId] = callback
    }

    @Synchronized
    fun invokeAnnotatedCallback(callbackId: String, result: WritableMap?) {
        if (callbackId == NO_CALLBACK_METHOD) return
        val jsCallback = callbackMap[callbackId]
        if (jsCallback != null) {
            jsCallback.invoke(result ?: generateCancelCallbackData())
            nativeCallbackMap.remove(callbackId)
        } else {
            invokeNativeCallback(callbackId, result ?: generateCancelCallbackData())
        }
    }

    @Synchronized
    private fun invokeNativeCallback(callbackId: String, data: WritableMap) {
        if (callbackId == NO_CALLBACK_METHOD) return
        nativeCallbackMap[callbackId]?.let {
            it(data)
            nativeCallbackMap.remove(callbackId)
        }
    }

    fun getTopComponent(): BasePortkeyReactActivity? {
        return naviStack.peek()?.get()
    }

    fun popTopComponent() {
        naviStack.pop()
    }
}
