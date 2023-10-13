package io.aelf.portkey.activities

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import io.aelf.core.PortkeyEntries
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.native_modules.NativeWrapperModule
import io.aelf.portkey.navigation.NavigationHolder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private fun generateCancelCallbackData(): WritableMap {
    return Arguments.createMap().apply {
        this.putString("status", "cancel")
        this.putString("data", "{}")
    }
}

abstract class BasePortkeyReactActivity : ReactActivity() {
    override fun getMainComponentName(): String = this.registerEntryName()

    private var entryName: String = PortkeyEntries.TEST.entryName
    private var callbackId: String = NO_CALLBACK_METHOD
    private var params: Bundle = Bundle()
    private var callbackAccessed: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (intent != null) {
            this.entryName =
                intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                    ?: PortkeyEntries.TEST.entryName
            this.params = intent.getBundleExtra(StorageIdentifiers.PAGE_PARAMS) ?: Bundle()
            this.callbackId =
                intent.getStringExtra(StorageIdentifiers.PAGE_CALLBACK_ID) ?: NO_CALLBACK_METHOD
        }
        NavigationHolder.pushNewComponent(
            this,
            NavigationHolder.lastCachedIntent?.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
        )
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        val componentName =
            NavigationHolder.lastCachedIntent?.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                ?: PortkeyEntries.TEST.entryName
        val params =
            NavigationHolder.lastCachedIntent?.getBundleExtra(StorageIdentifiers.PAGE_PARAMS)
                ?: Bundle()
        return object : ReactActivityDelegate(
            this,
            // in some cases, this will get null, so do not remove those code
            componentName
        ) {
            override fun getLaunchOptions(): Bundle = params

            private fun getRootTag(): Int {
                val reflectReactDelegateClass = ReactActivityDelegate::class.java
                val mReactDelegateField =
                    reflectReactDelegateClass.getDeclaredField("mReactDelegate")
                mReactDelegateField.isAccessible = true
                val reactDelegate = mReactDelegateField.get(this) as ReactDelegate
                return reactDelegate.reactRootView?.rootViewTag ?: -1
            }

            override fun onResume() {
                super.onResume()
                CoroutineScope(Dispatchers.IO).launch {
                    delay(200)
                    NativeWrapperModule.instance?.sendGeneralEvent(
                        "onShow",
                        Arguments.createMap().apply {
                            this.putInt("rootTag", getRootTag())
                        })
                }
            }

            override fun onDestroy() {
                super.onDestroy()
                navigateBackWithResult(thenFinish = false)
            }
        }
    }

    fun registerEntryName(): String {
        return this.entryName
    }

    private fun getCallbackId(): String = callbackId

    fun navigateBackWithResult(result: ReadableMap? = null, thenFinish: Boolean = true) {
        if (!callbackAccessed) {
            callbackAccessed = true
            NavigationHolder.invokeAnnotatedCallback(getCallbackId()) {
                if (result != null) {
                    it.invoke(result.toWriteableNativeMap())
                } else {
                    it.invoke(generateCancelCallbackData())
                }
            }
        }
        if (thenFinish) {
            this.finish()
        }
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
        PortkeyEntries.TEST.entryName -> DefaultReactActivity::class.java
        else -> DefaultReactActivity::class.java
    }
}

@Synchronized
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
private fun Bundle.putWithType(key: String, value: Any?): Bundle {
    if (value == null) return this
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
