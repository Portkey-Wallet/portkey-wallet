package com.portkey.finance.native_modules;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.portkey.finance.R;

import javax.annotation.Nullable;

public class PortkeyHeadlessJsTaskService extends HeadlessJsTaskService {
  @Override
  public void onCreate() {
    super.onCreate();
    startForeground();
  }
  private void startForeground() {
    String channelId = null;
    //8.0 or later
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      channelId = createNotificationChannel("kim.hsl", "ForegroundService");
    } else {
      channelId = "";
    }
    NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId);
    Notification notification = builder.setOngoing(true)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setPriority(10)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build();
    startForeground(1, notification);
  }
  /**
   * create NotificationChannel
   * @param channelId
   * @param channelName
   * @return
   */
  @RequiresApi(Build.VERSION_CODES.O)
  private String createNotificationChannel(String channelId, String channelName){
    NotificationChannel chan = new NotificationChannel(channelId,
            channelName, NotificationManager.IMPORTANCE_NONE);
    chan.setLightColor(Color.BLUE);
    chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
    NotificationManager service = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    service.createNotificationChannel(chan);
    return channelId;
  }

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "backgroundStatusReportTask",
          Arguments.fromBundle(extras),
          5000, // timeout for the task
          true // optional: defines whether or not  the task is allowed in foreground. Default is false
        );
    }
    return null;
  }
}
