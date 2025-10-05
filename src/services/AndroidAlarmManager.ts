import { NativeModules, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { Alarm } from "../types";

/**
 * Service pour gérer les vraies alarmes Android via l'AlarmManager système
 * Ce service complète les notifications Expo pour créer de vraies alarmes système
 */
class AndroidAlarmManager {
  /**
   * Configure une notification comme une vraie alarme système Android
   */
  async scheduleSystemAlarm(alarm: Alarm): Promise<string | null> {
    if (Platform.OS !== "android") {
      console.log("Android alarm manager only works on Android");
      return null;
    }

    try {
      const [hours, minutes] = alarm.time.split(":").map(Number);

      // Calculer le timestamp de la prochaine occurrence
      const now = new Date();
      const nextAlarmTime = new Date();
      nextAlarmTime.setHours(hours, minutes, 0, 0);

      // Si l'heure est déjà passée aujourd'hui, programmer pour demain
      if (nextAlarmTime < now) {
        nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
      }

      // Utiliser les notifications Expo avec configuration d'alarme système
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Alarme Radio",
          body: `${alarm.station.name} - ${alarm.time}`,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.MAX,
          categoryIdentifier: "alarm-system",
          autoDismiss: false,
          sticky: true,
          data: {
            alarmId: alarm.id,
            stationUrl: alarm.station.streamUrl,
            stationName: alarm.station.name,
            vibrate: alarm.vibrate || false,
            isSystemAlarm: true,
            fullScreenIntent: true,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: nextAlarmTime,
        },
        identifier: `system-alarm-${alarm.id}`,
      });

      console.log(
        `System alarm scheduled for ${alarm.time} with ID: ${notificationId}`
      );
      return notificationId;
    } catch (error) {
      console.error("Error scheduling system alarm:", error);
      return null;
    }
  }

  /**
   * Annule une alarme système
   */
  async cancelSystemAlarm(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`System alarm cancelled: ${notificationId}`);
    } catch (error) {
      console.error("Error cancelling system alarm:", error);
    }
  }

  /**
   * Configure les catégories de notification pour les alarmes système
   */
  async setupAlarmCategories(): Promise<void> {
    if (Platform.OS !== "android") {
      return;
    }

    try {
      // Configurer la catégorie pour les alarmes système
      await Notifications.setNotificationCategoryAsync("alarm-system", [
        {
          identifier: "dismiss",
          buttonTitle: "Arrêter",
          options: {
            opensAppToForeground: true,
            isDestructive: true,
          },
        },
        {
          identifier: "snooze",
          buttonTitle: "Répéter",
          options: {
            opensAppToForeground: true,
          },
        },
      ]);

      // Créer le canal de notification spécialement pour les alarmes système
      await Notifications.setNotificationChannelAsync("system-alarm-channel", {
        name: "Alarmes Système",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 500, 500, 500],
        lightColor: "#FF231F7C",
        bypassDnd: true, // Contourner le mode Ne pas déranger
        showBadge: true,
        enableLights: true,
        enableVibrate: true,
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      console.log("Alarm categories and channels configured");
    } catch (error) {
      console.error("Error setting up alarm categories:", error);
    }
  }

  /**
   * Vérifie si l'appareil supporte les alarmes exactes
   */
  async canScheduleExactAlarms(): Promise<boolean> {
    if (Platform.OS !== "android") {
      return false;
    }

    try {
      // Sur Android 12+, vérifier les permissions d'alarme exacte
      const permissions = await Notifications.getPermissionsAsync();
      return permissions.status === "granted";
    } catch (error) {
      console.error("Error checking exact alarm permissions:", error);
      return false;
    }
  }
}

export default new AndroidAlarmManager();
