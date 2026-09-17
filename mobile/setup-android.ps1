# Android Environment Setup Script for React Native
# Run this script with: .\setup-android.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "React Native Android Setup Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Gradle daemons
Write-Host "[1/6] Stopping Gradle daemons..." -ForegroundColor Yellow
try {
    Get-Process | Where-Object {$_.ProcessName -like "*java*" -and $_.CommandLine -like "*gradle*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Gradle daemons stopped" -ForegroundColor Green
} catch {
    Write-Host "✓ No Gradle daemons running" -ForegroundColor Green
}

# Step 2: Clean Gradle cache
Write-Host "[2/6] Cleaning Gradle cache..." -ForegroundColor Yellow
$gradleHome = "$env:USERPROFILE\.gradle"
if (Test-Path $gradleHome) {
    Remove-Item "$gradleHome\caches" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "$gradleHome\daemon" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Gradle cache cleaned" -ForegroundColor Green
} else {
    Write-Host "✓ No Gradle cache found" -ForegroundColor Green
}

# Step 3: Clean project Gradle cache
Write-Host "[3/6] Cleaning project Gradle cache..." -ForegroundColor Yellow
if (Test-Path "android\.gradle") {
    Remove-Item "android\.gradle" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Project Gradle cache cleaned" -ForegroundColor Green
}
if (Test-Path "android\build") {
    Remove-Item "android\build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Project build cache cleaned" -ForegroundColor Green
}

# Step 4: Check for Android SDK
Write-Host "[4/6] Checking for Android SDK..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
$localAndroidSdk = "$env:LOCALAPPDATA\Android\Sdk"

if ($androidHome) {
    Write-Host "✓ ANDROID_HOME is set: $androidHome" -ForegroundColor Green
    $sdkFound = $true
} elseif (Test-Path $localAndroidSdk) {
    Write-Host "✓ Android SDK found at: $localAndroidSdk" -ForegroundColor Green
    Write-Host "  Setting ANDROID_HOME for this session..." -ForegroundColor Yellow
    $env:ANDROID_HOME = $localAndroidSdk
    $env:Path += ";$localAndroidSdk\platform-tools;$localAndroidSdk\emulator;$localAndroidSdk\tools;$localAndroidSdk\tools\bin"
    $sdkFound = $true
    
    Write-Host ""
    Write-Host "  To set ANDROID_HOME permanently:" -ForegroundColor Cyan
    Write-Host "  1. Press Win + X → System → Advanced system settings" -ForegroundColor White
    Write-Host "  2. Click 'Environment Variables'" -ForegroundColor White
    Write-Host "  3. Add new System Variable:" -ForegroundColor White
    Write-Host "     Name: ANDROID_HOME" -ForegroundColor White
    Write-Host "     Value: $localAndroidSdk" -ForegroundColor White
    Write-Host "  4. Edit PATH and add:" -ForegroundColor White
    Write-Host "     %ANDROID_HOME%\platform-tools" -ForegroundColor White
    Write-Host "     %ANDROID_HOME%\emulator" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✗ Android SDK not found!" -ForegroundColor Red
    $sdkFound = $false
    
    Write-Host ""
    Write-Host "  You need to install Android Studio:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "  2. Install with default settings" -ForegroundColor White
    Write-Host "  3. Open Android Studio → SDK Manager" -ForegroundColor White
    Write-Host "  4. Install:" -ForegroundColor White
    Write-Host "     - Android SDK Platform 34" -ForegroundColor White
    Write-Host "     - Android SDK Build-Tools" -ForegroundColor White
    Write-Host "     - Android SDK Platform-Tools" -ForegroundColor White
    Write-Host "     - Android SDK Command-line Tools" -ForegroundColor White
    Write-Host "  5. Create a Virtual Device (AVD)" -ForegroundColor White
    Write-Host "  6. Run this script again" -ForegroundColor White
    Write-Host ""
}

# Step 5: Check for ADB
Write-Host "[5/6] Checking for ADB (Android Debug Bridge)..." -ForegroundColor Yellow
$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
    Write-Host "✓ ADB found: $($adb.Source)" -ForegroundColor Green
} else {
    Write-Host "✗ ADB not found in PATH" -ForegroundColor Red
    if ($sdkFound -and (Test-Path "$env:ANDROID_HOME\platform-tools\adb.exe")) {
        Write-Host "  ADB exists but not in PATH. It will work after restarting terminal." -ForegroundColor Yellow
    }
}

# Step 6: Check for emulators/devices
Write-Host "[6/6] Checking for Android devices/emulators..." -ForegroundColor Yellow
if ($adb) {
    $devices = & adb devices
    Write-Host $devices
    
    if ($devices -match "device$") {
        Write-Host "✓ Android device connected!" -ForegroundColor Green
    } elseif ($devices -match "emulator") {
        Write-Host "✓ Android emulator running!" -ForegroundColor Green
    } else {
        Write-Host "✗ No devices or emulators found" -ForegroundColor Red
        Write-Host "  Start an emulator from Android Studio or connect a physical device" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup Summary" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

if ($sdkFound) {
    Write-Host "✓ Environment is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure an emulator is running or device is connected" -ForegroundColor White
    Write-Host "2. Run: npm run android" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✗ Android SDK required" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Android Studio and run this script again" -ForegroundColor Yellow
    Write-Host "Download: https://developer.android.com/studio" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
