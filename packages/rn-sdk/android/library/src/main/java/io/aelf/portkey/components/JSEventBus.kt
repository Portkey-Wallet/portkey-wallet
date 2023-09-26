package io.aelf.portkey.components

import com.google.gson.Gson

internal object JSEventBus {
    private val eventMap: MutableMap<String, JSCallbackWrapper<*>> = mutableMapOf()

    fun <T> registerCallback(eventName: String, callback: (msg: T) -> Unit, tClass: Class<T>) {
        eventMap[eventName] = JSCallbackWrapper(callback, tClass)
    }
}

internal class JSCallbackWrapper<T>(
    private val callback: (T) -> Unit,
    private val tClass: Class<T>
) {
    fun invoke(msg: String) {
        val result = Gson().fromJson(msg, tClass)

    }
}

internal val globalGson = Gson()
