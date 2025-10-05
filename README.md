# Radio Alarm App 📻⏰

Application mobile Android développée avec React Native (Expo) pour créer des alarmes qui lancent des stations de radio en ligne au lieu d'un son répétitif. Réveillez-vous en douceur avec votre station préférée !

## ✨ Fonctionnalités Principales

### 🔔 Alarmes Intelligentes

- ⏰ Créer, modifier, activer/désactiver et supprimer des alarmes
- � Répétition personnalisée par jour de la semaine
- 🕐 Sélection d'heure précise
- 🔒 **S'affiche même quand le téléphone est verrouillé**
- 🚀 **Passe automatiquement au premier plan**
- 🔔 Notifications système avec canal "Alarme" Android haute priorité

### 🎚️ Réveil Progressif (En Douceur)

- **Volume progressif** : Monte de 0% à 100% sur 30 secondes (fade-in automatique)
- **Vibreur progressif** : S'intensifie doucement sur 30 secondes (optionnel)
- **Réveil tactile** : Combinaison vibreur + son pour un réveil complet

### 📻 12 Stations de Radio

#### Radios Françaises (8 stations)

- NRJ, Skyrock, RTL, Europe 1, France Inter, RFM, Nostalgie, Fun Radio

#### Radio Paradise - Sans publicité 24/7 (4 chaînes)

- **Main Mix** : Mélange éclectique (rock, indie, électronique, world)
- **Mellow** : Version douce et relaxante
- **Rock** : Focus rock classique et moderne
- **World/Etc** : Musiques du monde et genres variés

Toutes les chaînes Radio Paradise utilisent des streams AAC haute qualité (320kbps).

### 🎨 Interface

- Interface épurée en tons gris avec icônes FontAwesome
- Design optimisé pour Android
- Navigation intuitive

## Technologies utilisées

- **React Native** via **Expo** (~50.0.0)
- **React Navigation** pour la navigation entre écrans
- **AsyncStorage** pour la persistance des alarmes
- **Expo AV** pour la lecture audio des streams radio
- **Expo Notifications** pour les alarmes système Android
- **FontAwesome** pour les icônes
- **TypeScript** pour le typage

## Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un appareil Android ou l'émulateur Android Studio

## Installation

1. Clonez le dépôt ou naviguez vers le dossier du projet

2. Installez les dépendances :

```bash
npm install
```

3. Lancez l'application :

```bash
npm start
# ou avec cache nettoyé
npm run start:clean
```

4. **Scannez le QR code** avec l'application **Expo Go** sur votre téléphone Android.

> **⚠️ LIMITATION CRITIQUE EXPO GO** : Les alarmes sur **écran verrouillé ne fonctionnent PAS dans Expo Go**. L'app ne s'ouvrira pas automatiquement quand votre téléphone dort.
>
> **✅ SOLUTION : Créer un build de développement** (gratuit, ~20 minutes)
>
> Suivez le guide complet : **[GUIDE_BUILD_RAPIDE.md](./GUIDE_BUILD_RAPIDE.md)**
>
> **Commandes rapides :**
>
> ```bash
> npm install -g eas-cli
> eas login
> eas build --profile development --platform android
> ```

> **✅ Timeout corrigé !** Si l'app chargeait en permanence et faisait timeout, ce problème a été résolu. Voir [`CORRECTION_TIMEOUT.md`](./CORRECTION_TIMEOUT.md) pour les détails.

> **⚠️ Erreur "adb n'est pas reconnu" ?** Pas de panique ! Vous n'avez pas besoin d'émulateur pour tester l'app. Utilisez simplement **Expo Go** sur votre smartphone. Voir le guide : [`DEMARRAGE_RAPIDE.md`](./DEMARRAGE_RAPIDE.md)

> **📋 Guide de test :** Pour vérifier que tout fonctionne correctement, consultez [`TEST_RAPIDE.md`](./TEST_RAPIDE.md)

> **Note** : Vous pouvez voir un avertissement de dépréciation du module `punycode`. C'est un avertissement inoffensif provenant d'une dépendance interne et n'affecte pas le fonctionnement de l'application.

## Build pour Android

Pour créer un APK ou un bundle Android :

```bash
# Build de développement
npx expo run:android

# Build de production (nécessite un compte Expo)
eas build --platform android
```

## Structure du projet

```
radio-alarm-app/
├── App.tsx                          # Point d'entrée avec navigation
├── src/
│   ├── components/
│   │   └── AlarmItem.tsx           # Composant d'affichage d'une alarme
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Écran principal avec liste des alarmes
│   │   ├── EditAlarmScreen.tsx     # Écran de création/édition d'alarme
│   │   └── AlarmRingingScreen.tsx  # Écran quand l'alarme sonne
│   ├── services/
│   │   ├── AlarmStorage.ts         # Gestion du stockage des alarmes
│   │   ├── AlarmNotification.ts    # Gestion des notifications système
│   │   └── RadioPlayer.ts          # Service de lecture audio
│   ├── styles/
│   │   └── theme.ts                # Thème et couleurs de l'app
│   └── types/
│       └── index.ts                # Types TypeScript et constantes
├── app.json                         # Configuration Expo
├── package.json                     # Dépendances npm
└── tsconfig.json                    # Configuration TypeScript
```

## Permissions Android

L'application demande les permissions suivantes :

- `SCHEDULE_EXACT_ALARM` : Programmer des alarmes exactes
- `USE_EXACT_ALARM` : Utiliser des alarmes exactes (Android 14+)
- `WAKE_LOCK` : Réveiller l'appareil
- `RECEIVE_BOOT_COMPLETED` : Restaurer les alarmes après redémarrage
- `VIBRATE` : Vibration lors de l'alarme
- `INTERNET` : Streaming des radios
- `FOREGROUND_SERVICE` : Service en arrière-plan
- `POST_NOTIFICATIONS` : Afficher des notifications

## Utilisation

1. **Créer une alarme** : Appuyez sur le bouton `+` en bas à droite
2. **Configurer l'heure** : Touchez l'heure pour ouvrir le sélecteur
3. **Choisir une radio** : Sélectionnez votre station préférée
4. **Définir la répétition** : Sélectionnez les jours de la semaine (ou laissez vide pour une alarme unique)
5. **Sauvegarder** : Appuyez sur l'icône ✓ en haut à droite
6. **Gérer les alarmes** : Utilisez le switch pour activer/désactiver et l'icône poubelle pour supprimer

## 📱 Utilisation Avancée

### Créer une alarme avec toutes les options

1. **Heure** : Touchez l'heure pour ouvrir le sélecteur
2. **Station** : Choisissez parmi 12 stations de radio
3. **Répétition** : Sélectionnez les jours (laissez vide pour alarme unique)
4. **Vibreur progressif** : Activez pour un réveil tactile en douceur
5. **Sauvegarde** : Validez avec ✓

### Quand l'alarme se déclenche

- 📱 **L'écran s'allume automatiquement** (même si verrouillé)
- 🚀 **L'app passe au premier plan**
- 🔊 **Le volume monte progressivement** (30 secondes)
- 📳 **Le vibreur s'intensifie** (si activé, 30 secondes)
- 🎵 **La radio démarre automatiquement**

### Actions disponibles

- **Arrêter** : Bouton rouge pour stopper l'alarme
- **Répéter (10 min)** : Bouton gris pour snooze

## ⚠️ Notes Importantes

### Permissions Android

Sur Android 12+, l'application nécessite plusieurs autorisations :

- **Alarmes et rappels** : Planifier des alarmes exactes (obligatoire)
- **Afficher par-dessus** : Afficher l'alarme sur écran verrouillé (recommandé)
- **Contourner "Ne pas déranger"** : Sonner même en mode silencieux (optionnel)
- **Optimisation batterie** : Désactivez pour garantir le réveil (recommandé)

### ⚠️ LIMITATION CRITIQUE : Expo Go

**🚨 Les alarmes sur écran verrouillé NE FONCTIONNENT PAS dans Expo Go !**

Avec Expo Go, seule la **notification** apparaît. L'application **ne s'ouvre pas automatiquement** pour jouer la radio quand votre téléphone est verrouillé/en veille.

#### Ce qui fonctionne dans Expo Go :

- ✅ Interface complète de l'app
- ✅ Création/édition/suppression d'alarmes
- ✅ Lecture de radio quand l'app est ouverte
- ✅ Notifications programmées

#### Ce qui NE fonctionne PAS dans Expo Go :

- ❌ **Ouverture automatique de l'app sur écran verrouillé** 🚨 CRITIQUE
- ❌ Réveil automatique de l'écran
- ❌ Lecture de radio automatique au déclenchement
- ❌ **L'alarme ne vous réveillera PAS le matin** 🚨

#### ✅ Solution : Build de Développement (Gratuit, ~20 min)

**Guide complet** : [GUIDE_BUILD_RAPIDE.md](./GUIDE_BUILD_RAPIDE.md)

**Commandes rapides** :

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

**Voir aussi** : [LIMITATION_EXPO_GO.md](./LIMITATION_EXPO_GO.md)

**Solution** : Créez un build de développement avec `eas build` ou `npx expo run:android`

### Paramètres système recommandés

1. **Autoriser l'affichage par-dessus** : Paramètres → Apps → Radio Alarm
2. **Désactiver l'optimisation batterie** : Pour garantir le réveil
3. **Autoriser "Ne pas déranger"** : Pour sonner même en mode silencieux

## 📖 Documentation Complète

- [NOUVELLES_FONCTIONNALITES.md](./NOUVELLES_FONCTIONNALITES.md) - Détails du réveil progressif (volume + vibreur)
- [CONFIGURATION_LOCKSCREEN.md](./CONFIGURATION_LOCKSCREEN.md) - Configuration de l'affichage sur écran verrouillé
- [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) - Guide de démarrage rapide
- [SOLUTION_ERREUR_ADB.md](./SOLUTION_ERREUR_ADB.md) - Solutions aux erreurs ADB
- [DIAGNOSTIC_RESEAU.md](./DIAGNOSTIC_RESEAU.md) - Diagnostic des problèmes réseau
- [CORRECTION_TIMEOUT.md](./CORRECTION_TIMEOUT.md) - Correction du timeout au démarrage
- [TEST_RAPIDE.md](./TEST_RAPIDE.md) - Tests de validation

## 🚀 Développement Futur

Améliorations possibles :

- ✅ ~~Augmentation progressive du volume~~ (Implémenté !)
- ✅ ~~Vibreur progressif~~ (Implémenté !)
- ✅ ~~Affichage sur écran verrouillé~~ (Implémenté !)
- ✅ ~~Ajout de Radio Paradise~~ (4 chaînes ajoutées !)
- [ ] Support iOS
- [ ] Mode "fade-out" pour arrêt progressif
- [ ] Widget Android pour accès rapide
- [ ] Support des podcasts
- [ ] Import de stations personnalisées
- [ ] Statistiques de sommeil
- [ ] Mode "Weekend" automatique

## Licence

Ce projet est sous licence MIT.

## Support

Pour toute question ou problème, créez une issue sur le dépôt GitHub.
