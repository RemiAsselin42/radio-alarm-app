import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AlarmItem } from "../components/AlarmItem";
import { Alarm, DAYS_OF_WEEK } from "../types";
import { AlarmStorage } from "../services/AlarmStorage";
import AlarmNotificationService from "../services/AlarmNotification";
import { colors, spacing, typography } from "../styles/theme";

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAlarms();
    setupNotifications();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadAlarms();
    });

    return unsubscribe;
  }, [navigation]);

  const setupNotifications = async () => {
    await AlarmNotificationService.requestPermissions();
  };

  const loadAlarms = async () => {
    try {
      const loadedAlarms = await AlarmStorage.loadAlarms();
      // Trier les alarmes par ordre chronologique (la plus proche en premier)
      const sortedAlarms = sortAlarmsByNextOccurrence(loadedAlarms);
      setAlarms(sortedAlarms);
    } catch (error) {
      console.error("Erreur lors du chargement des alarmes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNextOccurrenceTimestamp = (alarm: Alarm): number => {
    const now = new Date();
    const [alarmHours, alarmMinutes] = alarm.time.split(":").map(Number);

    // Si pas de jours de répétition, calculer pour la prochaine occurrence
    if (alarm.repeatDays.length === 0) {
      const nextAlarm = new Date();
      nextAlarm.setHours(alarmHours, alarmMinutes, 0, 0);

      if (nextAlarm < now) {
        nextAlarm.setDate(nextAlarm.getDate() + 1);
      }

      return nextAlarm.getTime();
    }

    // Si des jours sont sélectionnés, trouver le prochain jour
    const currentDay = now.getDay();

    let daysToAdd = 0;
    let found = false;

    // Chercher sur 7 jours maximum
    for (let i = 0; i < 7; i++) {
      const dayToCheck = (currentDay + i) % 7;

      if (alarm.repeatDays.includes(dayToCheck)) {
        if (i === 0) {
          // C'est aujourd'hui, vérifier si l'heure n'est pas passée
          const testAlarm = new Date();
          testAlarm.setHours(alarmHours, alarmMinutes, 0, 0);
          if (testAlarm > now) {
            daysToAdd = 0;
            found = true;
            break;
          }
        } else {
          // Jour futur, c'est bon
          daysToAdd = i;
          found = true;
          break;
        }
      }
    }

    // Si aucun jour trouvé (ne devrait pas arriver), prendre le premier jour de la liste
    if (!found && alarm.repeatDays.length > 0) {
      const firstDay = alarm.repeatDays[0];
      daysToAdd = (firstDay - currentDay + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7; // Si c'est aujourd'hui mais l'heure est passée, attendre 7 jours
    }

    const nextAlarm = new Date();
    nextAlarm.setHours(alarmHours, alarmMinutes, 0, 0);
    nextAlarm.setDate(nextAlarm.getDate() + daysToAdd);

    return nextAlarm.getTime();
  };

  const sortAlarmsByNextOccurrence = (alarms: Alarm[]): Alarm[] => {
    return [...alarms].sort((a, b) => {
      // Les alarmes inactives à la fin
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;

      // Pour les alarmes actives, trier par prochaine occurrence
      if (a.isActive && b.isActive) {
        const timeA = getNextOccurrenceTimestamp(a);
        const timeB = getNextOccurrenceTimestamp(b);
        return timeA - timeB;
      }

      // Pour les alarmes inactives, trier par heure
      return a.time.localeCompare(b.time);
    });
  };

  const calculateTimeUntilAlarm = (alarm: Alarm): string => {
    const now = new Date();
    const [alarmHours, alarmMinutes] = alarm.time.split(":").map(Number);

    // Si pas de jours de répétition, calculer pour la prochaine occurrence
    if (alarm.repeatDays.length === 0) {
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

    // Chercher le prochain jour en partant d'aujourd'hui (ordre cyclique)
    let nextDay: number | undefined = undefined;
    let daysChecked = 0;

    // Chercher sur 7 jours maximum
    while (daysChecked < 7 && nextDay === undefined) {
      const dayToCheck = (currentDay + daysChecked) % 7;

      if (alarm.repeatDays.includes(dayToCheck)) {
        if (daysChecked === 0) {
          // C'est aujourd'hui, vérifier si l'heure n'est pas passée
          const testAlarm = new Date();
          testAlarm.setHours(alarmHours, alarmMinutes, 0, 0);
          if (testAlarm > now) {
            nextDay = dayToCheck;
          }
        } else {
          // Jour futur, c'est bon
          nextDay = dayToCheck;
        }
      }
      daysChecked++;
    }

    // Calculer le nombre de jours jusqu'à l'alarme
    let daysUntil = (nextDay! - currentDay + 7) % 7;

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
      return `demain à ${alarm.time}`;
    } else if (daysUntil < 7) {
      return `${dayName} à ${alarm.time}`;
    } else {
      return `dans ${daysUntil} jours`;
    }
  };

  const handleToggleAlarm = async (alarmId: string) => {
    try {
      const alarms = await AlarmStorage.loadAlarms();
      const alarm = alarms.find((a) => a.id === alarmId);

      // Annuler les anciennes notifications si l'alarme était active
      if (
        alarm?.isActive &&
        alarm.notificationIds &&
        alarm.notificationIds.length > 0
      ) {
        await AlarmNotificationService.cancelAlarmWithIds(
          alarm.notificationIds
        );
      }

      await AlarmStorage.toggleAlarm(alarmId);
      const updatedAlarms = await AlarmStorage.loadAlarms();
      setAlarms(updatedAlarms);

      const updatedAlarm = updatedAlarms.find((a) => a.id === alarmId);
      if (updatedAlarm?.isActive) {
        await AlarmNotificationService.scheduleAlarm(updatedAlarm);

        // Afficher le temps restant avant l'alarme
        const timeUntil = calculateTimeUntilAlarm(updatedAlarm);
        if (Platform.OS === "android") {
          ToastAndroid.show(
            `⏰ Alarme programmée ${timeUntil}`,
            ToastAndroid.LONG
          );
        }
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.show("Alarme désactivée", ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error("Erreur lors du toggle de l'alarme:", error);
    }
  };

  const handleDeleteAlarm = (alarmId: string) => {
    Alert.alert(
      "Supprimer l'alarme",
      "Êtes-vous sûr de vouloir supprimer cette alarme ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              // Annuler les notifications avant de supprimer
              const alarms = await AlarmStorage.loadAlarms();
              const alarm = alarms.find((a) => a.id === alarmId);
              if (alarm?.notificationIds && alarm.notificationIds.length > 0) {
                await AlarmNotificationService.cancelAlarmWithIds(
                  alarm.notificationIds
                );
              }

              await AlarmStorage.deleteAlarm(alarmId);
              await loadAlarms();
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
            }
          },
        },
      ]
    );
  };

  const handleAddAlarm = () => {
    navigation.navigate("EditAlarm", { alarmId: null });
  };

  const handleEditAlarm = (alarm: Alarm) => {
    navigation.navigate("EditAlarm", { alarmId: alarm.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <FontAwesome name="bell-o" size={28} color={colors.text} />
        <Text style={styles.title}>Mes Alarmes Radio</Text>
      </View>

      {alarms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="clock-o" size={64} color={colors.border} />
          <Text style={styles.emptyText}>Aucune alarme configurée</Text>
          <Text style={styles.emptySubtext}>
            Appuyez sur + pour créer votre première alarme radio
          </Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          renderItem={({ item }) => (
            <AlarmItem
              alarm={item}
              onToggle={handleToggleAlarm}
              onDelete={handleDeleteAlarm}
              onPress={handleEditAlarm}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddAlarm}>
        <FontAwesome name="plus" size={24} color={colors.text} />
      </TouchableOpacity>
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
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.title,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.subtitle,
    marginTop: spacing.lg,
    textAlign: "center",
  },
  emptySubtext: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
