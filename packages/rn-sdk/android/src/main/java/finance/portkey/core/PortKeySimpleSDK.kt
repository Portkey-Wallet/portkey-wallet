package finance.portkey.core

import android.content.Context
import com.tencent.mmkv.MMKV

object PortKeySimpleSDK {
    fun initialize(application: Context) {
        MMKV.initialize(application)
    }
}
