package finance.portkey.lib

import android.content.ContentProvider
import android.content.ContentValues
import android.database.Cursor
import android.net.Uri
import finance.portkey.core.PortKeySimpleSDK


class PortKeyInitiator:ContentProvider() {
    override fun onCreate(): Boolean {
        val context = context
        if(context != null)
            PortKeySimpleSDK.initialize(context)
        return true;
    }

    override fun query(
        uri: Uri,
         projection: Array<String?>?,
         selection: String?,
         selectionArgs: Array<String?>?,
         sortOrder: String?
    ): Cursor {
        throw IllegalStateException("Not allowed.")
    }

    
    override fun getType(uri: Uri): String {
        throw IllegalStateException("Not allowed.")
    }

    
    override fun insert(uri: Uri,  values: ContentValues?): Uri {
        throw IllegalStateException("Not allowed.")
    }

    override fun delete(
        uri: Uri,
         selection: String?,
         selectionArgs: Array<String?>?
    ): Int {
        throw IllegalStateException("Not allowed.")
    }

    override fun update(
        uri: Uri,
         values: ContentValues?,
         selection: String?,
         selectionArgs: Array<String?>?
    ): Int {
        throw IllegalStateException("Not allowed.")
    }
}
