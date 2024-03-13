package finance.portkey.demo.ui.composable

import android.animation.ValueAnimator
import android.util.Log
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.zIndex
import com.airbnb.lottie.LottieAnimationView
import finance.portkey.demo.R
import finance.portkey.demo.ui.composable.Loading.loadingState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

const val DEFAULT_LOADING_TEXT = "Loading..."

internal object Loading {
    internal val loadingState = LoadingState()
    private val lottieStyle = Style().apply {
        width = 44.dp
        height = 44.dp
    }

    @Composable
    private fun LoadingComponent(
        animationRes: Int,
        text: String,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            // if .clip() is set behind .background(), the background will not be clipped
            modifier = Modifier
                .clip(
                    RoundedCornerShape(8.dp)
                )
                .background(Color(0xFFFCFCFF))
                .width(wrapperStyle.width)
                .height(wrapperStyle.height),
            verticalArrangement = Arrangement.Center
        ) {
            LottieAnimationComponent(animationRes = animationRes, style = lottieStyle)
            Text(
                text = text,
                style = TextStyle(
                    fontSize = 14.sp,
                    color = Color(0xFF414852),
                    fontWeight = FontWeight(400),
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .padding(vertical = 8.dp)
                    .width(dynamicWidth(paddingHorizontal = 20)),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }

    private fun clearUp() {
        loadingState.isShow = false
        loadingState.loadingText = DEFAULT_LOADING_TEXT
    }

    @Composable
    private fun LottieAnimationComponent(animationRes: Int, style: Style, loop: Boolean = true) {
        AndroidView(
            factory = { context ->
                LottieAnimationView(context).apply {
                    setAnimation(animationRes)
                    repeatCount = if (loop) ValueAnimator.INFINITE else 0
                    playAnimation()
                }
            },
            modifier = Modifier
                .width(style.width)
                .height(style.height)
        )
    }

    internal fun showLoading(text: String = DEFAULT_LOADING_TEXT, duration: Long = 30 * 1000L) {
        loadingState.isShow = true
        loadingState.loadingText = text
        if (duration > 0L) {
            CoroutineScope(Dispatchers.IO).launch {
                delay(duration)
                hideLoading()
            }
        }
    }

    internal fun hideLoading(duration: Long = 0L) {
        CoroutineScope(Dispatchers.IO).launch {
            delay(duration)
            clearUp()
        }
    }

    @Composable
    fun PortkeyLoading() {
        if (loadingState.isShow) {
            val fadeInAlpha by animateFloatAsState(
                targetValue = if (loadingState.isShow) 1f else 0f,
                animationSpec = tween(durationMillis = 1000, easing = FastOutLinearInEasing),
                label = "loading"
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.5f))
                    .zIndex(ZIndexConfig.Loading.getZIndex())
                    .pointerInput(Unit) { }
                    .alpha(fadeInAlpha),
                contentAlignment = Alignment.Center
            ) {
                LoadingComponent(
                    R.raw.loading,
                    loadingState.loadingText,
                )
            }
        }
    }
}

internal class LoadingState {
    var isShow by mutableStateOf(false)
    var loadingText by mutableStateOf(DEFAULT_LOADING_TEXT)
}

@Preview
@Composable
private fun LoadingComponentPreview() {
    val scope = rememberCoroutineScope()
    Loading.PortkeyLoading()
    Row {
        TextButton(onClick = {
            scope.launch {
                Loading.showLoading(DEFAULT_LOADING_TEXT)
            }
        }) {
            Text("Show loading")
        }
        TextButton(onClick = {
            scope.launch {
                Loading.hideLoading()
            }
        }) {
            Text("Hide loading")
        }
        UseEffect(loadingState.isShow) {
            Log.e("Portkey.Loading", "useEffect")
        }
        UseComponentWillUnmount {
            Log.e("Portkey.Loading", "useComponentWillUnmount")
        }
    }
}
