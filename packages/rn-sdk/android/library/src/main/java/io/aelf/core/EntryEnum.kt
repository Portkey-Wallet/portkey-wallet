package io.aelf.core

internal enum class PortkeyEntries {
    ENTRY,
    LOGIN,
    GUARDIAN;
    internal val entryName: String
        get() = name.lowercase()
}
