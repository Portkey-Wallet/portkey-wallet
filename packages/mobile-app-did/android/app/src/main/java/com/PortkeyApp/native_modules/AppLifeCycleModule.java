package com.PortkeyApp.native_modules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.lang.ref.WeakReference;

public class AppLifeCycleModule extends ReactContextBaseJavaModule {
    private final WeakReference<ReactApplicationContext> mContext;

    public AppLifeCycleModule(ReactApplicationContext context) {
        super(context);
        this.mContext = new WeakReference<>(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "AppLifeCycleModule";
    }

    @ReactMethod
    public void restartApp() {
        Log.w("AppLifeCycleModule", "restartApp");
        Context context= mContext.get();
        PackageManager packageManager = context.getPackageManager();
        Intent intent = packageManager.getLaunchIntentForPackage(context.getPackageName()); //
        ComponentName componentName = intent.getComponent();
        Intent mainIntent = Intent.makeRestartActivityTask(componentName); //
        context.startActivity(mainIntent);
        Runtime.getRuntime().exit(0); //
    }

}
