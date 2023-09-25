package io.aelf.portkey.activities

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import io.aelf.core.PortkeyEntries
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.navigation.NavigationHolder

abstract class BasePortkeyReactActivity : ReactActivity() {
    override fun getMainComponentName(): String = this.registerEntryName()

    private var entryName: String = PortkeyEntries.ENTRY.entryName
    private var params: Bundle = Bundle()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (intent != null) {
            this.entryName =
                intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                    ?: PortkeyEntries.ENTRY.entryName
            this.params = intent.getBundleExtra(StorageIdentifiers.PAGE_PARAMS) ?: Bundle()
        }
        NavigationHolder.pushNewComponent(this)
    }


    override fun createReactActivityDelegate(): ReactActivityDelegate {
        val componentName =
            NavigationHolder.lastCachedIntent?.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                ?: PortkeyEntries.ENTRY.entryName
        val params =
            NavigationHolder.lastCachedIntent?.getBundleExtra(StorageIdentifiers.PAGE_PARAMS)
                ?: Bundle()
        return object : ReactActivityDelegate(
            this,
            // in some cases, this will get null, so do not remove those code
            componentName
        ) {
            override fun getLaunchOptions(): Bundle = params
        }
    }

    fun registerEntryName(): String {
        return this.entryName
    }

    private fun getCallbackId(): String =
        this.params.getString(StorageIdentifiers.PAGE_CALLBACK_ID, NO_CALLBACK_METHOD)

    fun navigateBackWithResult(result: ReadableMap) {
        NavigationHolder.invokeAnnotatedCallback(getCallbackId()) {
            it.invoke(result.toWriteableNativeMap())
        }
        this.finish()
    }
}

private fun ReadableMap.toWriteableNativeMap(): WritableMap {
    return WritableNativeMap().apply {
        this.merge(this@toWriteableNativeMap)
    }
}

class DefaultReactActivity : BasePortkeyReactActivity()

internal fun getReactActivityClass(entry: String): Class<out BasePortkeyReactActivity> {
    return when (entry) {
        PortkeyEntries.ENTRY.entryName -> DefaultReactActivity::class.java
        else -> DefaultReactActivity::class.java
    }
}

internal fun BasePortkeyReactActivity.navigateToAnotherReactActivity(
    entryName: String,
    callbackId: String = NO_CALLBACK_METHOD,
    params: ReadableMap? = null,
    targetScene: String? = null,
    from: String? = null,
) {
    val intent = Intent(this, getReactActivityClass(entryName))
    if (params != null) {
        intent.putExtra(
            StorageIdentifiers.PAGE_PARAMS, params.toBundle(
                extraEntries = arrayOf(
                    Pair(StorageIdentifiers.PAGE_FROM, from ?: ""),
                    Pair(
                        StorageIdentifiers.TARGET_SCENE, targetScene ?: ""
                    ),
                    Pair(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
                )
            )
        )
    }
    intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY, entryName)
    intent.putExtra(StorageIdentifiers.TARGET_SCENE, targetScene)
    NavigationHolder.lastCachedIntent = intent
    startActivity(intent)
}

private fun ReadableMap.toBundle(extraEntries: Array<Pair<String, String>> = emptyArray()): Bundle {
    val bundle = Bundle()
    this.entryIterator.forEachRemaining {
        bundle.putWithType(it.key, it.value)
    }
    extraEntries.forEach {
        bundle.putWithType(it.first, it.second)
    }
    return bundle
}

/**
 * React Native only accept
 */
private fun Bundle.putWithType(key: String, value: Any): Bundle {
    when (value) {
        is String -> this.putString(key, value)
        is Int -> this.putInt(key, value)
        is Float -> this.putDouble(key, value.toDouble())
        is Double -> this.putDouble(key, value)
        is Boolean -> this.putBoolean(key, value)
        else -> this.putString(key, value.toString())
    }
    return this
}
