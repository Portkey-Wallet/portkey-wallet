package finance.portkey.lib.navigation

import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import finance.portkey.lib.components.activities.BasePortkeyReactActivity
import finance.portkey.lib.config.NO_CALLBACK_METHOD
import finance.portkey.lib.config.StorageIdentifiers
import java.lang.ref.WeakReference
import java.util.LinkedList

private fun generateCancelCallbackData(): WritableMap {
    return Arguments.createMap().apply {
        this.putString("status", "cancel")
        this.putString("data", "{}")
    }
}
private fun generateSystemCallbackData(): WritableMap {
    return Arguments.createMap().apply {
        this.putString("status", "system")
        this.putString("data", "{}")
    }
}
internal object NavigationHolder {
    private val naviStack = LinkedList<WeakReference<BasePortkeyReactActivity>>()
    private val entryMap = HashMap<String, WeakReference<BasePortkeyReactActivity>>();
    private val callbackMap: MutableMap<String, Callback> = mutableMapOf()
    private val nativeCallbackMap: MutableMap<String, (WritableMap) -> Unit> = mutableMapOf()

    fun clear(){
       val tempNaviStack = LinkedList<WeakReference<BasePortkeyReactActivity>>()
        naviStack.forEach {
            tempNaviStack.push(it)
        }
        tempNaviStack.forEach {
            popAndFinish(it.get())
        }
//        naviStack.clear()
//        entryMap.clear()
    }
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
            callbackMap.remove(callbackId)
            jsCallback.invoke(result ?: generateCancelCallbackData())
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
    private fun getTopComponentRef(): WeakReference<BasePortkeyReactActivity>? {
        return naviStack.peek()
    }
    fun popTopComponent() {
        val componentKey = entryMap.keys.find { entryMap[it] == getTopComponentRef()}
        entryMap.remove(componentKey)
        naviStack.pop()
    }
    private fun findComponentByEntry(pageEntry: String): WeakReference<BasePortkeyReactActivity>? {
        return entryMap[pageEntry]
    }
    fun hasEntry(pageEntry: String): Boolean {
        return entryMap.keys.contains(pageEntry)
    }
    fun singleTaskOp(pageEntry: String, bundle: Bundle): Boolean {
        val component = findComponentByEntry(pageEntry)
        val iterator = naviStack.listIterator()
        val list = arrayListOf<WeakReference<BasePortkeyReactActivity>>()

        if (component != null) {
            while (iterator.hasNext()) {
                val topComponent = iterator.next()
                if (topComponent == component) {
                    break
                }
                list.add(topComponent)
            }
            list.forEach {
                val componentKey = entryMap.keys.find {inIt-> entryMap[inIt] == it }
                entryMap.remove(componentKey)
                it.get()?.navigateBackWithResult(generateSystemCallbackData())
            }
            getTopComponent()?.runOnUiThread {
                getTopComponent()?.onNewIntent(Intent().apply {
                    putExtra(StorageIdentifiers.PAGE_PARAMS, bundle)
                })
            }
            return true
        } else {
            return false
        }
    }
    fun singleTopOp(pageEntry: String, bundle: Bundle): Boolean{
        return false
    }

    fun popAndFinish(activity: BasePortkeyReactActivity?) {
        activity?.navigateBackWithResult(generateSystemCallbackData())
    }
}
