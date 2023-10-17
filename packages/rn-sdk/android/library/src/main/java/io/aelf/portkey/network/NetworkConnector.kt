package io.aelf.portkey.network

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import okhttp3.Headers
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject

internal object NetworkConnector {
    private val okHttpClient = OkHttpClient.Builder()
        .build()

    fun getRequest(url: String, header: ReadableMap): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
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
            dealWithResponse(response, printBody = !response.isSuccessful || response.code != 200)
        } catch (e: Throwable) {
            ResultWrapper(-1)
        }
    }

    fun postRequest(url: String, header: ReadableMap, body: ReadableMap): ResultWrapper {
        return try {
            val request = okhttp3.Request.Builder()
                .url(url)
                .headers(header.toHeaders())
                .post(body.toRequestBody())
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
            dealWithResponse(response, printBody = !response.isSuccessful || response.code != 200)
        } catch (e: Throwable) {
            ResultWrapper(-1)
        }
    }

    private fun ReadableMap.toHeaders(): Headers {
        val headers = Headers.Builder()
        this.toHashMap().forEach {
            headers.add(it.key, it.value.toString())
        }
        return headers.build()
    }

    private fun ReadableMap.toRequestBody(): okhttp3.RequestBody {
        val json = this.toJson().toString()
        return json.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
    }

    private fun ReadableMap.toJson(): JsonObject {
        val data = this.toHashMap();
        val jsonObject = JsonObject();
        data.forEach {
            when (val value = it.value) {
                is String -> jsonObject.addProperty(it.key, value)
                is Int -> jsonObject.addProperty(it.key, value)
                is Number -> jsonObject.addProperty(it.key, value.toFixedType())
                is Map<*, *> -> jsonObject.add(it.key, (value as HashMap<String, Any>).toJson())
                is List<*> -> jsonObject.add(it.key, (value as ArrayList<Any>).toJson())
                else -> jsonObject.addProperty(it.key, value?.toString())
            }
        }
        return jsonObject
    }

    private fun HashMap<String, Any>.toJson(): JsonObject {
        val jsonObject = JsonObject()
        this.forEach {
            when (val value = it.value) {
                is String -> jsonObject.addProperty(it.key, value)
                is Int -> jsonObject.addProperty(it.key, value)
                is Number -> jsonObject.addProperty(it.key, value.toFixedType())
                is Map<*, *> -> jsonObject.add(it.key, (value as HashMap<String, Any>).toJson())
                is List<*> -> jsonObject.add(it.key, (value as ArrayList<Any>).toJson())
                else -> jsonObject.addProperty(it.key, value?.toString())
            }
        }
        return jsonObject
    }

    private fun List<*>.toJson(): JsonArray {
        val array = JsonArray()
        this.forEach {
            when (val value = it) {
                is String -> array.add(value)
                is Number -> array.add(value.toFixedType())
                is Boolean -> array.add(value)
                is Map<*, *> -> array.add((value as HashMap<String, Any>).toJson())
                is List<*> -> array.add((value as ArrayList<Any>).toJson())
                else -> array.add(value.toString())
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

    private fun dealWithResponse(response: Response, printBody: Boolean = false): ResultWrapper {
        var result: JsonElement? = null
        try {
            result = JsonParser.parseString(response.body?.string())
        } catch (ignored: Throwable) {
        }
        if (result != null && printBody) {
            Log.w("NetworkConnector", "result: ${result} , code: ${response.code}")
        }
        return if (response.isSuccessful) {
            ResultWrapper(0, result = result)
        } else {
            val errorCode: String = if (result != null) {
                val code = result.asJsonObject.get("error").asJsonObject.get("code")
                if (!code.isJsonNull) {
                    code.asString
                } else {
                    "-1"
                }
            } else "${response.code}"
            val errMessage: String =
                if (result != null) {
                    val message = result.asJsonObject.get("error").asJsonObject.get("message")
                    if (!message.isJsonNull) {
                        message.asString
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
    fun toJsonString(): String {
        val jsonObject = JSONObject()
        jsonObject.put("status", status)
        jsonObject.put("result", result)
        jsonObject.put("errCode", errCode)
        jsonObject.put("errMessage", errMessage)
        return jsonObject.toString()
    }
}
