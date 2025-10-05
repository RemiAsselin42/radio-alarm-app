declare module "../../modules/expo-system-alarm" {
  export function scheduleSystemAlarm(
    alarmId: string,
    triggerTimeMillis: number,
    stationUrl: string,
    stationName: string,
    vibrate?: boolean
  ): Promise<boolean>;

  export function cancelSystemAlarm(alarmId: string): Promise<boolean>;

  export function setAlarmAudioStream(): Promise<void>;

  export function restoreAudioStream(): Promise<void>;

  export function canScheduleExactAlarms(): Promise<boolean>;

  export function openAlarmSettings(): Promise<void>;
}
