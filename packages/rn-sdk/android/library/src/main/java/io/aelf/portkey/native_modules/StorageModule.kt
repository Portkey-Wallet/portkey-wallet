package io.aelf.portkey.native_modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.aelf.portkey.components.logic.PortkeyMMKVStorage

class StorageModule(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    override fun getName(): String {
        return "StorageModule"
    }


    @ReactMethod(isBlockingSynchronousMethod = true)
    private fun setString(key: String, value: String?) {
        this.set(key, value)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    private fun setNumber(key: String, value: Double) {
        this.set(key, value)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    private fun setBoolean(key: String, value: Boolean) {
        this.set(key, value)
    }

    private fun set(key: String, value: Any?) {
        when (value) {
            is String -> PortkeyMMKVStorage.writeString(key, value)
            is Int -> PortkeyMMKVStorage.writeInt(key, value)
            is Double -> PortkeyMMKVStorage.writeDouble(key, value)
            is Boolean -> PortkeyMMKVStorage.writeBoolean(key, value)
            else -> PortkeyMMKVStorage.writeString(key, value?.toString())
        }
    }

    @ReactMethod
    fun getString(key: String, handler: Promise) {
        val res = PortkeyMMKVStorage.readString(key)
        handler.resolve(res)
    }

    @ReactMethod
    fun getBoolean(key: String, handler: Promise) {
        val res = PortkeyMMKVStorage.readBoolean(key)
        handler.resolve(res)
    }

    @ReactMethod
    fun getNumber(key: String, handler: Promise) {
        val res = PortkeyMMKVStorage.readDouble(key)
        handler.resolve(res)
    }

}
