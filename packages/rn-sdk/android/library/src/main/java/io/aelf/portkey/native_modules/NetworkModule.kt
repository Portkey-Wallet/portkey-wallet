package io.aelf.portkey.native_modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import io.aelf.portkey.network.NetworkConnector
import io.aelf.portkey.network.ResultWrapper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

internal class NetworkModule(private val context: ReactContext) :
    ReactContextBaseJavaModule() {
    @ReactMethod
    fun fetch(
        url: String,
        method: String,
        params: ReadableMap,
        headers: ReadableMap,
        jSPromiseHandle: Promise
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            val result = when (method) {
                "GET" -> {
                    NetworkConnector.getRequest(url, headers)
                }

                "POST" -> {
                    NetworkConnector.postRequest(url, headers, params)
                }

                else -> {
                    ResultWrapper(-1)
                }
            }
            jSPromiseHandle.resolve(result.toJsonString())
        }
    }

    override fun getName(): String = "NetworkModule"
}
