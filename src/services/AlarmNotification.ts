import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Alarm } from "../types";
import AndroidAlarmManager from "./AndroidAlarmManager";
import OptimizedAlarmService from "./OptimizedAlarmService";
import * as SystemAlarm from "../../modules/expo-system-alarm/functions";

// Configuration pour l'affichage des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

class AlarmNotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Permission de notification refusée");
          return false;
        }

        // Initialiser le service d'alarme optimisé
        await OptimizedAlarmService.setupSystemLikeAlarms();

        // Créer un canal de notification pour Android (canal Alarme)
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("alarm-channel", {
            name: "Alarmes Radio",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            bypassDnd: true,
            showBadge: true,
            enableLights: true,
            enableVibrate: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
          });

          // Créer un canal spécial pour les full-screen intents
          await Notifications.setNotificationChannelAsync("alarm-fullscreen", {
            name: "Alarmes Plein Écran",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            bypassDnd: true,
            showBadge: true,
            enableLights: true,
            enableVibrate: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
          });
        }
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("alarm", {
            name: "Alarmes Radio",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
            sound: "default",
            enableVibrate: true,
            showBadge: true,
            lockscreenVisibility:
              Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
          });

          // Configurer la catégorie pour les notifications en plein écran
          await Notifications.setNotificationCategoryAsync("alarm", [
            {
              identifier: "dismiss",
              buttonTitle: "Arrêter",
              options: {
                opensAppToForeground: true,
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
        }

        return true;
      }
    }
    return false;
  }

  async scheduleAlarm(alarm: Alarm): Promise<string | null> {
    try {
      // Pour Android, essayer d'abord les vraies alarmes système, puis fallback
      if (Platform.OS === "android") {
        try {
          // Tenter d'utiliser le module natif d'alarme système
          const canScheduleNative = await SystemAlarm.canScheduleExactAlarms();
          if (canScheduleNative) {
            const [hours, minutes] = alarm.time.split(":").map(Number);
            const triggerTime = new Date();
            triggerTime.setHours(hours, minutes, 0, 0);

            // Si l'heure est déjà passée, programmer pour demain
            if (triggerTime < new Date()) {
              triggerTime.setDate(triggerTime.getDate() + 1);
            }

            const success = await SystemAlarm.scheduleSystemAlarm(
              alarm.id,
              triggerTime.getTime(),
              alarm.station.streamUrl,
              alarm.station.name,
              alarm.vibrate || false
            );

            if (success) {
              console.log("✅ Native system alarm scheduled successfully");
              return `native-${alarm.id}`;
            }
          }
        } catch (error) {
          console.log("⚠️ Native alarm not available, using optimized fallback");
        }

        // Fallback : Utiliser le service d'alarme optimisé
        const { canSchedule } =
          await OptimizedAlarmService.checkAlarmPermissions();
        if (canSchedule) {
          const [hours, minutes] = alarm.time.split(":").map(Number);
          const triggerTime = new Date();
          triggerTime.setHours(hours, minutes, 0, 0);

          // Si l'heure est déjà passée, programmer pour demain
          if (triggerTime < new Date()) {
            triggerTime.setDate(triggerTime.getDate() + 1);
          }

          const systemAlarmId =
            await OptimizedAlarmService.scheduleSystemLikeAlarm(
              alarm.id,
              triggerTime,
              alarm.station.streamUrl,
              alarm.station.name,
              alarm.vibrate || false
            );

          if (systemAlarmId) {
            console.log("🔶 Optimized system-like alarm scheduled successfully");
            return systemAlarmId;
          }
        } else {
          console.warn("❌ Cannot schedule exact alarms - check permissions");
        }
      }

      const [hours, minutes] = alarm.time.split(":").map(Number);

      // Si pas de jours de répétition, programmer une seule fois
      if (alarm.repeatDays.length === 0) {
        const now = new Date();
        const trigger = new Date();
        trigger.setHours(hours, minutes, 0, 0);

        // Si l'heure est déjà passée aujourd'hui, programmer pour demain
        if (trigger < now) {
          trigger.setDate(trigger.getDate() + 1);
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "🔔 Alarme Radio",
            body: `${alarm.station.name} - ${alarm.time}`,
            sound: "default",
            priority: Notifications.AndroidNotificationPriority.MAX,
            categoryIdentifier: "alarm",
            autoDismiss: false,
            sticky: true,
            data: {
              alarmId: alarm.id,
              stationUrl: alarm.station.streamUrl,
              stationName: alarm.station.name,
              vibrate: alarm.vibrate || false,
              fullScreenIntent: true,
            },
          },
          trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
          identifier: `alarm-${alarm.id}`,
        });

        return notificationId;
      }

      // Programmer pour chaque jour sélectionné (sur les 4 prochaines semaines)
      const notificationIds: string[] = [];
      const weeksToSchedule = 4; // Programmer 4 semaines à l'avance

      const now = new Date();

      for (const day of alarm.repeatDays) {
        // Calculer la première occurrence pour ce jour
        const firstTrigger = new Date();
        firstTrigger.setHours(hours, minutes, 0, 0);

        const currentDay = now.getDay();
        let daysUntilFirstAlarm = 0;

        // Calculer le nombre de jours jusqu'à la première occurrence
        if (day === currentDay) {
          // C'est aujourd'hui, vérifier si l'heure n'est pas passée
          if (firstTrigger > now) {
            daysUntilFirstAlarm = 0; // Aujourd'hui
          } else {
            daysUntilFirstAlarm = 7; // Semaine prochaine
          }
        } else if (day > currentDay) {
          // Ce jour-ci cette semaine
          daysUntilFirstAlarm = day - currentDay;
        } else {
          // Ce jour-ci la semaine prochaine
          daysUntilFirstAlarm = 7 - currentDay + day;
        }

        // Programmer pour les 4 prochaines semaines à partir de la première occurrence
        for (let week = 0; week < weeksToSchedule; week++) {
          const trigger = new Date();
          trigger.setHours(hours, minutes, 0, 0);

          // Ajouter les jours jusqu'à la première occurrence + les semaines supplémentaires
          const totalDays = daysUntilFirstAlarm + week * 7;
          trigger.setDate(trigger.getDate() + totalDays);

          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "🔔 Alarme Radio",
              body: `${alarm.station.name} - ${alarm.time}`,
              sound: "default",
              priority: Notifications.AndroidNotificationPriority.MAX,
              categoryIdentifier: "alarm",
              autoDismiss: false,
              sticky: true,
              data: {
                alarmId: alarm.id,
                stationUrl: alarm.station.streamUrl,
                stationName: alarm.station.name,
                vibrate: alarm.vibrate || false,
                fullScreenIntent: true,
              },
            },
            trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
            identifier: `alarm-${alarm.id}-${day}-${week}`,
          });

          notificationIds.push(notificationId);
        }
      }

      // Sauvegarder tous les IDs de notification dans l'alarme
      alarm.notificationIds = notificationIds;

      return notificationIds[0] || null;
    } catch (error) {
      console.error("Erreur lors de la planification de l'alarme:", error);
      return null;
    }
  }

  async cancelAlarm(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'alarme:", error);
    }
  }

  async cancelAlarmWithIds(notificationIds: string[]): Promise<void> {
    try {
      for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation des alarmes:", error);
    }
  }

  async cancelAllAlarms(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error(
        "Erreur lors de l'annulation de toutes les alarmes:",
        error
      );
    }
  }

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default new AlarmNotificationService();
