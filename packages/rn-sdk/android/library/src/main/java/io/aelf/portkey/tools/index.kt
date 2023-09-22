package io.aelf.portkey.tools

internal fun generateUniqueCallbackID(): String {
    return System.currentTimeMillis().toString() + Math.random().toString()
}
