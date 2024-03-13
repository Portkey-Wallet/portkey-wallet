package finance.portkey.aar.services

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig


class GeneralJSMethodService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val extras = intent!!.extras
        return if (extras != null) {
            val taskName = extras.getString("taskName")
            HeadlessJsTaskConfig(
                taskName,
                Arguments.fromBundle(extras),
                5000,
                false
            )
        } else null
    }
}
