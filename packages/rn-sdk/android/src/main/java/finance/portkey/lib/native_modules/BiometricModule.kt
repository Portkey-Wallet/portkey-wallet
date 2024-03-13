@file:OptIn(DelicateCoroutinesApi::class)

package finance.portkey.lib.native_modules

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.UiThread
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.exception.UnexpectedException
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.util.concurrent.Executor
import java.util.concurrent.Executors


private const val AUTHENTICATION_TYPE_FINGERPRINT = 1
private const val AUTHENTICATION_TYPE_FACIAL_RECOGNITION = 2
private const val AUTHENTICATION_TYPE_IRIS = 3
private const val SECURITY_LEVEL_NONE = 0
private const val SECURITY_LEVEL_SECRET = 1
private const val SECURITY_LEVEL_BIOMETRIC = 2
private const val DEVICE_CREDENTIAL_FALLBACK_CODE = 6

class BiometricModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule() {
    private val biometricManager by lazy { BiometricManager.from(context) }
    private var authOptions: AuthOptions? = null
    private var isAuthenticating = false
    private var promise: Promise? = null
    private var biometricPrompt: BiometricPrompt? = null
    private var isRetryingWithDeviceCredentials = false
    private val TAG = "BiometricModule"
    private val keyguardManager: KeyguardManager
        get() = context.applicationContext.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
    private val packageManager by lazy { context.applicationContext.packageManager }
    private val isDeviceSecure: Boolean
        get() =
            keyguardManager.isDeviceSecure
    private val mActivityEventListener: ActivityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) {
                if (requestCode == DEVICE_CREDENTIAL_FALLBACK_CODE) {
                    if (resultCode == Activity.RESULT_OK) {
                        promise?.resolve(createResponse())
                    } else {
                        promise?.resolve(
                            createResponse(
                                error = "user_cancel",
                                warning = "Device Credentials canceled"
                            )
                        )
                    }

                    isAuthenticating = false
                    isRetryingWithDeviceCredentials = false
                    biometricPrompt = null
                    promise = null
                    authOptions = null
                } else if (activity is FragmentActivity) {
                    // If the user uses PIN as an authentication method, the result will be passed to the `onActivityResult`.
                    // Unfortunately, react-native doesn't pass this value to the underlying fragment - we won't resolve the promise.
                    // So we need to do it manually.
                    val fragment =
                        activity.supportFragmentManager.findFragmentByTag("androidx.biometric.BiometricFragment")
                    fragment?.onActivityResult(requestCode and 0xffff, resultCode, data)
                }
            }
        }

    init {
        context.addActivityEventListener(mActivityEventListener)
        context.addLifecycleEventListener(object : LifecycleEventListener {
            override fun onHostResume() {
                println("$TAG ${context.currentActivity.toString()} onHostResume")
            }

            override fun onHostPause() {
                println("$TAG ${context.currentActivity.toString()} onHostPause")
            }

            override fun onHostDestroy() {
                println("$TAG ${context.currentActivity.toString()} onHostDestroy")
            }

        });
    }

    private val authenticationCallback: BiometricPrompt.AuthenticationCallback =
        object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                isAuthenticating = false
                isRetryingWithDeviceCredentials = false
                biometricPrompt = null
                promise?.resolve(
                    Arguments.fromBundle(Bundle().apply {
                        putBoolean("success", true)
                    })
                )
                promise = null
                authOptions = null
            }

            override fun onAuthenticationError(errMsgId: Int, errString: CharSequence) {
                // Make sure to fallback to the Device Credentials if the Biometrics hardware is unavailable.
                if (isBiometricUnavailable(errMsgId) && isDeviceSecure && !isRetryingWithDeviceCredentials) {
                    val options = authOptions

                    if (options != null) {
                        val disableDeviceFallback = options.disableDeviceFallback

                        // Don't run the device credentials fallback if it's disabled.
                        if (!disableDeviceFallback) {
                            promise?.let {
                                isRetryingWithDeviceCredentials = true
                                promptDeviceCredentialsFallback(options, it)
                                return
                            }
                        }
                    }
                }

                isAuthenticating = false
                isRetryingWithDeviceCredentials = false
                biometricPrompt = null
                promise?.resolve(
                    createResponse(
                        error = convertErrorCode(errMsgId),
                        warning = errString.toString()
                    )
                )
                promise = null
                authOptions = null
            }
        }

    fun hasSystemFeature(feature: String) = packageManager.hasSystemFeature(feature)
    override fun getName(): String = "BiometricModule"
    fun canAuthenticateUsingWeakBiometrics(): Int =
        biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)

    @ReactMethod
    fun isEnrolledAsync(promise: Promise) {
        promise.resolve(canAuthenticateUsingWeakBiometrics() == BiometricManager.BIOMETRIC_SUCCESS);
    }

    @ReactMethod
    fun hasHardwareAsync(promise: Promise) {
        promise.resolve(canAuthenticateUsingWeakBiometrics() != BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE)
    }

    @ReactMethod
    fun getEnrolledLevelAsync(promise: Promise) {
        var level = SECURITY_LEVEL_NONE
        if (isDeviceSecure) {
            level = SECURITY_LEVEL_SECRET
        }
        if (canAuthenticateUsingWeakBiometrics() == BiometricManager.BIOMETRIC_SUCCESS) {
            level = SECURITY_LEVEL_BIOMETRIC
        }
        promise.resolve(level)
    }

    @ReactMethod
    fun bioAuthenticateAsync(params: ReadableMap, promise: Promise) {
        val promptMessage = params.getString("promptMessage") ?: "Authenticate"
        val cancelLabel = params.getString("cancelLabel") ?: "Cancel authorization"
        val disableDeviceFallback = params.getBoolean("disableDeviceFallback")
        val requireConfirmation = params.getBoolean("requireConfirmation")
        val options =
            AuthOptions(promptMessage, cancelLabel, disableDeviceFallback, requireConfirmation)
        val currentActivity = context.currentActivity
        val fragmentActivity = currentActivity as? FragmentActivity
        if (fragmentActivity == null) {
            promise.reject(Exceptions.MissingActivity())
            Log.e(
                TAG,
                "BiometricVerify failed: If you mean to use biometric, please make sure the context that Compose" +
                        "lives in is a FragmentActivity.\n" +
                        "It's simple: just make your Activity extends from FragmentActivity instead of other Activity class."
            )
            return
        }
        if (!keyguardManager.isDeviceSecure) {
            promise.resolve(
                createResponse(
                    error = "not_enrolled",
                    warning = "KeyguardManager#isDeviceSecure() returned false"
                )
            )
            return
        }

        this@BiometricModule.authOptions = options

        // BiometricPrompt callbacks are invoked on the main thread so also run this there to avoid
        // having to do locking.
        GlobalScope.launch(Dispatchers.Main) {
            authenticate(fragmentActivity, options, promise)
        }
    }

    @UiThread
    private fun authenticate(
        fragmentActivity: FragmentActivity,
        options: AuthOptions,
        promise: Promise
    ) {
        println("$TAG $fragmentActivity authenticate")
        if (isAuthenticating) {
            this.promise?.resolve(
                createResponse(
                    error = "app_cancel"
                )
            )
            this.promise = promise
            return
        }

        val promptMessage = options.promptMessage
        val cancelLabel = options.cancelLabel
        val disableDeviceFallback = options.disableDeviceFallback
        val requireConfirmation = options.requireConfirmation

        isAuthenticating = true
        this.promise = promise
        val executor: Executor = Executors.newSingleThreadExecutor()
        biometricPrompt = BiometricPrompt(fragmentActivity, executor, authenticationCallback)
        val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder().apply {
            setTitle(promptMessage)

            if (disableDeviceFallback) {
                setNegativeButtonText(cancelLabel)
            } else {
                setAllowedAuthenticators(
                    BiometricManager.Authenticators.BIOMETRIC_WEAK
                            or BiometricManager.Authenticators.DEVICE_CREDENTIAL
                )
            }
            setConfirmationRequired(requireConfirmation)
        }
        try {
            val promptInfo = promptInfoBuilder.build()
            biometricPrompt!!.authenticate(promptInfo)
        } catch (e: NullPointerException) {
            isAuthenticating = false
            promise.reject(
                UnexpectedException(
                    "Canceled authentication due to an internal error",
                    e
                )
            )
        }
    }

    @ReactMethod
    private fun cancelAuthenticate(promise: Promise) {
        GlobalScope.launch(Dispatchers.Main) {
            biometricPrompt?.cancelAuthentication()
            isAuthenticating = false
        }
    }

    @ReactMethod
    private fun supportedAuthenticationTypesAsync(promise: Promise) {
        val results = mutableSetOf<Int>()
        if (canAuthenticateUsingWeakBiometrics() == BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE) {
            promise.resolve(results)
        }

        // note(cedric): replace hardcoded system feature strings with constants from
        // PackageManager when dropping support for Android SDK 28
        results.apply {
            if (hasSystemFeature("android.hardware.fingerprint")) {
                add(AUTHENTICATION_TYPE_FINGERPRINT)
            }
            if (hasSystemFeature("android.hardware.biometrics.face")) {
                add(AUTHENTICATION_TYPE_FACIAL_RECOGNITION)
            }
            if (hasSystemFeature("android.hardware.biometrics.iris")) {
                add(AUTHENTICATION_TYPE_IRIS)
            }
            if (hasSystemFeature("com.samsung.android.bio.face")) {
                add(AUTHENTICATION_TYPE_FACIAL_RECOGNITION)
            }
        }
        promise.resolve(results)
    }

    private fun createResponse(
        error: String? = null,
        warning: String? = null
    ) = Arguments.fromBundle(Bundle().apply {
        putBoolean("success", error == null)
        error?.let {
            putString("error", it)
        }
        warning?.let {
            putString("warning", it)
        }
    })

    private fun isBiometricUnavailable(code: Int): Boolean {
        return when (code) {
            BiometricPrompt.ERROR_HW_NOT_PRESENT,
            BiometricPrompt.ERROR_HW_UNAVAILABLE,
            BiometricPrompt.ERROR_NO_BIOMETRICS,
            BiometricPrompt.ERROR_UNABLE_TO_PROCESS,
            BiometricPrompt.ERROR_NO_SPACE -> true

            else -> false
        }
    }

    private fun promptDeviceCredentialsFallback(options: AuthOptions, promise: Promise) {
        val fragmentActivity = currentActivity as FragmentActivity?
        if (fragmentActivity == null) {
            promise.resolve(
                createResponse(
                    error = "not_available",
                    warning = "getCurrentActivity() returned null"
                )
            )
            return
        }

        val promptMessage = options.promptMessage
        val requireConfirmation = options.requireConfirmation

        // BiometricPrompt callbacks are invoked on the main thread so also run this there to avoid
        // having to do locking.
        GlobalScope.launch(Dispatchers.Main) {
            // On Android devices older than 11, we need to use Keyguard to unlock by Device Credentials.
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                val credentialConfirmationIntent =
                    keyguardManager.createConfirmDeviceCredentialIntent(promptMessage, "")
                fragmentActivity.startActivityForResult(
                    credentialConfirmationIntent,
                    DEVICE_CREDENTIAL_FALLBACK_CODE
                )
                return@launch
            }

            val executor: Executor = Executors.newSingleThreadExecutor()
            val localBiometricPrompt =
                BiometricPrompt(fragmentActivity, executor, authenticationCallback)

            biometricPrompt = localBiometricPrompt

            val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder().apply {
                setTitle(promptMessage)
                setAllowedAuthenticators(BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                setConfirmationRequired(requireConfirmation)
            }

            val promptInfo = promptInfoBuilder.build()
            try {
                localBiometricPrompt.authenticate(promptInfo)
            } catch (e: NullPointerException) {
                promise.reject(
                    UnexpectedException(
                        "Canceled authentication due to an internal error",
                        e
                    )
                )
            }
        }
    }

    private fun convertErrorCode(code: Int): String {
        return when (code) {
            BiometricPrompt.ERROR_CANCELED, BiometricPrompt.ERROR_NEGATIVE_BUTTON, BiometricPrompt.ERROR_USER_CANCELED -> "user_cancel"
            BiometricPrompt.ERROR_HW_NOT_PRESENT, BiometricPrompt.ERROR_HW_UNAVAILABLE, BiometricPrompt.ERROR_NO_BIOMETRICS, BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL -> "not_available"
            BiometricPrompt.ERROR_LOCKOUT, BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "lockout"
            BiometricPrompt.ERROR_NO_SPACE -> "no_space"
            BiometricPrompt.ERROR_TIMEOUT -> "timeout"
            BiometricPrompt.ERROR_UNABLE_TO_PROCESS -> "unable_to_process"
            else -> "unknown"
        }
    }
}

class AuthOptions(
    @Field val promptMessage: String,
    @Field val cancelLabel: String,
    @Field val disableDeviceFallback: Boolean,
    @Field val requireConfirmation: Boolean
) : Record
