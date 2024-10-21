package com.portkey.finance

import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.portkey.finance.native_modules.PortkeyHeadlessJsTaskService

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "PortkeyApp"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onStop() {
        super.onStop()
        try {
            val service = Intent(
                applicationContext,
                PortkeyHeadlessJsTaskService::class.java
            )
            val bundle = Bundle()

            bundle.putString("portkey", "finance")
            service.putExtras(bundle)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // start the foreground service
                ContextCompat.startForegroundService(this, service)
                //        getApplicationContext().startForegroundService(service);
            } else {
                this.startService(service)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
