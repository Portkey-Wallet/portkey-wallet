package io.aelf.portkey.components.logic

import android.util.Log
import com.tencent.mmkv.MMKV
import io.aelf.core.JSNameSpace
import java.util.Arrays

private val portkeyMMKV = MMKV.mmkvWithID("portkey-sdk")

internal infix fun String.but(options: StorageKeyOptions): String {
    return when (options) {
        TEMP -> "$this#${JSNameSpace.nameSpace}"
        else -> this
    }
}

internal val TEMP: StorageKeyOptions = object : StorageKeyOptions {}

internal interface StorageKeyOptions

object PortkeyMMKVStorage {
    @Synchronized
    fun readString(key: String): String? {
        return portkeyMMKV.decodeString(key)
    }

    @Synchronized
    fun readDouble(key: String): Double {
        return portkeyMMKV.decodeDouble(key, 0.0)
    }

    @Synchronized
    fun readBoolean(key: String): Boolean {
        return portkeyMMKV.decodeBool(key, false)
    }

    @Synchronized
    fun <T> readTClass(key: String, clazz: Class<T>): Any? {
        return when (clazz) {
            String::class.java -> portkeyMMKV.decodeString(key)
            Int::class.java -> portkeyMMKV.decodeInt(key)
            Long::class.java -> portkeyMMKV.decodeLong(key)
            Float::class.java -> portkeyMMKV.decodeFloat(key)
            Double::class.java -> portkeyMMKV.decodeDouble(key)
            Boolean::class.java -> portkeyMMKV.decodeBool(key)
            else -> {
                try {
                    val res = portkeyMMKV.decodeString(key)
                    return globalGson.fromJson(res, clazz)
                } catch (e: Throwable) {
                    return null
                }
            }
        }
    }

    fun clear() {
        portkeyMMKV.clearAll()
        portkeyMMKV.clearMemoryCache()
        portkeyMMKV.sync()
        Log.w("PortkeyMMKV", "keys : ${Arrays.toString(portkeyMMKV.allNonExpireKeys())}")
    }

    @Synchronized
    fun writeString(key: String, value: String?) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    fun writeDouble(key: String, value: Double) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    fun writeInt(key: String, value: Int) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    fun writeBoolean(key: String, value: Boolean) {
        portkeyMMKV.encode(key, value)
    }

}
