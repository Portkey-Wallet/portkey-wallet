package finance.portkey.aar.wallet

import android.content.Context
import finance.portkey.lib.components.logic.PortkeyMMKVStorage
import finance.portkey.lib.components.logic.TEMP
import finance.portkey.lib.components.logic.but
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async

object PortkeyWallet {
    fun lockWallet(callback: () -> Unit) {
        PortkeyMMKVStorage.remove("walletConfig" but TEMP)
        callback()
    }

    suspend fun lockWallet(coroutineScope: CoroutineScope = CoroutineScope(Dispatchers.IO)): Boolean {
        return coroutineScope.async {
            PortkeyMMKVStorage.remove("walletConfig" but TEMP)
            true
        }.await()
    }

    fun exitWallet(context: Context, callback: (succeed: Boolean, reason: String?) -> Unit) {
        callJsMethod(
            applicationContext = context,
            taskName = "exitWallet",
            callback = {
                callback(it.status == "success", it.error?.toString())
            }
        )
    }
    fun releaseStore(context: Context, callback: (succeed: Boolean, reason: String?) -> Unit) {
        callJsMethod(
            applicationContext = context,
            taskName = "releaseStore",
            callback = {
                callback(it.status == "success", it.error?.toString())
            }
        )
    }
    fun isWalletExists(): Boolean {
        val walletConfig = PortkeyMMKVStorage.readString("walletConfig")
        return walletConfig?.isNotEmpty() ?: false
    }

    fun isWalletUnlocked(): Boolean {
        val tempWalletConfig = PortkeyMMKVStorage.readString("walletConfig" but TEMP)
        return tempWalletConfig?.isNotEmpty() ?: false
    }
}


