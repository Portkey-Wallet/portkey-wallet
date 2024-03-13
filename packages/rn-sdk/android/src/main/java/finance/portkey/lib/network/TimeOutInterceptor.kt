package finance.portkey.lib.network

import okhttp3.Interceptor
import okhttp3.Response
import java.util.Objects

internal class TimeOutInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val timeOutConfig = request.tag(TimeOutConfig::class.java)
        return if (Objects.nonNull(timeOutConfig)) {
            chain.withConnectTimeout(
                timeOutConfig!!.allTimeOut,
                java.util.concurrent.TimeUnit.MILLISECONDS
            )
                .proceed(request)
        } else {
            chain.proceed(request)
        }
    }
}

internal data class TimeOutConfig(
    internal val allTimeOut: Int,
)
