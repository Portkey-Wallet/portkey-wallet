package io.aelf.portkey.tools

import android.content.Context
import android.content.Intent
import android.os.Bundle
import io.aelf.portkey.components.logic.JSEventBus
import io.aelf.portkey.components.services.GeneralJSMethodService

internal fun generateUniqueCallbackID(): String {
    return System.currentTimeMillis().toString() + Math.random().toString()
}


fun startJSBackgroundTaskTest(applicationContext: Context, callback: (JSMethodData) -> Unit = {}) {
    val methodName = "callContractMethod"
    val service = Intent(applicationContext, GeneralJSMethodService::class.java)
    val bundle = Bundle()
    val callbackId = generateUniqueCallbackID()
    bundle.putString("methodName", methodName)
    bundle.putString("eventId", callbackId)
    service.putExtras(bundle)
    JSEventBus.registerCallback(callbackId, callback, JSMethodData::class.java)
    applicationContext.startService(service)
}

data class JSMethodData(
    val data: Any
)
