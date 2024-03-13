package finance.portkey.lib.components.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import finance.portkey.lib.config.NO_CALLBACK_METHOD
import finance.portkey.lib.config.StorageIdentifiers
import finance.portkey.lib.native_modules.NativeWrapperModuleInstance
import finance.portkey.lib.native_modules.PORTKEY_CHOOSE_IMAGE_ACTION_CODE
import finance.portkey.lib.native_modules.PORTKEY_REQUEST_PERMISSION_ACTION_CODE
import finance.portkey.lib.navigation.NavigationHolder
import finance.portkey.lib.tools.generateUniqueID
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
        val pageEntry = intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
            ?: finance.portkey.core.PortkeyEntries.SCAN_QR_CODE_ENTRY.entryName
        NavigationHolder.pushNewComponent(this, pageEntry)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        val paramsBundle = intent?.getBundleExtra(StorageIdentifiers.PAGE_PARAMS)
        val params = Arguments.fromBundle(paramsBundle)
        reactInstanceManager.currentReactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(
                "onNewIntent", params
            )
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        val containerId = generateUniqueID()
        return object : ReactActivityDelegate(
            this,
            null
        ) {
            override fun getLaunchOptions(): Bundle {
                val params =
                    (intent.getBundleExtra(StorageIdentifiers.PAGE_PARAMS)
                        ?: Bundle()).apply {
                        putString(StorageIdentifiers.PAGE_CONTAINER_ID, containerId)
                    }
                return params
            }

            override fun getMainComponentName(): String {
                return intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
                    ?: finance.portkey.core.PortkeyEntries.SCAN_QR_CODE_ENTRY.entryName
            }

            override fun onResume() {
                super.onResume()
                CoroutineScope(Dispatchers.IO).launch {
                    if (containerId.isEmpty()) return@launch
                    delay(200)
                    NativeWrapperModuleInstance?.sendGeneralEvent(
                        "onShow",
                        Arguments.createMap().apply {
                            this.putString(StorageIdentifiers.PAGE_CONTAINER_ID, containerId)
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
            NavigationHolder.popTopComponent()
            NavigationHolder.invokeAnnotatedCallback(
                getCallbackId(),
                result?.toWriteableNativeMap()
            )
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
        finance.portkey.core.PortkeyEntries.SIGN_IN_ENTRY.entryName -> DefaultReactActivity::class.java
        else -> DefaultReactActivity::class.java
    }
}

@Synchronized
internal fun Activity.navigateToAnotherReactActivity(
    entryName: String,
    callbackId: String = NO_CALLBACK_METHOD,
    params: ReadableMap? = null,
    targetScene: String? = null,
    from: String? = null,
) {
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

fun ReadableMap.toBundle(extraEntries: Array<Pair<String, String>> = emptyArray()): Bundle {
    return (Arguments.toBundle(this) ?: Bundle()).apply {
        extraEntries.forEach {
            this.putString(it.first, it.second)
        }
    }
}
