package finance.portkey.demo.ui.composable

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex

@Composable
fun HugeButton(
    config: ButtonConfig,
    enable: Boolean = true,
    icon: IconConfig? = null,
) {
    Box(
        modifier = Modifier
            .height(50.dp)
            .width(dpOrDefault(dynamicWidth(20), 320.dp))
    ) {
        if (icon != null && icon.iconResId != 0) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .zIndex(ZIndexConfig.MainIcon.getZIndex()),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start
            ) {
                val paddingLeft = icon.paddingLeft
                if (paddingLeft > 0) {
                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .width(paddingLeft.dp)
                    )
                }
                Icon(
                    painter = painterResource(id = icon.iconResId),
                    contentDescription = "button icon",
                    tint = icon.tintColor,
                    modifier = Modifier
                        .size(icon.size.dp)
                        .background(Color.Transparent)
                )
            }
        }
        Button(config.apply {
            height = 50.dp
            width = dpOrDefault(dynamicWidth(20), 320.dp)
        }, enable)
    }
}

@Composable
fun MediumButton(config: ButtonConfig, enable: Boolean = true) {
    Button(config.apply {
        height = 44.dp
        width = 140.dp
    }, enable = enable)
}

@Composable
fun TinyButton(config: ButtonConfig, enable: Boolean = true) {
    Button(config.apply {
        height = 28.dp
        width = 62.dp
        fontSize = 12.sp
        lineHeight = 18.sp
    }, enable = enable)
}

@Composable
private fun Button(config: ButtonConfig, enable: Boolean) {
    TextButton(
        enabled = enable,
        onClick = config.onClick,
        modifier = Modifier
            .height(config.height)
            .width(config.width)
        ,
        colors = ButtonDefaults.textButtonColors(
            containerColor = config.bgColor,
            disabledContainerColor = Color(0xFFDFE4EC)
        ),
        border = BorderStroke(config.borderWidth, config.borderColor),
        shape = RoundedCornerShape(8.dp),
        contentPadding = PaddingValues(
            start = 12.dp,
            top = 5.dp,
            end = 12.dp,
            bottom = 5.dp
        )
    ) {
        Text(
            text = config.text,
            style = TextStyle(
                color = if (enable) config.textColor else Color(0xFF8F949C),
                fontSize = config.fontSize,
                fontWeight = FontWeight(config.fontWeight),
                lineHeight = config.lineHeight
            ),
        )
    }
}


open class ButtonConfig {
    var text: String = "Yes"
    var bgColor: Color = Color(0xFF4285F4)
    var textColor: Color = Color.White
    var fontWeight: Int = 500
    var fontSize: TextUnit = 14.sp
    var lineHeight: TextUnit = 22.sp
    var borderWidth: Dp = 0.dp
    var borderColor: Color = Color(0xFFEDEFF5)
    var hoverColor: Color = Color(0xCC4285F4)
    var onClick: () -> Unit = {}
    var height = (-1).dp
    var width = (-1).dp
}

open class IconConfig {
    var iconResId: Int = 0
    var size: Int = 18
    var paddingLeft: Int = 12
    var tintColor: Color = Color.Black
}

@Preview
@Composable
fun PreviewButton() {
    val context = LocalContext.current
    Column {
        HugeButton(config = ButtonConfig().apply {
            onClick = {
                Toast.makeText(context, "Huge", Toast.LENGTH_SHORT).show()
            }
        }, icon = IconConfig().apply {
            size = 16
            paddingLeft = 12
        })
        MediumButton(ButtonConfig().apply {
            onClick = {
                Toast.makeText(context, "Medium", Toast.LENGTH_SHORT).show()
            }
        })
        TinyButton(ButtonConfig().apply {
            onClick = {
                Toast.makeText(context, "Tiny", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
