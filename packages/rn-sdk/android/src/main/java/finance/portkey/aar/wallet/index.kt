package finance.portkey.aar.wallet

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import com.google.gson.JsonElement
import finance.portkey.aar.PortKeySDKHolder
import finance.portkey.lib.BuildConfig
import finance.portkey.lib.components.logic.JSEventBus
import finance.portkey.aar.services.GeneralJSMethodService
import finance.portkey.lib.tools.generateUniqueID

fun callCaContractMethodTest(applicationContext: Context, callback: (JSMethodData) -> Unit = {}) {
    val bundle = Bundle()
    bundle.putString("contractMethodName", "GetVerifierServers")
    bundle.putBoolean("isViewMethod", false)
    callJsMethod(applicationContext, "callCaContractMethod", bundle, callback)
}

fun runTestCases(applicationContext: Context, callback: (JSMethodData) -> Unit = {}) {
    val bundle = Bundle()
    callJsMethod(applicationContext, "runTestCases", bundle, callback)
}

internal fun callJsMethod(
    applicationContext: Context,
    taskName: String,
    bundle: Bundle = Bundle(),
    callback: (JSMethodData) -> Unit = {}
) {
    if(!PortKeySDKHolder.initialized){
        if(BuildConfig.DEBUG)
            Toast.makeText(
                applicationContext,
                "sdk is initializing...",
                Toast.LENGTH_LONG
            ).show()
        return
    }
    bundle.putString("taskName", taskName)
    val callbackId = generateUniqueID()
    bundle.putString("eventId", callbackId)
    JSEventBus.registerCallback(callbackId, callback, JSMethodData::class.java)
    val service = Intent(applicationContext, GeneralJSMethodService::class.java)
    service.putExtras(bundle)
    applicationContext.startService(service)
}

data class JSMethodData(
    val status: String, //  'success' | 'fail'
    val transactionId: String,
    val data: JsonElement?,
    val error: JsonElement?
)