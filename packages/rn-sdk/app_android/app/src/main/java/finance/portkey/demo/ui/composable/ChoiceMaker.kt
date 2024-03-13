package finance.portkey.demo.ui.composable

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import finance.portkey.aar.wallet.PortkeyWallet
import finance.portkey.demo.ui.theme.Purple40
import finance.portkey.lib.components.logic.PortkeyMMKVStorage

@Composable
internal fun ChoiceMaker(
    title: String,
    choicesList: List<String>,
    defaultChoice: String = choicesList[0],
    useExitWallet: Boolean = false,
    afterChosen: (String) -> Unit = {}
) {
    val context = LocalContext.current
    var expand by remember {
        mutableStateOf(false)
    }
    var choice by remember {
        mutableStateOf(defaultChoice)
    }
    val changeChoice: (selection: String, text: String) -> Unit = remember {
        { selection, text ->
            choice = selection
            afterChosen(selection)
            PortkeyDialogController.showSuccess(text)
        }
    }
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 2.dp, start = 10.dp, end = 10.dp)
            .background(Purple40, RoundedCornerShape(8.dp))
            .height(50.dp)
            .clickable {
                expand = !expand
            },
        contentAlignment = Alignment.Center
    ) {
        Text(text = "$title(now using:$choice)", color = Color.White, fontSize = 14.sp)
        DropdownMenu(
            expanded = expand,
            onDismissRequest = { expand = false },
            modifier = Modifier.wrapContentSize()
        ) {
            choicesList.forEach {
                DropdownMenuItem(
                    text = {
                        Text(
                            text = it.plus(if (choice == it) "  ✅" else ""),
                            modifier = Modifier
                                .padding(start = 10.dp)
                                .wrapContentWidth()
                        )
                    },
                    onClick = click@{
                        expand = false
                        if (choice == it) return@click
                        if (!PortkeyWallet.isWalletExists()) {
                            changeChoice(it, "Now using $it.")
                            return@click
                        } else if (!PortkeyWallet.isWalletUnlocked()) {
                            PortkeyDialogController.showFail(
                                text = "You currently have a wallet without unlocking operations, Please unlock wallet first.\n" +
                                        "If you hope so, you can reset the SDK storage entirely for test.",
                                negativeButtonText = "⚠️ Reset",
                            ) {
                                PortkeyMMKVStorage.clear()
                                changeChoice(it, "Now using $it. Wallet has been erased.")
                            }
                            return@click
                        }
                        fun execute() {
                            if (useExitWallet) {
                                Loading.showLoading()
                                PortkeyWallet.exitWallet(
                                    context = context,
                                    callback = { succeed, reason ->
                                        Loading.hideLoading()
                                        if (succeed) {
                                            changeChoice(
                                                it,
                                                "Now using $it. Wallet has been erased."
                                            )
                                        } else {
                                            PortkeyDialogController.showFail("Exit wallet failed, reason: $reason")
                                        }
                                    }
                                )
                            } else {
                                changeChoice(it, "Now using $it.")
                            }
                        }
                        PortkeyDialogController.show(
                            DialogProps().apply {
                                mainTitle = "Confirm"
                                subTitle =
                                    "Are you sure to switch to $it ?${if (useExitWallet) " Your wallet will be erased." else ""}"
                                useSingleConfirmButton = false
                                positiveCallback = {
                                    execute()
                                }
                            }
                        )
                    }
                )
            }
        }
    }
}
