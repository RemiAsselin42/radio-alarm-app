import { requireNativeModule } from "expo";

// Interface TypeScript pour le module natif
interface ExpoSystemAlarmModule {
  scheduleSystemAlarm(
    alarmId: string,
    triggerTimeMillis: number,
    stationUrl: string,
    stationName: string,
    vibrate: boolean
  ): Promise<boolean>;

  cancelSystemAlarm(alarmId: string): Promise<boolean>;

  setAlarmAudioStream(): Promise<void>;

  restoreAudioStream(): Promise<void>;

  canScheduleExactAlarms(): Promise<boolean>;

  openAlarmSettings(): Promise<void>;
}

// Obtenir le module natif avec typage
const NativeModule =
  requireNativeModule<ExpoSystemAlarmModule>("ExpoSystemAlarm");

export async function scheduleSystemAlarm(
  alarmId: string,
  triggerTimeMillis: number,
  stationUrl: string,
  stationName: string,
  vibrate: boolean = false
): Promise<boolean> {
  return NativeModule.scheduleSystemAlarm(
    alarmId,
    triggerTimeMillis,
    stationUrl,
    stationName,
    vibrate
  );
}

export async function cancelSystemAlarm(alarmId: string): Promise<boolean> {
  return NativeModule.cancelSystemAlarm(alarmId);
}

export async function setAlarmAudioStream(): Promise<void> {
  return NativeModule.setAlarmAudioStream();
}

export async function restoreAudioStream(): Promise<void> {
  return NativeModule.restoreAudioStream();
}

export async function canScheduleExactAlarms(): Promise<boolean> {
  return NativeModule.canScheduleExactAlarms();
}

export async function openAlarmSettings(): Promise<void> {
  return NativeModule.openAlarmSettings();
}
