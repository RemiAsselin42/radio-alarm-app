import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Alarm, DAYS_OF_WEEK } from "../types";
import { colors, spacing, typography } from "../styles/theme";

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (alarm: Alarm) => void;
}

export const AlarmItem: React.FC<AlarmItemProps> = ({
  alarm,
  onToggle,
  onDelete,
  onPress,
}) => {
  const formatRepeatDays = () => {
    if (alarm.repeatDays.length === 0) {
      return "Une seule fois";
    }
    if (alarm.repeatDays.length === 7) {
      return "Tous les jours";
    }
    if (
      alarm.repeatDays.length === 5 &&
      alarm.repeatDays.every((day) => day >= 1 && day <= 5)
    ) {
      return "En semaine";
    }
    if (
      alarm.repeatDays.length === 2 &&
      alarm.repeatDays.includes(0) &&
      alarm.repeatDays.includes(6)
    ) {
      return "Week-end";
    }

    return alarm.repeatDays
      .sort((a, b) => a - b)
      .map((day) => DAYS_OF_WEEK[day].name)
      .join(", ");
  };

  return (
    <TouchableOpacity
      style={[styles.container, !alarm.isActive && styles.containerInactive]}
      onPress={() => onPress(alarm)}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Text style={[styles.time, !alarm.isActive && styles.timeInactive]}>
          {alarm.time}
        </Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <FontAwesome
              name="podcast"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.detailText}>{alarm.station.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <FontAwesome name="repeat" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{formatRepeatDays()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Switch
          value={alarm.isActive}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: colors.border, true: colors.accentLight }}
          thumbColor={alarm.isActive ? colors.text : colors.textSecondary}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(alarm.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="trash-o" size={22} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerInactive: {
    opacity: 0.5,
  },
  leftContent: {
    flex: 1,
  },
  time: {
    ...typography.time,
    marginBottom: spacing.xs,
  },
  timeInactive: {
    color: colors.textSecondary,
  },
  details: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  detailText: {
    ...typography.caption,
  },
  rightContent: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});
