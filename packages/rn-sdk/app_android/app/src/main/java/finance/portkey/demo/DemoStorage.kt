package finance.portkey.demo

import android.util.Log
import com.tencent.mmkv.MMKV
import java.util.Arrays

private val demoStorage = MMKV.mmkvWithID("app-demo").apply {
    allKeys()?.filter { it.contains("#") }?.forEach {
        removeValueForKey(it)
    }
}

object DemoStorage {
    private const val DEV_MODE="DEV_MODE"
    @Synchronized
    fun isDevMode(): Boolean {
        return demoStorage.decodeBool(DEV_MODE, false)
    }

    fun clear() {
        demoStorage.clearAll()
        demoStorage.clearMemoryCache()
        demoStorage.sync()
        Log.w("demoStorage", "keys : ${Arrays.toString(demoStorage.allNonExpireKeys())}")
    }

    @Synchronized
    fun setDevMode(value: Boolean) {
        demoStorage.encode(DEV_MODE, value)
    }

}
