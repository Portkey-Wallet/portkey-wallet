package finance.portkey.lib.native_modules

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import finance.portkey.lib.navigation.NavigationHolder

const val PORTKEY_CHOOSE_IMAGE_ACTION_CODE = 999
const val PORTKEY_REQUEST_PERMISSION_ACTION_CODE = 998

class PermissionModule(private val reactApplicationContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactApplicationContext) {

    override fun getName(): String = "PermissionModule"

    @ReactMethod
    fun isPermissionGranted(name: String, promise: Promise) {
        if(name == "photo") {
            Log.w("PermissionModule", "You don't need to grant photo permission, since we use chooseImage() that uses Intent now.")
            promise.resolve(true)
            return
        }
        val permission = getPermissionType(name)
        if (permission != null) {
            val isGranted = ContextCompat.checkSelfPermission(
                reactApplicationContext,
                permission
            ) == PackageManager.PERMISSION_GRANTED
            promise.resolve(isGranted)
        } else {
            promise.reject(IllegalArgumentException("Invalid permission type"))
        }
    }

    @ReactMethod
    fun requestPermission(name: String, promise: Promise) {
        val permission = getPermissionType(name)
        if (permission != null) {
            if (ContextCompat.checkSelfPermission(
                    reactApplicationContext,
                    permission
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                promise.resolve(true)
            } else {
                try {
                    requestPermissions(arrayOf(permission)) {
                        promise.resolve(it)
                    }
                } catch (e: Throwable) {
                    promise.reject(e)
                }
            }
        } else {
            promise.reject(IllegalArgumentException("Invalid permission type"))
        }
    }

    @ReactMethod
    fun chooseImage(promise: Promise) {
        try {
            val activity = NavigationHolder.getTopComponent()
                ?: throw IllegalStateException("No activity found")
            val intent = Intent(Intent.ACTION_PICK)
            intent.type = "image/*"
            activity.startActivityForResult(intent, PORTKEY_CHOOSE_IMAGE_ACTION_CODE)
            activity.setImageChooseCallback {
                promise.resolve(it ?: "")
            }

        } catch (e: Throwable) {
            promise.reject(e)
        }
    }


    private fun getPermissionType(name: String): String? {
        return when (name) {
            "camera" -> Manifest.permission.CAMERA
//            "photo" -> Manifest.permission.READ_EXTERNAL_STORAGE
            "location" -> Manifest.permission.ACCESS_FINE_LOCATION
            "microphone" -> Manifest.permission.RECORD_AUDIO
            "storage" -> Manifest.permission.WRITE_EXTERNAL_STORAGE
            else -> null
        }
    }

    private fun requestPermissions(
        permissions: Array<String>,
        callback: ((Boolean) -> Unit) = {}
    ) {
        val activity = NavigationHolder.getTopComponent()
            ?: throw IllegalStateException("No activity found")
        ActivityCompat.requestPermissions(
            activity,
            permissions,
            PORTKEY_REQUEST_PERMISSION_ACTION_CODE
        )
        activity.setPermissionCallback(callback)
    }
}
