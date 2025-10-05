import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import RadioPlayerService from "../services/RadioPlayer";
import VibrationService from "../services/VibrationService";
import ScreenWakeService from "../services/ScreenWakeService";
import { colors, spacing, typography } from "../styles/theme";

interface AlarmRingingScreenProps {
  navigation: any;
  route: any;
}

export const AlarmRingingScreen: React.FC<AlarmRingingScreenProps> = ({
  navigation,
  route,
}) => {
  const { stationUrl, stationName, vibrate } = route.params || {};
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Réveiller l'écran et afficher au premier plan
    ScreenWakeService.wakeUpScreen();

    startAlarm();

    return () => {
      stopAlarm();
      ScreenWakeService.releaseWakeLock();
    };
  }, []);

  const startAlarm = async () => {
    try {
      console.log(
        "Starting alarm with station:",
        stationName,
        "URL:",
        stationUrl,
        "Vibrate:",
        vibrate
      );

      // Démarrer le vibreur progressif si activé
      if (vibrate) {
        VibrationService.startProgressiveVibration();
      }

      // Initialiser le service audio de manière asynchrone
      await RadioPlayerService.initialize();
      console.log("Audio service initialized");

      if (stationUrl && stationName) {
        console.log("Attempting to play station with fade-in...");
        // Lancer la radio avec augmentation progressive du volume
        await RadioPlayerService.playStation(
          {
            id: "temp",
            name: stationName,
            streamUrl: stationUrl,
          },
          true // fadeIn activé
        );
        setIsPlaying(true);
        console.log("Radio démarrée:", stationName);
      } else {
        console.error(
          "Missing station data - URL:",
          stationUrl,
          "Name:",
          stationName
        );
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de l'alarme:", error);
      // Continuer même en cas d'erreur pour permettre à l'utilisateur de fermer l'alarme
    }
  };

  const stopAlarm = async () => {
    try {
      await RadioPlayerService.stop();
      VibrationService.stopVibration();
      setIsPlaying(false);
    } catch (error) {
      console.error("Erreur lors de l'arrêt de l'alarme:", error);
    }
  };

  const handleDismiss = async () => {
    await stopAlarm();
    navigation.goBack();
  };

  const handleSnooze = async () => {
    await stopAlarm();
    // Programmer un rappel dans 10 minutes
    const trigger = new Date(Date.now() + 10 * 60 * 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Alarme répétée",
        body: `${stationName} - Rappel dans 10 minutes`,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { stationUrl, stationName, vibrate },
      },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: trigger },
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome name="bell" size={80} color={colors.text} />
        </View>

        <Text style={styles.title}>ALARME</Text>
        <Text style={styles.stationName}>{stationName || "Radio"}</Text>

        {isPlaying ? (
          <View style={styles.statusContainer}>
            <FontAwesome name="volume-up" size={24} color={colors.success} />
            <Text style={styles.statusText}>En cours de lecture...</Text>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <FontAwesome
              name="volume-off"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={styles.statusText}>Chargement...</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.snoozeButton]}
          onPress={handleSnooze}
        >
          <FontAwesome name="clock-o" size={32} color={colors.text} />
          <Text style={styles.buttonText}>Répéter (10 min)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dismissButton]}
          onPress={handleDismiss}
        >
          <FontAwesome name="stop-circle" size={32} color={colors.text} />
          <Text style={styles.buttonText}>Arrêter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  stationName: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  statusText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  buttonsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
  },
  snoozeButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  dismissButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  buttonText: {
    ...typography.subtitle,
    fontWeight: "600",
  },
});
