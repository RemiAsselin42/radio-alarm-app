import { Vibration, Platform } from "react-native";

class VibrationService {
  private isVibrating: boolean = false;
  private vibrationTimer: NodeJS.Timeout | null = null;

  /**
   * Démarre une vibration progressive
   * Augmente progressivement l'intensité sur 30 secondes
   */
  startProgressiveVibration() {
    if (Platform.OS !== "android") {
      console.log("Progressive vibration only supported on Android");
      return;
    }

    if (this.isVibrating) {
      console.log("Vibration already in progress");
      return;
    }

    this.isVibrating = true;
    console.log("Starting progressive vibration");

    // Durée totale: 30 secondes
    const totalDuration = 30000;
    const stepDuration = 2000; // Changer toutes les 2 secondes
    const steps = totalDuration / stepDuration; // 15 étapes

    let currentStep = 0;

    const vibrate = () => {
      if (!this.isVibrating) {
        return;
      }

      currentStep++;

      // Calculer l'intensité (durée de vibration) progressive
      // De 50ms à 1000ms sur 30 secondes pour un démarrage très doux
      const minDuration = 50;
      const maxDuration = 1000;
      const vibrationDuration = Math.min(
        minDuration + (currentStep / steps) * (maxDuration - minDuration),
        maxDuration
      );

      // Calculer la pause entre les vibrations (diminue avec le temps)
      // De 1950ms à 1000ms
      const pauseDuration = Math.max(stepDuration - vibrationDuration, 1000);

      // Pattern: [vibration, pause]
      // Utiliser une seule vibration courte au lieu d'un pattern répété
      Vibration.vibrate(vibrationDuration);

      if (currentStep < steps) {
        this.vibrationTimer = setTimeout(vibrate, stepDuration);
      } else {
        // Après 30 secondes, continuer avec une vibration constante
        this.startConstantVibration();
      }
    };

    // Démarrer la première vibration après 1 seconde
    setTimeout(vibrate, 1000);
  }

  /**
   * Démarre une vibration constante après la phase progressive
   */
  private startConstantVibration() {
    if (!this.isVibrating) {
      return;
    }

    console.log("Starting constant vibration");
    // Pattern: pause 500ms, vibre 1000ms, répète
    const pattern = [500, 1000];
    Vibration.vibrate(pattern, true); // true = répéter
  }

  /**
   * Arrête toute vibration en cours
   */
  stopVibration() {
    if (!this.isVibrating) {
      return;
    }

    console.log("Stopping vibration");
    this.isVibrating = false;

    if (this.vibrationTimer) {
      clearTimeout(this.vibrationTimer);
      this.vibrationTimer = null;
    }

    Vibration.cancel();
  }

  /**
   * Vérifie si une vibration est en cours
   */
  getIsVibrating(): boolean {
    return this.isVibrating;
  }
}

export default new VibrationService();
