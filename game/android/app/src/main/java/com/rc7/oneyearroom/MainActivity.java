package com.rc7.oneyearroom;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

/**
 * 一年·房间 — 主活动
 *
 * 原生 WebView 加载游戏，无第三方跨平台框架依赖。
 * 游戏逻辑完全运行在 WebView 中（HTML/CSS/JS），
 * Android 侧仅提供窗口容器和基础 Web 配置。
 */
public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        configureWebView();
        webView.loadUrl("file:///android_asset/public/index.html");
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();

        // JavaScript 引擎（游戏逻辑依赖）
        settings.setJavaScriptEnabled(true);

        // 本地存储（存档/设置依赖 localStorage + sessionStorage）
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // 允许 file:// 协议下加载本地资源（CSS/JS/JSON）
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        // 音频/视频自动播放（未来的声音设计）
        settings.setMediaPlaybackRequiresUserGesture(false);

        // 视口与缩放
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // 阻止链接跳转到外部浏览器
        webView.setWebViewClient(new WebViewClient());
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
