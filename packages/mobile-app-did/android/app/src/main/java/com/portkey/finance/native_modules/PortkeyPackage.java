package com.portkey.finance.native_modules;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.List;

public class PortkeyPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactApplicationContext) {
        return new ArrayList<NativeModule>() {{
            add(new AppLifeCycleModule(reactApplicationContext));
        }};
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactApplicationContext) {
        return new ArrayList<>();
    }
}
