package io.aelf.portkey.tools

import android.content.Context
import android.content.Intent
import android.os.Bundle
import io.aelf.portkey.components.logic.JSEventBus
import io.aelf.portkey.components.services.GeneralJSMethodService
import org.json.JSONObject

internal fun generateUniqueCallbackID(): String {
    return System.currentTimeMillis().toString() + Math.random().toString()
}


fun startJSBackgroundTaskTest(applicationContext: Context, callback: (JSMethodData) -> Unit = {}) {
    val taskName = "callCaContractMethod"
    val service = Intent(applicationContext, GeneralJSMethodService::class.java)
    val bundle = Bundle()
    val callbackId = generateUniqueCallbackID()
    bundle.putString("taskName", taskName)
    bundle.putString(
        "params", JSONObject().put("methodName", "GetContractAddressByName")
            .put(
                "params",
                JSONObject().put("name", "AElf.ContractNames.CrossChain").toString()
            ).put("eventId", callbackId)
            .toString()
    )
    service.putExtras(bundle)
    JSEventBus.registerCallback(callbackId, callback, JSMethodData::class.java)
    applicationContext.startService(service)
}

data class JSMethodData(
    val methodName: String,
    val extraData: String,
    val eventId: String
)
