package io.aelf.portkey.activities

import com.facebook.react.ReactActivity
import io.aelf.core.PortkeyEntries
import io.aelf.portkey.config.StorageIdentifiers

internal abstract class BasePortkeyReactActivity : ReactActivity() {
    override fun getMainComponentName(): String = this.registerEntryName()
    abstract fun registerEntryName(): String
}

internal class DefaultReactActivity : BasePortkeyReactActivity() {
    private lateinit var entryName: String
    private lateinit var params: String
    init {
        val bundle = this.intent.getBundleExtra(StorageIdentifiers.PAGE_CONFIG)
        if (bundle != null) {
            this.entryName =
                bundle.getString(StorageIdentifiers.PAGE_ENTRY, PortkeyEntries.ENTRY.entryName)
        }
    }

    override fun registerEntryName(): String = this.entryName
}
