---
name: android-native-webview-refactor
description: Android构建去Capacitor化——原生WebView+CLI工具链
metadata: 
  node_type: memory
  type: project
  originSessionId: ae634e6d-a557-442b-b673-264b4053f700
---

# Android 构建：去 Capacitor 化

**日期**: 2026-06-24
**分支**: v2-romance

## 做了什么

将 Android 端从 Capacitor（跨平台 WebView 壳框架）重构为原生 Android WebView：

1. **安装 CLI 工具链**: sdkmanager、adb、platform-tools、platforms;android-34
2. **重写 MainActivity.java**: 继承 AppCompatActivity，直接配置 WebView（~70行）
3. **移除 Capacitor 依赖**: 删除 capacitor-android、capacitor-cordova-android-plugins、capacitor-filesystem
4. **简化构建**: settings.gradle 仅保留 `:app`，build.gradle 仅依赖 AndroidX
5. **自动同步**: 添加 copyWebAssets Gradle task，构建时自动将 `www/` → `assets/public/`

## 构建命令

```bash
cd game/android
./gradlew assembleDebug      # debug APK (~3.4MB)
./gradlew assembleRelease    # release APK
./gradlew lint               # 静态分析
```

## 架构

MainActivity (Java) → WebView (原生) → assets/public/index.html → 游戏引擎(JS)
零第三方框架，纯 AndroidX + 系统 WebView。

**Why:** 游戏仅使用 WebView + localStorage，不需要 Capacitor 的任何桥接能力。原生 WebView 更轻量、构建更快、依赖更少。

**How to apply:** 每次修改 `game/www/` 后，运行 `./gradlew assembleDebug`，copyWebAssets task 自动同步最新文件到 APK。APK 产出在 `app/build/outputs/apk/debug/app-debug.apk`。
