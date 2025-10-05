import { Platform, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";

/**
 * Service de diagnostic et configuration pour les alarmes quasi-système
 * Compatible avec GitHub Actions - Pas de modules natifs requis
 */
class AlarmDiagnosticService {
  /**
   * Effectue un diagnostic complet des capacités d'alarme
   */
  async runFullDiagnostic(): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
    canFunction: boolean;
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    try {
      // Vérifier les permissions de notification
      const permissions = await Notifications.getPermissionsAsync();
      if (permissions.status !== "granted") {
        issues.push("Notifications non autorisées");
        recommendations.push(
          "Autoriser les notifications dans Paramètres > Applications > Radio Alarm"
        );
        score -= 30;
      }

      // Vérifier les paramètres Android spécifiques
      if (Platform.OS === "android") {
        // Ces vérifications sont indicatives
        recommendations.push(
          "Configurer l'optimisation de batterie :",
          "• Paramètres > Batterie > Optimisation > Radio Alarm > Non optimisée",
          "",
          "Configurer Ne pas déranger :",
          "• Paramètres > Ne pas déranger > Exceptions > Alarmes > Activé",
          "",
          "Volume d'alarme :",
          "• Paramètres > Sons > Volume d'alarme > Maximum",
          "",
          "Mode performance :",
          "• Désactiver les économiseurs de batterie agressifs"
        );
      }

      const canFunction = score >= 70;

      return {
        score,
        issues,
        recommendations,
        canFunction,
      };
    } catch (error) {
      return {
        score: 0,
        issues: ["Erreur lors du diagnostic"],
        recommendations: ["Redémarrer l'application"],
        canFunction: false,
      };
    }
  }

  /**
   * Guide l'utilisateur pour optimiser son téléphone pour les alarmes
   */
  async showOptimizationGuide(): Promise<void> {
    const diagnostic = await this.runFullDiagnostic();

    const message = `Configuration Alarmes Système
    
Score: ${diagnostic.score}/100

${
  diagnostic.issues.length > 0
    ? "Problèmes détectés:\n" + diagnostic.issues.join("\n") + "\n\n"
    : ""
}

Recommandations:
${diagnostic.recommendations.join("\n")}

Voulez-vous ouvrir les paramètres système ?`;

    Alert.alert("Configuration Alarmes", message, [
      { text: "Plus tard", style: "cancel" },
      {
        text: "Ouvrir Paramètres",
        onPress: () => this.openSystemSettings(),
      },
    ]);
  }

  /**
   * Ouvre les paramètres système appropriés
   */
  async openSystemSettings(): Promise<void> {
    try {
      if (Platform.OS === "android") {
        // Essayer d'ouvrir les paramètres de l'app
        await Linking.openSettings();
      }
    } catch (error) {
      console.error("Cannot open system settings:", error);
      Alert.alert(
        "Info",
        "Ouvrez manuellement Paramètres > Applications > Radio Alarm"
      );
    }
  }

  /**
   * Test rapide des alarmes
   */
  async testAlarmCapabilities(): Promise<boolean> {
    try {
      // Test de notification immédiate
      const testNotification = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Test Alarme",
          body: "Si vous voyez ceci, les alarmes fonctionnent !",
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: { isTest: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });

      // Annuler après 10 secondes
      setTimeout(async () => {
        await Notifications.cancelScheduledNotificationAsync(testNotification);
      }, 10000);

      return true;
    } catch (error) {
      console.error("Alarm test failed:", error);
      return false;
    }
  }

  /**
   * Affiche les instructions de première utilisation
   */
  showFirstTimeInstructions(): void {
    Alert.alert(
      "🔔 Configuration Alarmes Radio",
      `Pour un fonctionnement optimal:

1. Autorisez TOUTES les permissions
2. Désactivez l'optimisation de batterie
3. Configurez le volume d'alarme au maximum
4. Testez avec une alarme à 1 minute

L'app utilisera le système de notifications le plus proche possible des alarmes système Android.`,
      [
        { text: "Configurer", onPress: () => this.showOptimizationGuide() },
        { text: "Plus tard", style: "cancel" },
      ]
    );
  }
}

export default new AlarmDiagnosticService();
