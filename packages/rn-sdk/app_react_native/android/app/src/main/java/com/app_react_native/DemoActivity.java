package com.app_react_native;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import finance.portkey.lib.components.activities.DefaultReactActivity;
import finance.portkey.lib.config.StorageIdentifiers;

public class DemoActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_demo);
    }

    public void myClick(View view) {
        Intent intent = new Intent(this, DefaultReactActivity.class);
        String callbackId = String.valueOf(System.currentTimeMillis())+ String.valueOf(Math.random());
        intent.putExtra(StorageIdentifiers.PAGE_ENTRY, "app_react_native");
        intent.putExtra(StorageIdentifiers.PAGE_CALLBACK_ID, callbackId);
        startActivity(intent);
    }
}
