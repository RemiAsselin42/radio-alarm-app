# Script de configuration Android SDK pour Windows
# Exécuter en tant qu'administrateur : Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Configuration Android SDK" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Android Studio est installé
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"

if (Test-Path $sdkPath) {
    Write-Host "✅ Android SDK trouvé à : $sdkPath" -ForegroundColor Green
    
    # Configurer ANDROID_HOME
    Write-Host ""
    Write-Host "Configuration de ANDROID_HOME..." -ForegroundColor Yellow
    [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
    $env:ANDROID_HOME = $sdkPath
    Write-Host "✅ ANDROID_HOME configuré" -ForegroundColor Green
    
    # Ajouter au PATH
    Write-Host ""
    Write-Host "Ajout au PATH..." -ForegroundColor Yellow
    
    $platformTools = "$sdkPath\platform-tools"
    $emulator = "$sdkPath\emulator"
    
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    if ($currentPath -notlike "*$platformTools*") {
        $newPath = "$currentPath;$platformTools"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$platformTools"
        Write-Host "✅ platform-tools ajouté au PATH" -ForegroundColor Green
    } else {
        Write-Host "✓ platform-tools déjà dans le PATH" -ForegroundColor Gray
    }
    
    if ($currentPath -notlike "*$emulator*") {
        $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
        $newPath = "$currentPath;$emulator"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$emulator"
        Write-Host "✅ emulator ajouté au PATH" -ForegroundColor Green
    } else {
        Write-Host "✓ emulator déjà dans le PATH" -ForegroundColor Gray
    }
    
    # Vérification
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Vérification de l'installation" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "ANDROID_HOME = $env:ANDROID_HOME" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Test de 'adb'..." -ForegroundColor Yellow
    try {
        $adbVersion = & "$platformTools\adb.exe" version 2>&1
        Write-Host "✅ adb fonctionne !" -ForegroundColor Green
        Write-Host $adbVersion
    } catch {
        Write-Host "❌ adb ne fonctionne pas encore" -ForegroundColor Red
        Write-Host "   Redémarrez PowerShell pour appliquer les changements" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✅ Configuration terminée !" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  IMPORTANT : Redémarrez PowerShell pour que les changements prennent effet" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "  1. Redémarrez PowerShell" -ForegroundColor White
    Write-Host "  2. Vérifiez avec : adb version" -ForegroundColor White
    Write-Host "  3. Lancez l'émulateur depuis Android Studio" -ForegroundColor White
    Write-Host "  4. Exécutez : npm run android" -ForegroundColor White
    
} else {
    Write-Host "❌ Android SDK non trouvé à : $sdkPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Installation nécessaire :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 (Recommandé) : Utilisez Expo Go sur votre smartphone" -ForegroundColor Green
    Write-Host "  1. Installez Expo Go depuis le Play Store" -ForegroundColor White
    Write-Host "  2. Lancez : npm start" -ForegroundColor White
    Write-Host "  3. Scannez le QR code avec Expo Go" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2 : Installez Android Studio" -ForegroundColor Cyan
    Write-Host "  1. Téléchargez depuis : https://developer.android.com/studio" -ForegroundColor White
    Write-Host "  2. Installez avec les options par défaut" -ForegroundColor White
    Write-Host "  3. Ouvrez Android Studio et installez les composants SDK" -ForegroundColor White
    Write-Host "  4. Relancez ce script" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
