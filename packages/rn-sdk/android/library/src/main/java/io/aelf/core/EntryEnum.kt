package io.aelf.core

enum class PortkeyEntries {
    TEST, SCAN_QR_CODE_ENTRY;
    val entryName: String
        get() = name.lowercase()
}
