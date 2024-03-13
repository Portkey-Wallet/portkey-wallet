package finance.portkey.lib.entry

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.WritableMap
import finance.portkey.lib.components.activities.DefaultReactActivity
import finance.portkey.lib.config.StorageIdentifiers
import finance.portkey.lib.navigation.NavigationHolder
import finance.portkey.lib.tools.generateUniqueID

fun Activity.usePortkeyEntryWithParams(entryName: String, params: Bundle? = null, callback: (WritableMap) -> Unit = {}) {
    val intent = Intent(this, DefaultReactActivity::class.java)
    val callbackId = generateUniqueID()
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY, entryName)
    intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
    intent.putExtra(StorageIdentifiers.PAGE_PARAMS, params)
    NavigationHolder.registerNativeCallback(callbackId, callback)
    startActivity(intent)
}
