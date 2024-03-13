package finance.portkey.lib.native_modules

import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import finance.portkey.lib.components.logic.PortkeyMMKVStorage
import finance.portkey.lib.tools.generateUniqueID
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class StorageModule(private val context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {
    override fun getConstants(): MutableMap<String, String?> {
        val sharedPreferences: SharedPreferences =
            context.getSharedPreferences("portkey_react_native", MODE_PRIVATE)
        val res = sharedPreferences.getString("encryptKey", null)
        val encryptKey = if (res.isNullOrEmpty()) {
            val editor = sharedPreferences.edit()
            val encryptKey = generateUniqueID()
            CoroutineScope(Dispatchers.IO).launch {
                editor.putString("encryptKey", encryptKey)
                editor.apply()
            }
            encryptKey
        } else {
            res
        }
        return mutableMapOf(
            Pair("internalEncryptKey", encryptKey)
        )
    }

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
