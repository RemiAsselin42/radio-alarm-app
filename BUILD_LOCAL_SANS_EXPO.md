# 🏠 Build Local Sans EAS (Gratuit & Illimité)

## 🎯 Objectif
Créer un APK **sur votre PC** sans utiliser les serveurs Expo (pas de limite de crédits).

## 📋 Prérequis

### 1. Installer Android Studio

1. **Télécharger** : https://developer.android.com/studio
2. **Installer** Android Studio (gardez les options par défaut)
3. **Lancer** Android Studio
4. Aller dans **More Actions** → **SDK Manager**
5. Dans l'onglet **SDK Platforms**, cocher :
   - ✅ Android 14.0 (API 34) - RECOMMANDÉ
   - ✅ Android 13.0 (API 33)
6. Dans l'onglet **SDK Tools**, cocher :
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools
7. Cliquer sur **Apply** et attendre l'installation (~2 Go)

### 2. Configurer les Variables d'Environnement

Ouvrir **PowerShell en tant qu'Administrateur** et exécuter :

```powershell
# Définir ANDROID_HOME (adapter le chemin si Android Studio est ailleurs)
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')

# Ajouter les outils Android au PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidTools = 'C:\Users\User\AppData\Local\Android\Sdk\platform-tools;C:\Users\User\AppData\Local\Android\Sdk\tools;C:\Users\User\AppData\Local\Android\Sdk\cmdline-tools\latest\bin'
[System.Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidTools", 'User')

Write-Host "✅ Variables d'environnement configurées ! Redémarrez votre terminal." -ForegroundColor Green
```

### 3. Redémarrer le Terminal
**IMPORTANT** : Fermez VS Code et rouvrez-le pour que les nouvelles variables soient prises en compte.

### 4. Vérifier l'Installation

```powershell
# Vérifier que adb est accessible
adb --version

# Vérifier ANDROID_HOME
echo $env:ANDROID_HOME
```

Si ces commandes fonctionnent, vous êtes prêt ! ✅

---

## 🚀 Créer l'APK Localement

### Étape 1 : Préparer le Projet

```bash
# Générer les dossiers natifs Android
npx expo prebuild --platform android
```

Cette commande crée le dossier `android/` avec tout le code natif.

### Étape 2 : Compiler l'APK

#### Option A : APK de Debug (Plus rapide)
```bash
cd android
.\gradlew assembleDebug
```

**APK généré dans** : `android\app\build\outputs\apk\debug\app-debug.apk`

#### Option B : APK de Release (Optimisé, recommandé)
```bash
cd android
.\gradlew assembleRelease
```

**APK généré dans** : `android\app\build\outputs\apk\release\app-release.apk`

---

## 📦 Alternative : Utiliser Expo Directement

Si vous ne voulez pas installer Android Studio, voici une méthode encore plus simple :

```bash
# Générer un APK en une commande (nécessite Android Studio déjà installé)
npx expo run:android --variant release
```

Cela fait tout automatiquement :
1. Génère le code natif
2. Compile l'APK
3. L'APK sera dans `android/app/build/outputs/apk/release/`

---

## 🎯 Résumé des Commandes

### Installation Initiale (Une fois)
```powershell
# 1. Installer Android Studio manuellement
# 2. Configurer les variables (PowerShell Admin)
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')

# 3. Redémarrer le terminal
```

### Build APK (À chaque fois)
```bash
# Méthode Simple (recommandée)
npx expo run:android --variant release

# OU Méthode Manuelle
npx expo prebuild --platform android
cd android
.\gradlew assembleRelease
```

### Trouver l'APK
```powershell
# APK de release
explorer android\app\build\outputs\apk\release

# APK de debug
explorer android\app\build\outputs\apk\debug
```

---

## ⚡ Temps de Compilation

- **Première fois** : ~5-10 minutes (téléchargement des dépendances Gradle)
- **Builds suivants** : ~2-3 minutes

---

## 📱 Installation de l'APK

1. Copiez l'APK sur votre téléphone
2. Ouvrez le fichier APK
3. Autorisez l'installation depuis des sources inconnues si demandé
4. Installez !

---

## 💡 Avantages du Build Local

| Critère              | Build Local          | EAS Build (Serveurs) |
| -------------------- | -------------------- | -------------------- |
| **Coût**             | ✅ Gratuit illimité  | ❌ Crédits limités   |
| **Vitesse**          | ✅ 2-3 minutes       | ⏱️ 15-20 minutes     |
| **Internet**         | ✅ Après 1ère fois   | ❌ Toujours requis   |
| **Contrôle**         | ✅ Total             | ⚠️ Serveurs Expo     |
| **Prérequis**        | ⚠️ Android Studio    | ✅ Aucun             |

---

## 🐛 Dépannage

### Erreur : "adb not found"
```powershell
# Vérifier ANDROID_HOME
echo $env:ANDROID_HOME

# Si vide, reconfigurer (PowerShell Admin)
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')

# Redémarrer le terminal
```

### Erreur : "SDK not found"
- Vérifiez que Android Studio est installé
- Vérifiez que le SDK est dans `C:\Users\User\AppData\Local\Android\Sdk`
- Adaptez le chemin si différent

### Erreur lors de gradlew
```bash
# Nettoyer le cache Gradle
cd android
.\gradlew clean

# Puis rebuilder
.\gradlew assembleRelease
```

---

## 🎓 Récapitulatif

1. ✅ **Installer Android Studio** (une fois)
2. ✅ **Configurer les variables** (une fois)
3. ✅ **Redémarrer le terminal** (une fois)
4. ✅ **Compiler l'APK** : `npx expo run:android --variant release`
5. ✅ **Récupérer l'APK** dans `android/app/build/outputs/apk/release/`

**Temps total première fois** : ~30 minutes (installation) + 10 minutes (build)
**Temps ensuite** : 2-3 minutes par build

C'est **100% gratuit** et **illimité** ! 🎉
