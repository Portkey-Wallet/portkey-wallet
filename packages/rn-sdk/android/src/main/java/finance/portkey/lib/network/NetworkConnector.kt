@file:Suppress("UNCHECKED_CAST", "UNNECESSARY_SAFE_CALL")

package finance.portkey.lib.network

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.google.gson.GsonBuilder
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import okhttp3.FormBody
import okhttp3.Headers
import okhttp3.JavaNetCookieJar
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject
import java.net.CookieManager
import java.net.CookiePolicy


internal fun JsonObject.toPrettyJson(): String {
    val prettyGson = GsonBuilder().setPrettyPrinting().create()
    return prettyGson.toJson(this)
}

internal fun ReadableMap.toJson(): JsonObject {
    val data = this.toHashMap()
    val jsonObject = JsonObject()
    data.forEach {
        val (key, value) = it
        when (value) {
            is String -> jsonObject.addProperty(key, value)
            is Int -> jsonObject.addProperty(key, value)
            is Number -> jsonObject.addProperty(key, value.toFixedType())
            is Map<*, *> -> jsonObject.add(key, (value as HashMap<String, Any>).toJson())
            is List<*> -> jsonObject.add(key, (value as ArrayList<Any>).toJson())
            else -> jsonObject.addProperty(key, value?.toString())
        }
    }
    return jsonObject
}

private fun HashMap<String, Any>.toJson(): JsonObject {
    val jsonObject = JsonObject()
    this.forEach {
        val (key, value) = it
        when (value) {
            is String -> jsonObject.addProperty(key, value)
            is Int -> jsonObject.addProperty(key, value)
            is Number -> jsonObject.addProperty(key, value.toFixedType())
            is Map<*, *> -> jsonObject.add(key, (value as HashMap<String, Any>).toJson())
            is List<*> -> jsonObject.add(key, (value as ArrayList<Any>).toJson())
            else -> jsonObject.addProperty(key, value?.toString())
        }
    }
    return jsonObject
}

private fun List<*>.toJson(): JsonArray {
    val array = JsonArray()
    this.forEach {
        when (it) {
            is String -> array.add(it)
            is Number -> array.add(it.toFixedType())
            is Boolean -> array.add(it)
            is Map<*, *> -> array.add((it as HashMap<String, Any>).toJson())
            is List<*> -> array.add((it as ArrayList<Any>).toJson())
            else -> array.add(it.toString())
        }
    }
    return array
}

private fun Number.toFixedType(): Number {
    if (this is Double || this is Float) {
        return if (this.toString().endsWith(".0")) {
            this.toInt()
        } else {
            this
        }
    }
    return this
}


internal object NetworkConnector {
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(TimeOutInterceptor())
        .cookieJar(JavaNetCookieJar(CookieManager().apply {
            setCookiePolicy(CookiePolicy.ACCEPT_ALL)
        }))
        .build()

    fun getRequest(url: String, header: ReadableMap, options: ReadableMap?): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
                .get()
                .tag(
                    TimeOutConfig(
                        options?.getDouble("maxWaitingTime")?.toInt() ?: 5000
                    )
                )
                .build()
            val response = okHttpClient
                .newCall(request)
                .execute()
            if (!response.isSuccessful) {
                Log.e(
                    "NetworkConnector",
                    "Network failed ! url:${url}, headers:${header.toHashMap()}, status:${response.code}"
                )
            }
            dealWithResponse(response, printBody = response.code != 200)
        } catch (e: Throwable) {
            Log.e("NetworkConnector", "getRequest", e)
            ResultWrapper(-1)
        }
    }

    fun postRequest(
        url: String,
        header: ReadableMap,
        body: ReadableMap,
        options: ReadableMap?
    ): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
                .post(body.toRequestBody(header.getString("Content-Type") ?: "application/json"))
                .tag(
                    TimeOutConfig(
                        options?.getDouble("maxWaitingTime")?.toInt() ?: 5000
                    )
                )
                .build()
            val response = okHttpClient
                .newCall(request)
                .execute()
            if (!response.isSuccessful) {
                Log.e(
                    "NetworkConnector",
                    "Network failed ! url:${url}, headers:${header.toHashMap()}, status:${response.code}"
                )
            }
            dealWithResponse(response, printBody = response.code != 200)
        } catch (e: Throwable) {
            Log.e("NetworkConnector", "postRequest", e)
            ResultWrapper(-1)
        }
    }

    fun headRequest(url: String, header: ReadableMap, options: ReadableMap?): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
                .head()
                .tag(
                    TimeOutConfig(
                        options?.getDouble("maxWaitingTime")?.toInt() ?: 5000
                    )
                )
                .build()
            val response = okHttpClient
                .newCall(request)
                .execute()
            if (!response.isSuccessful) {
                Log.e(
                    "NetworkConnector",
                    "Network failed ! url:${url}, headers:${header.toHashMap()}, status:${response.code}"
                )
            }
            return ResultWrapper(
                response.code,
            )
        } catch (e: Throwable) {
            Log.e("NetworkConnector", "headRequest", e)
            ResultWrapper(-1)
        }
    }

    fun putRequest(
        url: String,
        header: ReadableMap,
        body: ReadableMap,
        options: ReadableMap?
    ): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
                .put(body.toRequestBody(header.getString("Content-Type") ?: "application/json"))
                .tag(
                    TimeOutConfig(
                        options?.getDouble("maxWaitingTime")?.toInt() ?: 5000
                    )
                )
                .build()
            val response = okHttpClient
                .newCall(request)
                .execute()
            if (!response.isSuccessful) {
                Log.e(
                    "NetworkConnector",
                    "Network failed ! url:${url}, headers:${header.toHashMap()}, status:${response.code}"
                )
            }
            dealWithResponse(response, printBody = response.code != 200)
        } catch (e: Throwable) {
            Log.e("NetworkConnector", "putRequest", e)
            ResultWrapper(-1)
        }
    }

    private fun ReadableMap.toHeaders(): Headers {
        val headers = Headers.Builder()
        this.toHashMap().forEach lambda@{
            val (key, value) = it
            if (value == null) {
                return@lambda
            } else if (value is String) {
                if (value.isEmpty()) return@lambda
            }
            headers.add(key, value.toString())
        }
        return headers.build()
    }

    private fun ReadableMap.toRequestBody(contentType: String = "application/json"): okhttp3.RequestBody {
        return if (contentType == "application/json") {
            val json = this.toJson().toString()
            json.toRequestBody(contentType.toMediaTypeOrNull())
        } else {
            val formBody = FormBody.Builder()
            this.toHashMap().forEach {
                val (key, value) = it
                formBody.add(key, "$value")
            }
            formBody.build()
        }
    }


    private fun dealWithResponse(response: Response, printBody: Boolean = false): ResultWrapper {
        var result: JsonElement? = null
        try {
            result = JsonParser.parseString(response.body?.string())
        } catch (ignored: Throwable) {
        }
        if (result != null && printBody) {
            Log.w("NetworkConnector", "result: $result , code: ${response.code}")
        }
        return if (response.isSuccessful) {
            ResultWrapper(0, result = result)
        } else {
            val errorCode: String = if (result != null && !result.isJsonNull) {
                val error = result.asJsonObject.get("error")
                if (error != null && !error.isJsonNull) {
                    val code = error.asJsonObject.get("code")
                    if (code != null && !code.isJsonNull) {
                        code.asString
                    } else {
                        "empty"
                    }
                } else {
                    "-1"
                }
            } else "${response.code}"
            val errMessage: String =
                if (result != null && !result.isJsonNull) {
                    val error = result.asJsonObject.get("error")
                    if (error != null && !error.isJsonNull) {
                        val message = error.asJsonObject.get("message")
                        if (message != null && !message.isJsonNull) {
                            message.asString
                        } else {
                            "empty"
                        }
                    } else {
                        "empty"
                    }
                } else {
                    "null"
                }
            ResultWrapper(-1, errorCode, null, errMessage)
        }
    }
}

internal data class ResultWrapper(
    private val status: Int,
    private val errCode: String = "0",
    private val result: JsonElement? = null,
    private val errMessage: String? = null
) {
    private fun toJson(): JSONObject {
        val jsonObject = JSONObject()
        jsonObject.put("status", status)
        jsonObject.put("result", result)
        jsonObject.put("errCode", errCode)
        jsonObject.put("errMessage", errMessage)
        return jsonObject
    }

    fun toJsonString(): String {
        return toJson().toString()
    }

    fun toPrettyJsonString(): String {
        val prettyGson = GsonBuilder().setPrettyPrinting().create()
        return prettyGson.toJson(toJson())
    }
}
