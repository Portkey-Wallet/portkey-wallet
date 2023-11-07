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
    private val entryMap = HashMap<String, WeakReference<BasePortkeyReactActivity>>();
    private val callbackMap: MutableMap<String, Callback> = mutableMapOf()
    private val nativeCallbackMap: MutableMap<String, (WritableMap) -> Unit> = mutableMapOf()

    fun pushNewComponent(activity: BasePortkeyReactActivity, pageEntry: String) {
        val wrfActivity = WeakReference(activity)
        naviStack.push(wrfActivity)
        entryMap[pageEntry] = wrfActivity
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
        val topComponentKey = entryMap.entries.find { it == getTopComponent() }?.key
        entryMap.remove(topComponentKey)
    }
    private fun findComponentByEntry(pageEntry: String): WeakReference<BasePortkeyReactActivity>? {
        return entryMap[pageEntry]
    }
    fun hasEntry(pageEntry: String): Boolean {
        return entryMap.keys.contains(pageEntry)
    }
    fun singleTaskOp(pageEntry: String): Boolean {
        return false
//        val component = findComponentByEntry(pageEntry)
//        val iterator = naviStack.iterator()
//        val list = arrayListOf<WeakReference<BasePortkeyReactActivity>>()
//
//        if (component != null) {
//            while (iterator.hasNext()) {
//                val topComponent = iterator.next()
//                if (topComponent == component) {
//                    break
//                }
//                list.add(topComponent)
//                iterator.remove()
//            }
//            list.forEach {
//                val componentKey = entryMap.entries.find {inIt-> it == inIt }?.key
//                entryMap.remove(componentKey)
//                it.get()?.finish()
//            }
//            return true
//        } else {
//            return false
//        }
    }
    fun singleTopOp(pageEntry: String): Boolean{
        return false
    }
}
