package io.aelf.portkey.network

import com.facebook.react.bridge.ReadableMap
import com.google.gson.JsonElement
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
            dealWithResponse(response)
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
            dealWithResponse(response)
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
        val jsonObject = JSONObject()
        this.toHashMap().forEach {
            jsonObject.put(it.key, it.value)
        }
        return jsonObject.toString()
            .toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
    }

    private fun dealWithResponse(response: Response): ResultWrapper {
        var result: JsonElement? = null
        try {
            result = JsonParser.parseString(response.body?.string())
        } catch (ignored: Throwable) {
        }
        return if (response.isSuccessful) {
            ResultWrapper(0, result = result)
        } else {
            val errorCode: String =
                if (result != null) result.asJsonObject.get("error").asJsonObject.get("code").asString
                    ?: "${response.code}" else "${response.code}"
            ResultWrapper(-1, errorCode, result)
        }
    }
}

internal data class ResultWrapper(
    private val status: Int,
    private val errCode: String = "0",
    private val result: JsonElement? = null
) {
    fun toJsonString(): String {
        val jsonObject = JSONObject()
        jsonObject.put("status", status)
        jsonObject.put("result", result)
        jsonObject.put("errCode", errCode)
        return jsonObject.toString()
    }
}
