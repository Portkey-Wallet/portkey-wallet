package io.aelf.portkey.native_modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.aelf.portkey.components.PortkeyMMKVStorage

class StorageModule(private val context: ReactApplicationContext) :
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

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getString(key: String): String? {
        return PortkeyMMKVStorage.readString(key)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getBoolean(key: String): Boolean {
        return PortkeyMMKVStorage.readBoolean(key)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getNumber(key: String): Double {
        return PortkeyMMKVStorage.readDouble(key)
    }

}
