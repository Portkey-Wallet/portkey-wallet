package finance.portkey.lib.tools

internal fun generateUniqueID(): String {
    return System.currentTimeMillis().toString() + Math.random().toString()
}

