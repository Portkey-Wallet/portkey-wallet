package io.aelf.portkey.wallet

import io.aelf.portkey.components.logic.PortkeyMMKVStorage
import io.aelf.portkey.components.logic.TEMP
import io.aelf.portkey.components.logic.but

class PortkeyWallet {

}

internal fun isWalletUnlocked(): Boolean {
    val walletConfig = PortkeyMMKVStorage.readString("walletConfig" but TEMP)
    return walletConfig?.isNotEmpty() ?: false
}
