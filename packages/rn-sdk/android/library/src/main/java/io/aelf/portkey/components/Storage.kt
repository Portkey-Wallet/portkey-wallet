package io.aelf.portkey.components

import com.tencent.mmkv.MMKV

private val portkeyMMKV = MMKV.mmkvWithID("portkey-sdk")

object PortkeyMMKVStorage {
    @Synchronized
    fun readString(key: String): String? {
        return portkeyMMKV.decodeString(key)
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
    }

    @Synchronized
    fun writeString(key: String, value: String?) {
        portkeyMMKV.encode(key, value)
    }
}
