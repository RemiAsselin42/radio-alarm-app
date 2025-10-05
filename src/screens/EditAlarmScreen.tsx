import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Alarm, RadioStation, RADIO_STATIONS, DAYS_OF_WEEK } from "../types";
import { AlarmStorage } from "../services/AlarmStorage";
import AlarmNotificationService from "../services/AlarmNotification";
import { colors, spacing, typography } from "../styles/theme";

// Fonction pour générer un ID unique
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface EditAlarmScreenProps {
  navigation: any;
  route: any;
}

export const EditAlarmScreen: React.FC<EditAlarmScreenProps> = ({
  navigation,
  route,
}) => {
  const alarmId = route.params?.alarmId;
  const isEditMode = !!alarmId;

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedStation, setSelectedStation] = useState<RadioStation>(
    RADIO_STATIONS[0]
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [vibrate, setVibrate] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadAlarm();
    }
  }, []);

  const loadAlarm = async () => {
    try {
      const alarms = await AlarmStorage.loadAlarms();
      const alarm = alarms.find((a) => a.id === alarmId);

      if (alarm) {
        const [hours, minutes] = alarm.time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        setTime(date);
        setSelectedStation(alarm.station);
        setSelectedDays(alarm.repeatDays);
        setIsActive(alarm.isActive);
        setVibrate(alarm.vibrate || false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'alarme:", error);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayId)) {
        return prev.filter((d) => d !== dayId);
      } else {
        return [...prev, dayId].sort();
      }
    });
  };

  const calculateTimeUntilAlarm = (
    alarmTime: Date,
    repeatDays: number[]
  ): string => {
    const now = new Date();
    const alarmHours = alarmTime.getHours();
    const alarmMinutes = alarmTime.getMinutes();

    // Si pas de jours de répétition, calculer pour la prochaine occurrence
    if (repeatDays.length === 0) {
      const nextAlarm = new Date();
      nextAlarm.setHours(alarmHours, alarmMinutes, 0, 0);

      // Si l'heure est déjà passée aujourd'hui, programmer pour demain
      if (nextAlarm < now) {
        nextAlarm.setDate(nextAlarm.getDate() + 1);
      }

      const diffMs = nextAlarm.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `dans ${days} jour${days > 1 ? "s" : ""}`;
      } else if (hours > 0) {
        return `dans ${hours}h ${minutes}min`;
      } else {
        return `dans ${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
    }

    // Si des jours sont sélectionnés, trouver le prochain jour
    const currentDay = now.getDay();

    let daysToAdd = 0;
    let nextDay: number | undefined = undefined;

    // Chercher sur 7 jours maximum
    for (let i = 0; i < 7; i++) {
      const dayToCheck = (currentDay + i) % 7;

      if (repeatDays.includes(dayToCheck)) {
        if (i === 0) {
          // C'est aujourd'hui, vérifier si l'heure n'est pas passée
          const testAlarm = new Date();
          testAlarm.setHours(alarmHours, alarmMinutes, 0, 0);
          if (testAlarm > now) {
            daysToAdd = 0;
            nextDay = dayToCheck;
            break;
          }
        } else {
          // Jour futur, c'est bon
          daysToAdd = i;
          nextDay = dayToCheck;
          break;
        }
      }
    }

    // Calculer le nombre de jours jusqu'à l'alarme
    let daysUntil = daysToAdd;

    // Si c'est aujourd'hui (daysUntil === 0), afficher les heures/minutes
    if (daysUntil === 0) {
      const nextAlarm = new Date();
      nextAlarm.setHours(alarmHours, alarmMinutes, 0, 0);
      const diffMs = nextAlarm.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `dans ${hours}h ${minutes}min`;
      } else {
        return `dans ${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
    }

    const dayName = DAYS_OF_WEEK[nextDay].fullName;
    if (daysUntil === 1) {
      return `demain à ${alarmHours.toString().padStart(2, "0")}:${alarmMinutes
        .toString()
        .padStart(2, "0")}`;
    } else if (daysUntil < 7) {
      return `${dayName} à ${alarmHours
        .toString()
        .padStart(2, "0")}:${alarmMinutes.toString().padStart(2, "0")}`;
    } else {
      return `dans ${daysUntil} jours`;
    }
  };

  const handleSave = async () => {
    try {
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      const alarm: Alarm = {
        id: isEditMode ? alarmId : generateId(),
        time: timeString,
        station: selectedStation,
        repeatDays: selectedDays,
        isActive,
        vibrate,
      };

      // Si on modifie une alarme, annuler les anciennes notifications
      if (isEditMode) {
        const alarms = await AlarmStorage.loadAlarms();
        const oldAlarm = alarms.find((a) => a.id === alarmId);
        if (oldAlarm?.notificationIds && oldAlarm.notificationIds.length > 0) {
          await AlarmNotificationService.cancelAlarmWithIds(
            oldAlarm.notificationIds
          );
        }
      }

      if (isActive) {
        await AlarmNotificationService.scheduleAlarm(alarm);

        // Afficher le temps restant avant l'alarme
        const timeUntil = calculateTimeUntilAlarm(time, selectedDays);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            `⏰ Alarme programmée ${timeUntil}`,
            ToastAndroid.LONG
          );
        }
      }

      // Sauvegarder l'alarme avec les notificationIds
      if (isEditMode) {
        await AlarmStorage.updateAlarm(alarm);
      } else {
        await AlarmStorage.addAlarm(alarm);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder l'alarme");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditMode ? "Modifier l'alarme" : "Nouvelle alarme"}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <FontAwesome name="check" size={24} color={colors.success} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sélecteur d'heure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="clock-o" size={18} color={colors.text} /> Heure
          </Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timeText}>{formatTime(time)}</Text>
            <FontAwesome
              name="angle-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Sélection de la station */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="podcast" size={18} color={colors.text} /> Station
            Radio
          </Text>
          {RADIO_STATIONS.map((station) => (
            <TouchableOpacity
              key={station.id}
              style={[
                styles.radioOption,
                selectedStation.id === station.id && styles.radioOptionSelected,
              ]}
              onPress={() => setSelectedStation(station)}
            >
              <Text
                style={[
                  styles.radioOptionText,
                  selectedStation.id === station.id &&
                    styles.radioOptionTextSelected,
                ]}
              >
                {station.name}
              </Text>
              {selectedStation.id === station.id && (
                <FontAwesome
                  name="check-circle"
                  size={20}
                  color={colors.success}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sélection des jours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="repeat" size={18} color={colors.text} />{" "}
            Répétition
          </Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day.id) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day.id) &&
                      styles.dayButtonTextSelected,
                  ]}
                >
                  {day.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Laissez vide pour une alarme unique</Text>
        </View>

        {/* Option Vibreur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="mobile" size={18} color={colors.text} /> Options
          </Text>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setVibrate(!vibrate)}
          >
            <View style={styles.optionLeft}>
              <FontAwesome
                name="mobile"
                size={24}
                color={vibrate ? colors.success : colors.textSecondary}
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Vibreur progressif</Text>
                <Text style={styles.optionDescription}>
                  Active une vibration douce qui s'intensifie progressivement
                </Text>
              </View>
            </View>
            <View style={[styles.checkbox, vibrate && styles.checkboxChecked]}>
              {vibrate && (
                <FontAwesome name="check" size={16} color={colors.success} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.subtitle,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "300",
    color: colors.text,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radioOptionSelected: {
    borderColor: colors.success,
    backgroundColor: colors.surfaceLight,
  },
  radioOptionText: {
    ...typography.body,
  },
  radioOptionTextSelected: {
    color: colors.success,
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  dayButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 50,
    alignItems: "center",
  },
  dayButtonSelected: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accentLight,
  },
  dayButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  dayButtonTextSelected: {
    color: colors.text,
    fontWeight: "600",
  },
  hint: {
    ...typography.caption,
    marginTop: spacing.sm,
    fontStyle: "italic",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: colors.success,
    backgroundColor: colors.surfaceLight,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
