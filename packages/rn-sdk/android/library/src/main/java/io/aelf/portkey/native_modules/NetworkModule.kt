package io.aelf.portkey.native_modules

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import io.aelf.portkey.network.NetworkConnector
import io.aelf.portkey.network.ResultWrapper
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

internal class NetworkModule(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
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
            val resultStr = result.toJsonString()
            Log.w(
                "NetworkModule",
                "url:${url}, headers:${headers.toHashMap()}, params:${params.toHashMap()}, result:${resultStr}"
            )
            jSPromiseHandle.resolve(resultStr)
        }
    }

    override fun getName(): String = "NetworkModule"
}
