package finance.portkey.core

import java.util.UUID

internal object JSNameSpace {
    @JvmStatic
     val nameSpace:String=UUID.randomUUID().toString();
}
