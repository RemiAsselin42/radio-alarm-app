# 🚀 Guide : Obtenir un APK Rapidement

## ✅ Méthode 1 : EAS Build (RECOMMANDÉ - En cours)

**Avantages** :

- ✅ Pas besoin d'Android SDK
- ✅ Build sur les serveurs Expo
- ✅ APK téléchargeable directement sur PC
- ✅ Gratuit (compte Expo gratuit)

**Commande** :

```bash
npx eas build --profile preview --platform android
```

**Temps** : 15-20 minutes

**Résultat** :

- Lien de téléchargement dans votre email
- Ou sur : https://expo.dev/accounts/devremi/projects/radio-alarm-app

---

## ⚡ Méthode 2 : Build de Production (Profile)

Pour un APK de production optimisé :

```bash
npx eas build --profile production --platform android
```

---

## 🔧 Méthode 3 : Build Local (Nécessite Android SDK)

**Prérequis** : Android Studio installé

### Installation Android Studio (Si pas encore installé)

1. Télécharger : https://developer.android.com/studio
2. Installer Android Studio
3. Ouvrir Android Studio → SDK Manager
4. Installer Android SDK (API 34 recommandé)
5. Configurer les variables d'environnement :

**PowerShell** (en tant qu'admin) :

```powershell
# Définir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\User\AppData\Local\Android\Sdk', 'User')

# Ajouter au PATH
$path = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$newPath = "$path;C:\Users\User\AppData\Local\Android\Sdk\platform-tools;C:\Users\User\AppData\Local\Android\Sdk\tools"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
```

6. **Redémarrer le terminal**

### Ensuite, build local :

```bash
# APK de développement
npx expo run:android --variant debug

# APK de production
npx expo run:android --variant release
```

**Temps** : 5-10 minutes (première fois), 2-3 minutes ensuite

**Résultat** : APK dans `android/app/build/outputs/apk/release/`

---

## 📊 Comparaison

| Méthode     | Temps    | Prérequis      | APK où ?                     |
| ----------- | -------- | -------------- | ---------------------------- |
| EAS Build   | 15-20min | Compte Expo    | Téléchargé sur PC            |
| Build Local | 5-10min  | Android Studio | `android/app/build/outputs/` |

---

## 🎯 Méthode Actuelle (En cours)

Vous avez lancé :

```bash
npx eas build --profile preview --platform android
```

**Status** : Build en cours...

**Lien** : https://expo.dev/accounts/devremi/projects/radio-alarm-app/builds/18032d7d-fe2a-4be3-8dcc-012a166e2032

**Actions** :

1. ✅ Attendez l'email de notification
2. ✅ Ou rafraîchissez le lien ci-dessus
3. ✅ Téléchargez l'APK quand prêt
4. ✅ Transférez sur votre téléphone et installez

---

## 📝 Notes

- **Preview profile** : APK installable manuellement
- **Development profile** : Inclut le dev client pour le hot reload
- **Production profile** : Optimisé pour le Play Store

L'APK créé avec le profil **preview** est parfait pour tester l'application complète sans Expo Go !
