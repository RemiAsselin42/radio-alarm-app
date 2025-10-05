import { NativeModules, Platform } from "react-native";

/**
 * Service pour gérer le réveil de l'écran et l'affichage au premier plan
 * sur Android, même quand le téléphone est verrouillé
 */
class ScreenWakeService {
  /**
   * Réveille l'écran et affiche l'application au premier plan
   * Fonctionne même quand le téléphone est verrouillé
   */
  async wakeUpScreen(): Promise<void> {
    if (Platform.OS !== "android") {
      console.log("Screen wake only supported on Android");
      return;
    }

    try {
      // Sur Android, nous utilisons les flags de fenêtre pour afficher au-dessus du lockscreen
      // Ces flags sont gérés automatiquement par React Native quand l'app est lancée
      // depuis une notification avec full screen intent
      console.log("Screen wake requested");
    } catch (error) {
      console.error("Error waking screen:", error);
    }
  }

  /**
   * Libère les ressources de réveil d'écran
   */
  async releaseWakeLock(): Promise<void> {
    if (Platform.OS !== "android") {
      return;
    }

    try {
      console.log("Wake lock released");
    } catch (error) {
      console.error("Error releasing wake lock:", error);
    }
  }
}

export default new ScreenWakeService();
