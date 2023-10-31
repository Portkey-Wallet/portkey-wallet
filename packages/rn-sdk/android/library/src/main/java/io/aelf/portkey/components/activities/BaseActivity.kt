package io.aelf.portkey.components.activities

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import io.aelf.core.PortkeyEntries
import io.aelf.portkey.config.NO_CALLBACK_METHOD
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.native_modules.NativeWrapperModuleInstance
import io.aelf.portkey.native_modules.PORTKEY_CHOOSE_IMAGE_ACTION_CODE
import io.aelf.portkey.native_modules.PORTKEY_REQUEST_PERMISSION_ACTION_CODE
import io.aelf.portkey.navigation.NavigationHolder
import io.aelf.portkey.tools.generateUniqueCallbackID
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

abstract class BasePortkeyReactActivity : ReactActivity() {

    private var callbackId: String = NO_CALLBACK_METHOD
    private var callbackAccessed: Boolean = false

    private var permissionCallback: (Boolean) -> Unit = {}
    private var imageChooseCallback: (String?) -> Unit = {}

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        this.callbackId =
            intent.getStringExtra(StorageIdentifiers.PAGE_CALLBACK_ID) ?: NO_CALLBACK_METHOD
        NavigationHolder.pushNewComponent(this)
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        val containerId = generateUniqueCallbackID()
        return object : ReactActivityDelegate(
            this,
            null
        ) {
            override fun getLaunchOptions(): Bundle{
                val params =
                    (intent.getBundleExtra(StorageIdentifiers.PAGE_PARAMS)
                        ?: Bundle()).apply {
                        putString(StorageIdentifiers.PAGE_CONTAINER_ID, containerId)
                    }
                return params
            }
            override fun getMainComponentName(): String {
                return intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                    ?: PortkeyEntries.SCAN_QR_CODE_ENTRY.entryName
            }
            override fun onResume() {
                super.onResume()
                CoroutineScope(Dispatchers.IO).launch {
                    if (containerId.isEmpty()) return@launch
                    delay(200)
                    NativeWrapperModuleInstance?.sendGeneralEvent(
                        "onShow",
                        Arguments.createMap().apply {
                            this.putString("containerId", containerId)
                        })
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        navigateBackWithResult(thenFinish = false)
    }

    private fun getCallbackId(): String = callbackId

    fun navigateBackWithResult(result: ReadableMap? = null, thenFinish: Boolean = true) {
        if (!callbackAccessed) {
            callbackAccessed = true
            NavigationHolder.invokeAnnotatedCallback(getCallbackId(),result?.toWriteableNativeMap())
            NavigationHolder.popTopComponent()
        }
        if (thenFinish) {
            this.finish()
        }
    }

    fun setPermissionCallback(callback: (Boolean) -> Unit) {
        this.permissionCallback = callback
    }

    fun setImageChooseCallback(callback: (String?) -> Unit) {
        this.imageChooseCallback = callback
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (grantResults.isNotEmpty()) {
            this.permissionCallback(grantResults[0] == 0)
        } else {
            this.permissionCallback(false)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        when (requestCode) {
            PORTKEY_CHOOSE_IMAGE_ACTION_CODE -> {
                imageChooseCallback(data?.data?.toString())
            }

            PORTKEY_REQUEST_PERMISSION_ACTION_CODE -> {
                // Do nothing, as onRequestPermissionsResult() is declared
            }
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
    closeSelf: Boolean = false
) {
    if (closeSelf) {
        this.finish()
    }
    val intent = Intent(this, getReactActivityClass(entryName))
    intent.putExtra(
        StorageIdentifiers.PAGE_PARAMS, (params ?: Arguments.createMap()).toBundle(
            extraEntries = arrayOf(
                Pair(StorageIdentifiers.PAGE_FROM, from ?: ""),
                Pair(
                    StorageIdentifiers.TARGET_SCENE, targetScene ?: ""
                ),
                Pair(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId),
            )
        )
    )
    intent.putExtra(StorageIdentifiers.PAGE_FROM, from)
    intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY, entryName)
    intent.putExtra(StorageIdentifiers.TARGET_SCENE, targetScene)
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
        is List<*> -> {
            val isNumber = value.isEmpty() || value[0] is Number
            if (isNumber) {
                this.putDoubleArray(key, value.map { (it as Number).toDouble() }.toDoubleArray())
            } else {
                this.putStringArrayList(key, value.map { it.toString() } as ArrayList<String>)
            }
        }

        is Map<*, *> -> {
            throw IllegalArgumentException("Map(Object) type props is not supported in Android here.")
        }

        else -> this.putString(key, value.toString())
    }
    return this
}
