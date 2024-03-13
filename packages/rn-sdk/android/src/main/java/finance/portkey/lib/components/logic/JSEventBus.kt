package finance.portkey.lib.components.logic

import com.google.gson.Gson

internal object JSEventBus {
    private val eventMap: MutableMap<String, JSCallbackWrapper<*>> = mutableMapOf()

    fun <T> registerCallback(eventName: String, callback: (msg: T) -> Unit, tClass: Class<T>) {
        eventMap[eventName] = JSCallbackWrapper(callback, tClass)
    }

    fun invoke(eventName: String, msg: String) {
        eventMap[eventName]?.invoke(msg)
    }
}

internal class JSCallbackWrapper<T>(
    private val callback: (T) -> Unit,
    private val tClass: Class<T>
) {
    fun invoke(msg: String) {
        if (msg.isEmpty()) throw IllegalArgumentException("msg is empty")
        try {
            val result = globalGson.fromJson(msg, tClass)
            callback(result)
        } catch (e: Throwable) {
            throw IllegalArgumentException("msg is not a valid json string! msg : ".plus(msg), e)
        }
    }
}

internal val globalGson = Gson()
