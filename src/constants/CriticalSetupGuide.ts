/**
 * Guide de configuration critique pour pallier aux limitations
 */
export const CRITICAL_SETUP_INSTRUCTIONS = {
  title: "⚠️ CONFIGURATION CRITIQUE REQUISE",

  batteryOptimization: {
    title: "1. DÉSACTIVER l'optimisation de batterie",
    steps: [
      "Paramètres → Batterie → Optimisation de batterie",
      "Rechercher 'Radio Alarm'",
      "Sélectionner 'Non optimisée'",
      "⚠️ CRITIQUE : Sans ceci, les alarmes peuvent ne pas sonner",
    ],
  },

  doNotDisturb: {
    title: "2. CONFIGURER Ne pas déranger",
    steps: [
      "Paramètres → Ne pas déranger → Exceptions",
      "Activer 'Alarmes'",
      "Activer 'Notifications d'applications prioritaires'",
      "⚠️ CRITIQUE : Sinon les alarmes seront silencieuses",
    ],
  },

  alarmVolume: {
    title: "3. VOLUME D'ALARME au maximum",
    steps: [
      "Paramètres → Sons et vibrations → Volume",
      "Alarme : Mettre au MAXIMUM",
      "⚠️ DIFFÉRENT du volume multimédia",
      "Tester avec le bouton d'écoute",
    ],
  },

  autoStart: {
    title: "4. DÉMARRAGE AUTOMATIQUE (Xiaomi/Huawei)",
    steps: [
      "Paramètres → Applications → Radio Alarm → Autorisations",
      "Activer 'Démarrage automatique'",
      "Activer 'Exécuter en arrière-plan'",
      "⚠️ Marques chinoises : vérifier 'Gestionnaire de démarrage'",
    ],
  },

  notifications: {
    title: "5. NOTIFICATIONS avec priorité MAXIMALE",
    steps: [
      "Paramètres → Applications → Radio Alarm → Notifications",
      "Activer TOUTES les notifications",
      "Alarmes Système → Importance : Élevée",
      "Autoriser l'affichage sur l'écran de verrouillage",
    ],
  },
};
