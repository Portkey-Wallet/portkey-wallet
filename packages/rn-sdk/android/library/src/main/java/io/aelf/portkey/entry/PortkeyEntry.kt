package io.aelf.portkey.entry

fun usePortkeyRecovery(entry: String, callback: () -> Unit) {
    callback()
}

internal object ForwardEntryCallbackHolder {
    private var recoveryCallback: () -> Unit = {}
}
