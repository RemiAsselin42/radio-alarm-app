import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alarm } from "../types";

const ALARMS_STORAGE_KEY = "@radio_alarm_alarms";

export const AlarmStorage = {
  async saveAlarms(alarms: Alarm[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(alarms);
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Error saving alarms:", e);
    }
  },

  async loadAlarms(): Promise<Alarm[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Error loading alarms:", e);
      return [];
    }
  },

  async addAlarm(alarm: Alarm): Promise<void> {
    const alarms = await this.loadAlarms();
    alarms.push(alarm);
    await this.saveAlarms(alarms);
  },

  async updateAlarm(updatedAlarm: Alarm): Promise<void> {
    const alarms = await this.loadAlarms();
    const index = alarms.findIndex((a) => a.id === updatedAlarm.id);
    if (index !== -1) {
      alarms[index] = updatedAlarm;
      await this.saveAlarms(alarms);
    }
  },

  async deleteAlarm(alarmId: string): Promise<void> {
    const alarms = await this.loadAlarms();
    const filteredAlarms = alarms.filter((a) => a.id !== alarmId);
    await this.saveAlarms(filteredAlarms);
  },

  async toggleAlarm(alarmId: string): Promise<void> {
    const alarms = await this.loadAlarms();
    const alarm = alarms.find((a) => a.id === alarmId);
    if (alarm) {
      alarm.isActive = !alarm.isActive;
      await this.saveAlarms(alarms);
    }
  },
};
