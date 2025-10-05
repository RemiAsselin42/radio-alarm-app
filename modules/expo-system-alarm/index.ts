import ExpoSystemAlarmModule from "./src/ExpoSystemAlarmModule";

export async function scheduleSystemAlarm(
  alarmId: string,
  triggerTimeMillis: number,
  stationUrl: string,
  stationName: string,
  vibrate: boolean = false
): Promise<boolean> {
  return ExpoSystemAlarmModule.scheduleSystemAlarm(
    alarmId,
    triggerTimeMillis,
    stationUrl,
    stationName,
    vibrate
  );
}

export async function cancelSystemAlarm(alarmId: string): Promise<boolean> {
  return ExpoSystemAlarmModule.cancelSystemAlarm(alarmId);
}

export async function setAlarmAudioStream(): Promise<void> {
  return ExpoSystemAlarmModule.setAlarmAudioStream();
}

export async function restoreAudioStream(): Promise<void> {
  return ExpoSystemAlarmModule.restoreAudioStream();
}

export async function canScheduleExactAlarms(): Promise<boolean> {
  return ExpoSystemAlarmModule.canScheduleExactAlarms();
}

export async function openAlarmSettings(): Promise<void> {
  return ExpoSystemAlarmModule.openAlarmSettings();
}
