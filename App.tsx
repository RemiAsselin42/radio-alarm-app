import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { HomeScreen } from "./src/screens/HomeScreen";
import { EditAlarmScreen } from "./src/screens/EditAlarmScreen";
import { AlarmRingingScreen } from "./src/screens/AlarmRingingScreen";
import RadioPlayerService from "./src/services/RadioPlayer";

const Stack = createStackNavigator();

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export default function App() {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    // Initialiser de manière non-bloquante
    initializeApp().catch((error) => {
      console.error("Erreur lors de l'initialisation:", error);
    });

    // Écouter les notifications reçues quand l'app est ouverte
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification reçue:", notification);
        // Pour les alarmes avec fullScreenIntent, naviguer immédiatement
        const data = notification.request.content.data;
        if (
          data.fullScreenIntent &&
          data.stationUrl &&
          data.stationName &&
          navigationRef.current
        ) {
          // Forcer la navigation vers l'écran d'alarme
          setTimeout(() => {
            navigationRef.current?.navigate("AlarmRinging", {
              stationUrl: data.stationUrl,
              stationName: data.stationName,
              vibrate: data.vibrate || false,
            });
          }, 100);
        }
      }
    );

    // Écouter les interactions avec les notifications (clic sur la notification)
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data.stationUrl && data.stationName && navigationRef.current) {
          // Délai minimal pour assurer que l'app est prête
          setTimeout(() => {
            navigationRef.current?.navigate("AlarmRinging", {
              stationUrl: data.stationUrl,
              stationName: data.stationName,
              vibrate: data.vibrate || false,
            });
          }, 50);
        }
      });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Initialiser le service audio de manière asynchrone
      await RadioPlayerService.initialize();
      console.log("RadioPlayerService initialisé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      // L'app continue de fonctionner même si l'initialisation échoue
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#1a1a1a" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditAlarm" component={EditAlarmScreen} />
        <Stack.Screen
          name="AlarmRinging"
          component={AlarmRingingScreen}
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
