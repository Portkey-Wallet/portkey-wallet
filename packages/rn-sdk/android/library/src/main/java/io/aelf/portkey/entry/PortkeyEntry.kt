package io.aelf.portkey.entry

import android.app.Activity
import android.content.Intent
import io.aelf.portkey.activities.DefaultReactActivity
import io.aelf.portkey.config.StorageIdentifiers
import io.aelf.portkey.navigation.NavigationHolder

fun usePortkeyRecovery(entry: String, callback: () -> Unit) {
    callback()
}

fun Activity.usePortkeyTest(){
    val intent = Intent(this, DefaultReactActivity::class.java)
    intent.putExtra(StorageIdentifiers.PAGE_ENTRY,"test")
    NavigationHolder.lastCachedIntent = intent
    startActivity(intent)
}

internal object ForwardEntryCallbackHolder {
    private var recoveryCallback: () -> Unit = {}
}
