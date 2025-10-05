import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

/**
 * Service optimisé pour créer des alarmes très proches du système natif
 * Sans modules natifs - Compatible avec tous les systèmes de build
 */
class OptimizedAlarmService {
  /**
   * Configure les canaux et catégories pour des alarmes quasi-système
   */
  async setupSystemLikeAlarms(): Promise<void> {
    if (Platform.OS !== "android") return;

    try {
      // Canal ultra-prioritaire pour alarmes
      await Notifications.setNotificationChannelAsync("SYSTEM_ALARM_CHANNEL", {
        name: "Alarmes Système",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 500, 200, 500, 200, 500, 200, 500],
        lightColor: "#FF0000",
        bypassDnd: true,
        showBadge: true,
        enableLights: true,
        enableVibrate: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      // Catégories d'alarme avec actions
      await Notifications.setNotificationCategoryAsync("SYSTEM_ALARM", [
        {
          identifier: "ALARM_DISMISS",
          buttonTitle: "Arrêter",
          options: {
            opensAppToForeground: true,
            isDestructive: true,
          },
        },
        {
          identifier: "ALARM_SNOOZE",
          buttonTitle: "Répéter (5min)",
          options: {
            opensAppToForeground: true,
          },
        },
      ]);

      console.log("System-like alarm channels configured");
    } catch (error) {
      console.error("Error setting up system-like alarms:", error);
    }
  }

  /**
   * Programme une alarme avec full-screen intent et priorité maximale
   */
  async scheduleSystemLikeAlarm(
    alarmId: string,
    triggerTime: Date,
    stationUrl: string,
    stationName: string,
    vibrate: boolean = false
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 ALARME RADIO",
          body: `${stationName} - ALARME ACTIVÉE`,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.MAX,
          categoryIdentifier: "SYSTEM_ALARM",
          autoDismiss: false,
          sticky: true,
          data: {
            isSystemAlarm: true,
            alarmId,
            stationUrl,
            stationName,
            vibrate,
            triggerTime: triggerTime.getTime(),
          },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date: triggerTime,
          channelId: "SYSTEM_ALARM_CHANNEL",
        },
        identifier: `SYSTEM_ALARM_${alarmId}`,
      });

      console.log(`System-like alarm scheduled: ${alarmId} for ${triggerTime}`);
      return notificationId;
    } catch (error) {
      console.error("Error scheduling system-like alarm:", error);
      return null;
    }
  }

  /**
   * Annule une alarme système
   */
  async cancelSystemLikeAlarm(alarmId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(
        `SYSTEM_ALARM_${alarmId}`
      );
      console.log(`System-like alarm cancelled: ${alarmId}`);
    } catch (error) {
      console.error("Error cancelling system-like alarm:", error);
    }
  }

  /**
   * Vérifie les permissions nécessaires pour les alarmes exactes
   */
  async checkAlarmPermissions(): Promise<{
    canSchedule: boolean;
    recommendations: string[];
  }> {
    try {
      const permissions = await Notifications.getPermissionsAsync();

      const recommendations = [];
      if (permissions.status !== "granted") {
        recommendations.push("Activer les notifications dans les paramètres");
      }

      // Sur Android 12+, recommandations spécifiques
      if (Platform.OS === "android") {
        recommendations.push(
          "Paramètres → Apps → Radio Alarm → Notifications → Autoriser",
          "Paramètres → Apps → Radio Alarm → Batterie → Non optimisée",
          "Paramètres → Ne pas déranger → Exceptions → Alarmes"
        );
      }

      return {
        canSchedule: permissions.status === "granted",
        recommendations,
      };
    } catch (error) {
      return {
        canSchedule: false,
        recommendations: ["Erreur lors de la vérification des permissions"],
      };
    }
  }
}

export default new OptimizedAlarmService();
