package finance.portkey.lib.components.logic

import android.util.Log
import com.tencent.mmkv.MMKV
import finance.portkey.core.JSNameSpace
import finance.portkey.lib.BuildConfig


// change this crypto key to ensure high level of information security
private const val DEFAULT_CRYPTO_KEY = "portkey-default-crypto-key"

const val PORTKEY_CONFIG_ENDPOINT_URL = "endPointUrl"

private val portkeyConfigKeyList = listOf(PORTKEY_CONFIG_ENDPOINT_URL)

private val portkeyMMKV =
    MMKV.mmkvWithID("portkey-sdk", MMKV.SINGLE_PROCESS_MODE, DEFAULT_CRYPTO_KEY).apply {
        allKeys()?.filter { it.contains("#") }?.forEach {
            removeValueForKey(it)
        }
    }

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

    fun setEnvironmentConfig(key: String, value: String) {
        if (!portkeyConfigKeyList.contains(key)) {
            throw IllegalArgumentException("key $key is not allowed to set")
        }
        writeString(key, value)
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

    fun clear(exceptStorageKey: List<String> = emptyList()) {
        if (!BuildConfig.IS_DEBUG) {
            Log.w(
                "PortkeyMMKVStorage",
                "clear() is only recommended to be called in debug mode, this will fully destroy and reset all of the SDK's data."
            )
        }
        portkeyMMKV.allKeys()?.filter { !exceptStorageKey.contains(it) }?.forEach {
            portkeyMMKV.removeValueForKey(it)
        }
    }

    @Synchronized
    internal fun writeString(key: String, value: String?) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    internal fun writeDouble(key: String, value: Double) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    internal fun writeInt(key: String, value: Int) {
        portkeyMMKV.encode(key, value)
    }

    @Synchronized
    internal fun writeBoolean(key: String, value: Boolean) {
        portkeyMMKV.encode(key, value)
    }

    internal fun remove(key: String) {
        portkeyMMKV.removeValueForKey(key)
    }

}
