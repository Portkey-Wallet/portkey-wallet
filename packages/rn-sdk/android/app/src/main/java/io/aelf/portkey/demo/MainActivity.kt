package io.aelf.portkey.demo

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import io.aelf.portkey.components.logic.PortkeyMMKVStorage
import io.aelf.portkey.core.entry.PortkeyTest
import io.aelf.portkey.demo.ui.theme.MyRNApplicationTheme
import io.aelf.portkey.entry.usePortkeyEntry
import io.aelf.portkey.tools.startJSBackgroundTaskTest


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyRNApplicationTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(2.dp, Alignment.Top),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        BigButton("Go to Login Entry", this@MainActivity::jumpToActivity)
                        BigButton("Switch to MAIN CHAIN") {
                            changeChain("AELF")
                        }
                        BigButton("Switch to SIDE CHAIN tDVV") {
                            changeChain("tDVV")
                        }
                        BigButton("Switch to SIDE CHAIN tDVW") {
                            changeChain("tDVW")
                        }
                        BigButton("Switch to MAIN NET") {
                            changeEndPointUrl("https://did-portkey.portkey.finance")
                        }
                        BigButton("Switch to TEST NET") {
                            changeEndPointUrl("https://did-portkey-test.portkey.finance")
                        }
//                        BigButton("Switch to TEST1") {
//                            changeEndPointUrl("https://localtest-applesign.portkey.finance")
//                        }
                        BigButton(text = "Background Service Call") {
                            startJSBackgroundTaskTest(this@MainActivity)
                        }
                        BigButton("Sign out?") {
                            signOut()
                        }
                    }
                    PortkeyTest.UsePortkeyViewStub()
                }
            }
        }
    }

    private fun jumpToActivity() {
        usePortkeyEntry("referral_entry")
    }
    private fun changeChain(chainId: String) {
        PortkeyMMKVStorage.writeString("currChainId", chainId)
        Toast.makeText(this, "chainId changed to $chainId", Toast.LENGTH_SHORT).show()
    }

    private fun changeEndPointUrl(url: String) {
        PortkeyMMKVStorage.writeString("endPointUrl", url)
        Toast.makeText(this, "endPoint changed to $url", Toast.LENGTH_SHORT).show()
    }

    private fun signOut() {
        PortkeyMMKVStorage.clear()
        Toast.makeText(this, "all data erased, and all configs are reset.", Toast.LENGTH_SHORT)
            .show()
    }

}

@Composable
internal fun BigButton(text: String, callback: () -> Unit) {
    Box {
        Row {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 2.dp, start = 10.dp, end = 10.dp)
                    .height(50.dp),
                shape = RoundedCornerShape(8.dp),
                onClick = callback,
            ) {
                Text(text)
            }
        }
    }
}
