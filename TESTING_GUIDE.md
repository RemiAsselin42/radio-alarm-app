# Guide de Test - Alarme Système Radio

## Fonctionnalités à Tester

### 1. Configuration d'une Alarme

- ✅ Créer une nouvelle alarme
- ✅ Sélectionner une station radio
- ✅ Définir l'heure et la récurrence
- ✅ Sauvegarder l'alarme

### 2. Test de l'Alarme Système (PRIORITÉ)

- 🔥 **CRUCIAL**: Verrouiller complètement le téléphone
- 🔥 **CRUCIAL**: Attendre que l'alarme se déclenche
- 🔥 **ATTENDRE**: L'application doit se lancer automatiquement
- 🔥 **VÉRIFIER**: L'écran d'alarme apparaît par-dessus tout
- 🔥 **ÉCOUTER**: Le son sort par le canal "Alarme" (non affecté par le mode silencieux)

### 3. Tests Avancés

- ✅ Mode "Ne pas déranger" activé
- ✅ Mode avion (pour tester sans radio)
- ✅ Batterie faible
- ✅ Applications tierces ouvertes

### 4. Permissions Android

Au premier lancement, l'app demandera :

- ✅ **Autorisation d'alarmes exactes** : ACCEPTER
- ✅ **Notifications** : ACCEPTER
- ✅ **Affichage par-dessus d'autres apps** : ACCEPTER

## Différences Attendues vs Anciennes Versions

| Aspect                      | Avant (Notifications) | Maintenant (Système) |
| --------------------------- | --------------------- | -------------------- |
| Réveil téléphone verrouillé | ❌ Non fiable         | ✅ Garanti           |
| Canal audio                 | 🔔 Notification       | 🔊 Alarme            |
| Bypass mode silencieux      | ❌ Non                | ✅ Oui               |
| Lancement automatique       | ❌ Manuel             | ✅ Automatique       |
| Affichage plein écran       | ❌ Notification       | ✅ Application       |

## Commandes de Debug (si problème)

```bash
# Vérifier les permissions
adb shell dumpsys alarm | grep com.radioalarm.app

# Voir les logs en temps réel
adb logcat -s ExpoSystemAlarm
```

## Résolution de Problèmes

### Si l'alarme ne se déclenche pas :

1. Vérifier "Paramètres → Apps → Radio Alarm → Autorisations"
2. Désactiver l'optimisation batterie pour l'app
3. S'assurer que "Alarmes et rappels" est autorisé

### Si le son ne sort pas :

1. Vérifier le volume "Alarme" (pas média/sonnerie)
2. Tester avec une station radio différente
3. Vérifier la connexion internet

## Success Criteria ✅

L'implémentation est réussie si :

- ✅ L'alarme réveille un téléphone verrouillé
- ✅ L'application se lance automatiquement
- ✅ Le son fonctionne même en mode silencieux
- ✅ Ça fonctionne comme l'alarme native Android
