import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from "expo-audio";
import { RadioStation } from "../types";

class RadioPlayerService {
  private sound: AudioPlayer | null = null;
  private isPlaying: boolean = false;
  private isInitialized: boolean = false;

  async initialize() {
    // Si déjà initialisé, ne pas réinitialiser
    if (this.isInitialized) {
      console.log("Audio already initialized, skipping");
      return;
    }

    try {
      // Initialiser l'audio avec un timeout de 5 secondes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Audio initialization timeout")),
          5000
        )
      );

      const initPromise = setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });

      await Promise.race([initPromise, timeoutPromise]);
      this.isInitialized = true;
      console.log("Audio initialized successfully");
    } catch (error) {
      console.error("Error initializing audio:", error);
      // Marquer comme initialisé même en cas d'erreur pour éviter les tentatives infinies
      this.isInitialized = true;
      // Ne pas propager l'erreur, l'app peut continuer
    }
  }

  async playStation(station: RadioStation, fadeIn: boolean = false) {
    try {
      // Arrêter la lecture en cours si nécessaire
      if (this.sound) {
        await this.stop();
      }

      console.log("Creating audio player for:", station.streamUrl);

      // Créer un nouveau lecteur audio avec la source
      const player = createAudioPlayer({
        uri: station.streamUrl,
      });

      // IMPORTANT: Définir le volume à 0 IMMÉDIATEMENT si fade-in activé
      // Cela évite un pic de son au démarrage
      if (fadeIn) {
        player.volume = 0.0;
        console.log("Starting with volume at 0 for fade-in");
      } else {
        player.volume = 1.0;
      }

      // Sauvegarder la référence avant de lancer la lecture
      this.sound = player;

      // Démarrer la lecture APRÈS avoir configuré le volume
      console.log("Starting playback...");
      await player.play();

      this.isPlaying = true;
      console.log("Playing radio:", station.name);

      // Si fade-in activé, augmenter progressivement le volume
      if (fadeIn) {
        // Attendre 500ms avant de commencer le fade-in pour s'assurer que le stream est stable
        setTimeout(() => {
          this.fadeInVolume();
        }, 500);
      }
    } catch (error) {
      console.error("Error playing radio:", error);
      this.sound = null;
      this.isPlaying = false;
      throw error;
    }
  }

  private fadeInVolume() {
    // Augmenter le volume de 0 à 1 sur 30 secondes
    const duration = 30000; // 30 secondes
    const steps = 60; // 60 étapes
    const stepDuration = duration / steps;
    const volumeIncrement = 1.0 / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (!this.sound || !this.isPlaying) {
        clearInterval(interval);
        return;
      }

      currentStep++;
      const newVolume = Math.min(currentStep * volumeIncrement, 1.0);
      this.sound.volume = newVolume;

      if (currentStep >= steps) {
        clearInterval(interval);
        console.log("Fade-in completed");
      }
    }, stepDuration);
  }

  async stop() {
    try {
      if (this.sound) {
        this.sound.pause();
        this.sound.remove();
        this.sound = null;
        this.isPlaying = false;
        console.log("Radio stopped");
      }
    } catch (error) {
      console.error("Error stopping radio:", error);
    }
  }

  async pause() {
    try {
      if (this.sound && this.isPlaying) {
        this.sound.pause();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error("Error pausing radio:", error);
    }
  }

  async resume() {
    try {
      if (this.sound && !this.isPlaying) {
        this.sound.play();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error("Error resuming radio:", error);
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export default new RadioPlayerService();
