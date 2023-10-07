package io.aelf.core

internal enum class PortkeyEntries {
    TEST,
    LOGIN,
    GUARDIAN;
    internal val entryName: String
        get() = name.lowercase()
}
