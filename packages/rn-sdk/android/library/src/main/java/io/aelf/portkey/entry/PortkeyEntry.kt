package io.aelf.portkey.entry

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import io.aelf.portkey.components.activities.DefaultReactActivity
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.navigation.NavigationHolder
import io.aelf.portkey.tools.generateUniqueCallbackID

fun usePortkeyRecovery(entry: String, callback: () -> Unit) {
    callback()
}

fun Activity.usePortkeyEntry(entryName: String, callback: (WritableMap) -> Unit = {}) {
    val intent = Intent(this, DefaultReactActivity::class.java)
    val callbackId = generateUniqueCallbackID()
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY, entryName)
    intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
    NavigationHolder.registerNativeCallback(callbackId, callback)
    startActivity(intent)
}
fun Activity.usePortkeyEntryWithParams(entryName: String, params: Bundle? = null, callback: (WritableMap) -> Unit = {}) {
    val intent = Intent(this, DefaultReactActivity::class.java)
    val callbackId = generateUniqueCallbackID()
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY, entryName)
    intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId)
    intent.putExtra(StorageIdentifiers.PAGE_PARAMS, params)
    NavigationHolder.registerNativeCallback(callbackId, callback)
    startActivity(intent)
}
