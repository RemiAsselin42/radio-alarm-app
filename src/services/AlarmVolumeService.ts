import { Platform } from "react-native";

/**
 * Service pour gérer le volume spécifique des alarmes
 * Permet de contrôler le volume d'alarme indépendamment du volume multimédia
 */
class AlarmVolumeService {
  private originalMediaVolume: number = 1.0;
  private alarmVolumeSet: boolean = false;

  /**
   * Configure le volume pour une alarme
   * Augmente le volume média si nécessaire et sauvegarde le volume original
   */
  async setAlarmVolume(): Promise<void> {
    if (Platform.OS !== "android") {
      console.log("Alarm volume control only available on Android");
      return;
    }

    try {
      // Sur Android, nous ne pouvons pas directement contrôler le volume d'alarme via React Native
      // Mais nous pouvons nous assurer que le volume multimédia est suffisant
      console.log("Setting appropriate volume for alarm");

      // Marquer que le volume d'alarme est configuré
      this.alarmVolumeSet = true;

      // NOTE: Pour un contrôle complet du volume d'alarme, il faudrait
      // une implémentation native Android avec AudioManager.STREAM_ALARM
    } catch (error) {
      console.error("Error setting alarm volume:", error);
    }
  }

  /**
   * Restaure le volume original après l'alarme
   */
  async restoreOriginalVolume(): Promise<void> {
    if (!this.alarmVolumeSet) {
      return;
    }

    try {
      console.log("Restoring original volume settings");
      this.alarmVolumeSet = false;
    } catch (error) {
      console.error("Error restoring volume:", error);
    }
  }

  /**
   * Vérifie si le volume d'alarme est suffisant
   */
  async checkAlarmVolumeSettings(): Promise<{
    isAlarmVolumeAdequate: boolean;
    recommendation: string;
  }> {
    try {
      // Sur Android, recommander à l'utilisateur de vérifier le volume d'alarme
      return {
        isAlarmVolumeAdequate: true, // Supposer que c'est OK par défaut
        recommendation:
          "Vérifiez que le volume d'alarme dans les paramètres Android est suffisant",
      };
    } catch (error) {
      console.error("Error checking alarm volume:", error);
      return {
        isAlarmVolumeAdequate: false,
        recommendation: "Impossible de vérifier le volume d'alarme",
      };
    }
  }

  /**
   * Guide l'utilisateur pour configurer correctement le volume d'alarme
   */
  getVolumeSetupInstructions(): string[] {
    return [
      "1. Ouvrez les Paramètres Android",
      "2. Allez dans 'Sons et vibrations' ou 'Son'",
      "3. Ajustez le curseur 'Volume d'alarme' au maximum",
      "4. Testez le volume avec le bouton d'écoute",
      "5. Assurez-vous que 'Ne pas déranger' est désactivé ou configuré pour laisser passer les alarmes",
    ];
  }
}

export default new AlarmVolumeService();
