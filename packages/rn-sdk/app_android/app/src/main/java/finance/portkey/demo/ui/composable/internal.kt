package finance.portkey.demo.ui.composable

import android.graphics.Rect
import android.os.Build
import android.view.ViewTreeObserver
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.LocalOnBackPressedDispatcherOwner
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.isImeVisible
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

open class Style {
    var marginLeft: Dp = 0.dp
    var marginRight: Dp = 0.dp
    var marginTop: Dp = 0.dp
    var marginBottom: Dp = 0.dp
    var paddingLeft: Dp = 0.dp
    var paddingRight: Dp = 0.dp
    var paddingTop: Dp = 0.dp
    var paddingBottom: Dp = 0.dp
    var width: Dp = 0.dp
    var height: Dp = 0.dp
    var backgroundColor: Color = Color.Black
    var size: Dp = 0.dp
    var text: String = ""
    var textColor: Color = Color.Black
    var bgImage: String = "undefined"
}

enum class ZIndexConfig(private val z: Float) {
    Loading(100f),
    Dialog(50f),
    SubIcon(18f),
    MainIcon(15f),
    Modal(10f);

    internal fun getZIndex(): Float {
        return z
    }
}

@Composable
internal fun dynamicWidth(paddingHorizontal: Int = 0): Dp {
    return (LocalConfiguration.current.screenWidthDp - 2 * paddingHorizontal).dp
}

@Composable
internal fun dynamicHeight(times: Double = 1.0): Dp {
    return (LocalConfiguration.current.screenHeightDp * times).dp
}


fun dpOrDefault(inputDp: Dp?, defaultDp: Dp): Dp {
    return inputDp ?: defaultDp
}

internal val wrapperStyle = Style().apply {
    width = 320.dp
    height = 136.dp
}

@Composable
fun UseComponentDidMount(callback: () -> Unit) {
    LaunchedEffect(Unit) {
        callback()
    }
}

@Composable
fun UseEffect(vararg dependency: Any?, callback: () -> Unit) {
    val den: Any = if (dependency.isEmpty()) Unit else dependency
    LaunchedEffect(den) {
        callback()
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun useKeyboardVisibleState(): State<Boolean> {
    val keyboardVisible = remember {
        mutableStateOf(false)
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        val view = LocalView.current
        DisposableEffect(view) {
            val onKeyboardChangeListener = ViewTreeObserver.OnGlobalLayoutListener {
                val rect = Rect()
                view.getWindowVisibleDisplayFrame(rect)
                val screenHeight = view.rootView.height
                val keypadHeight = screenHeight - rect.bottom
                keyboardVisible.value = keypadHeight > screenHeight * 0.15
            }
            view.viewTreeObserver.addOnGlobalLayoutListener(onKeyboardChangeListener)
            onDispose {
                view.viewTreeObserver.removeOnGlobalLayoutListener(onKeyboardChangeListener)
            }
        }
    } else {
        keyboardVisible.value = WindowInsets.isImeVisible
    }
    return keyboardVisible
}

@Composable
fun UseComponentWillUnmount(callback: () -> Unit) {
    DisposableEffect(Unit) {
        onDispose {
            callback()
        }
    }
}

@Composable
fun UseAndroidBackButtonSettings(callback: () -> Unit) {
    val backPressCallback = remember {
        return@remember object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                callback()
            }
        }
    }
    val dispatcher = LocalOnBackPressedDispatcherOwner.current?.onBackPressedDispatcher
    DisposableEffect(key1 = Unit, effect = {
        dispatcher?.addCallback(backPressCallback)
        onDispose {
            backPressCallback.remove()
        }
    })
}

