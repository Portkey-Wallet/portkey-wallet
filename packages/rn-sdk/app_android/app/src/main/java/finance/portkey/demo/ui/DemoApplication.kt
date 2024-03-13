package finance.portkey.demo.ui

import android.app.Activity
import android.content.res.Resources
import android.graphics.Color
import android.os.Bundle
import android.util.TypedValue
import android.view.ViewGroup
import android.widget.TextView
import com.facebook.react.ReactActivity
import finance.portkey.aar.PortkeyReactApplication
import finance.portkey.demo.DemoStorage
import finance.portkey.lib.config.StorageIdentifiers

class DemoApplication : PortkeyReactApplication() {
    override fun onCreate() {
        super.onCreate()
        registerActivityLifecycleCallbacks(object : ActivityLifecycleCallbacks{
            override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
                if(!DemoStorage.isDevMode()){
                    return
                }
                if(activity is ReactActivity){
                    addInfoRect(activity)
                }
            }

            override fun onActivityStarted(activity: Activity) {
            }

            override fun onActivityResumed(activity: Activity) {
            }

            override fun onActivityPaused(activity: Activity) {
            }

            override fun onActivityStopped(activity: Activity) {
            }

            override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
            }

            override fun onActivityDestroyed(activity: Activity) {
            }

        })
    }
    private fun addInfoRect(activity: Activity) {
        val textView = TextView(activity)
        val layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        textView.setPadding(20.dp,40.dp, 20.dp,10.dp)
        val pageName = activity.intent.getStringExtra(StorageIdentifiers.PAGE_ENTRY)
            ?: "unknown page"
        textView.text = pageName
        textView.textSize = 10f.dp
        textView.setBackgroundColor(Color.parseColor("#6680D8FF"))
        (activity.window.decorView as ViewGroup).addView(textView, layoutParams)
    }

}

val Float.dp
    get() = TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, this, Resources.getSystem().displayMetrics)
val Int.dp
    get() = this.toFloat().dp.toInt()
