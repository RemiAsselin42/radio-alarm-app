# 🎯 Solution : APK Standalone (Sans Serveur)

## ❌ Problème Identifié

Vous avez obtenu un APK avec **expo-dev-client** qui nécessite une connexion à un serveur de développement.

### Cause

- `expo-dev-client` était dans les `dependencies` du `package.json`
- Le dossier `android/` natif avait été généré avec le dev client
- Même le profil `preview` incluait le dev client

## ✅ Solution Appliquée

### 1. Déplacé `expo-dev-client` en devDependencies

**Avant** :

```json
"dependencies": {
  "expo-dev-client": "~6.0.13",
  ...
}
```

**Après** :

```json
"dependencies": {
  // expo-dev-client retiré
}
"devDependencies": {
  // Complètement retiré pour les builds standalone
}
```

### 2. Supprimé les dossiers natifs

- Supprimé `android/`
- Supprimé `ios/` (si existait)

Cela force EAS à créer un build **Expo pur** sans dev client.

### 3. Ajouté un profil `standalone` dans `eas.json`

```json
"standalone": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  }
}
```

## 🚀 Commande pour APK Standalone

### Option 1 : Profil Production (RECOMMANDÉ)

```bash
npx eas build --profile production --platform android
```

### Option 2 : Profil Standalone

```bash
npx eas build --profile standalone --platform android
```

## 📋 Différences entre les profils

| Profil        | Type d'APK                        | Nécessite serveur ? | Usage                  |
| ------------- | --------------------------------- | ------------------- | ---------------------- |
| `development` | Dev Client                        | ✅ Oui              | Développement avec HMR |
| `preview`     | Standalone (si pas de dev-client) | ❌ Non              | Tests avant production |
| `production`  | Standalone optimisé               | ❌ Non              | Distribution finale    |
| `standalone`  | Standalone                        | ❌ Non              | Tests standalone       |

## ✅ Résultat Attendu

L'APK créé avec le profil `production` ou `standalone` sera :

- ✅ **Complètement autonome** (pas besoin de serveur)
- ✅ **Installable directement** sur n'importe quel téléphone
- ✅ **Fonctionne hors ligne** (sauf pour streamer la radio)
- ✅ **Toutes les fonctionnalités actives** (alarme, notification, lockscreen, etc.)

## 🔄 Pour revenir au dev client (si besoin)

Si vous voulez retravailler avec le dev client pour le développement :

```bash
# Réinstaller expo-dev-client
npm install expo-dev-client

# Régénérer les dossiers natifs
npx expo prebuild

# Créer un build dev
npx eas build --profile development --platform android
```

## 📝 Notes

- Le build **production** est optimisé (plus petit, plus rapide)
- Le build **standalone** est identique mais sans les optimisations de production
- Les deux fonctionnent **sans serveur** de développement
