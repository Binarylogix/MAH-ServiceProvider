# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# =========================
# React Native
# =========================
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**

# =========================
# Firebase
# =========================
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Keep annotations (important for Firebase & RN)
-keepattributes *Annotation*

# Keep enums (safe)
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# =========================
# Notifee
# =========================
-keep class app.notifee.** { *; }
-dontwarn app.notifee.**

# =========================
# OkHttp / Retrofit (safe)
# =========================
-dontwarn okhttp3.**
-dontwarn retrofit2.**

# =========================
# Remove logs in release
# =========================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}