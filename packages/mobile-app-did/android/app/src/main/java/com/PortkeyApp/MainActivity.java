package com.portkey.finance;
import expo.modules.ReactActivityDelegateWrapper;

import com.PortkeyApp.native_modules.PortkeyHeadlessJsTaskService;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
/**
 * react navigation
 * More on this on https://reactnavigation.org/docs/getting-started/
 */
import android.os.Bundle;

public class MainActivity extends ReactActivity {
  /**
   * react navigation
   * More on this on https://reactnavigation.org/docs/getting-started
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

    @Override
  protected void onStop() {
    super.onStop();
    android.content.Intent service = new android.content.Intent(getApplicationContext(), PortkeyHeadlessJsTaskService.class);
    Bundle bundle = new Bundle();

    bundle.putString("portkey", "finance");
    service.putExtras(bundle);
    getApplicationContext().startService(service);
  }


  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "PortkeyApp";
  }

/**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {

    return new ReactActivityDelegateWrapper(this, new MainActivityDelegate(this, getMainComponentName()));
  }

  
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
