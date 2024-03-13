package finance.portkey.demo.ui.composable

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.ClipboardManager
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import finance.portkey.demo.BigButton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


internal object PortkeyDialogController {

    private var isActive by mutableStateOf(false)
    private var dialogProps by mutableStateOf(DialogProps())

    private fun isBusy(): Boolean {
        return isActive
    }

    internal fun show(dialogProps: DialogProps) {
        if (isBusy()) {
            Log.e(
                "Portkey.Dialog",
                "Dialog is busy, and we have to override your last operation," +
                        " better check it by isBusy() first."
            )
        }
        PortkeyDialogController.dialogProps = dialogProps
        isActive = true
    }


    internal fun showSuccess(text: String) {
        show(
            DialogProps().apply {
                mainTitle = "Operation Success"
                subTitle = text
                useSingleConfirmButton = true
            }
        )
    }

    internal fun showFail(
        text: String,
        negativeButtonText: String = "Cancel",
        negativeCallback: () -> Unit = {}
    ) {
        show(
            DialogProps().apply {
                mainTitle = "Fail!"
                subTitle = text
                positiveText = "OK"
                this.negativeText = negativeButtonText
                this.negativeCallback = negativeCallback
            }
        )
    }

    private fun hide() {
        isActive = false
    }

    @Composable
    fun PortkeyDialog() {
        if (isActive) {
            val fadeInAlpha by animateFloatAsState(
                targetValue = if (isActive) 1f else 0f,
                animationSpec = tween(durationMillis = 1000, easing = FastOutLinearInEasing),
                label = "dialog"
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.5f))
                    .pointerInput(Unit) { }
                    .zIndex(ZIndexConfig.Dialog.getZIndex())
                    .alpha(fadeInAlpha),
                contentAlignment = Alignment.Center
            ) {
                DialogBody()
            }
        }

    }

    @Composable
    private fun DialogBody() {
        val scrollState = rememberScrollState()
        val clipboardManager: ClipboardManager = LocalClipboardManager.current
        val context: Context = LocalContext.current
        Column(
            modifier = Modifier
                .width(wrapperStyle.width)
                .wrapContentHeight(Alignment.CenterVertically)
                .clip(RoundedCornerShape(8.dp))
                .background(Color.White),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier
                    .padding(
                        top = 24.dp,
                        bottom = 16.dp
                    )
                    .width(288.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = dialogProps.mainTitle,
                    modifier = Modifier
                        .padding(bottom = 8.dp),
                    style = TextStyle(
                        fontSize = 16.sp,
                        color = Color(0xFF162736),
                        lineHeight = 24.sp,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight(700)
                    ),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                BoxWithConstraints(
                    modifier = Modifier
                        .padding(top = 8.dp, bottom = 8.dp)
                        .width(dynamicWidth())
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color.LightGray.copy(alpha = 0.5F))
                        .wrapContentHeight(Alignment.CenterVertically),
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = dynamicHeight(0.5))
                            .verticalScroll(
                                state = scrollState
                            )
                            .pointerInput(Unit) {
                                detectTapGestures(
                                    onLongPress = {
                                        clipboardManager.setText(AnnotatedString(dialogProps.subTitle))
                                        Toast
                                            .makeText(context, "text copied.", Toast.LENGTH_LONG)
                                            .show()
                                    }
                                )
                            }
                    ) {
                        Text(
                            text = dialogProps.subTitle,
                            style = TextStyle(
                                fontSize = 14.sp,
                                color = Color(0xFF414852),
                                lineHeight = 22.sp,
                                textAlign = TextAlign.Center,
                                fontWeight = FontWeight(400),
                            ),
                            overflow = TextOverflow.Visible,
                        )
                    }
                }
            }
            Buttons()
        }
    }

    @Composable
    private fun Buttons() {
        Row(
            modifier = Modifier
                .width(288.dp)
                .wrapContentHeight(Alignment.CenterVertically)
                .background(Color.White)
                .padding(
                    top = 0.dp,
                    bottom = 24.dp
                ),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (dialogProps.useSingleConfirmButton) {
                HugeButton(
                    config = ButtonConfig().apply {
                        text = dialogProps.positiveText
                        onClick = {
                            hide()
                            dialogProps.positiveCallback()
                        }
                    }
                )
            } else {
                MediumButton(config = ButtonConfig().apply {
                    text = dialogProps.negativeText
                    onClick = {
                        hide()
                        dialogProps.negativeCallback()
                    }
                    bgColor = Color.White
                    textColor = Color(0xFF414852)
                    borderWidth = 1.dp
                })
                MediumButton(config = ButtonConfig().apply {
                    text = dialogProps.positiveText
                    onClick = {
                        hide()
                        dialogProps.positiveCallback()
                    }
                })
            }
        }
    }

}

open class DialogProps {
    var mainTitle: String = "Continue ?"
    var subTitle: String = "Are you sure you want to continue ?"
    var positiveText: String = "Confirm"
    var negativeText: String = "Cancel"
    var positiveCallback: (() -> Unit) = {}
    var negativeCallback: (() -> Unit) = {}
    var useSingleConfirmButton: Boolean = false
}


@Preview
@Composable
private fun DialogPreview() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    fun showToast(msg: String) {
        scope.launch(Dispatchers.Main) {
            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
        }
    }

    val dialogProps = remember {
        DialogProps().apply {
            positiveCallback = {
                showToast("positiveCallback")
            }
            negativeCallback = {
                showToast("negativeCallback")
            }
        }
    }
    BigButton(text = "Show Dialog") {
        PortkeyDialogController.show(dialogProps = dialogProps)
    }
    PortkeyDialogController.PortkeyDialog()
}
