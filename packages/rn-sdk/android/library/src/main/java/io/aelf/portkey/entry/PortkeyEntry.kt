package io.aelf.portkey.entry

import android.app.Activity
import android.content.Intent
import io.aelf.portkey.components.activities.DefaultReactActivity
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.navigation.NavigationHolder

fun usePortkeyRecovery(entry: String, callback: () -> Unit) {
    callback()
}

fun Activity.usePortkeyEntry(entryName:String){
    val intent = Intent(this, DefaultReactActivity::class.java)
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY,entryName)
    NavigationHolder.lastCachedIntent = intent
    startActivity(intent)
}


internal object ForwardEntryCallbackHolder {
    private var recoveryCallback: () -> Unit = {}
}
