const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Plugin Expo pour ajouter les permissions et configurations nécessaires
 * pour afficher l'alarme au-dessus de l'écran de verrouillage
 */
const withLockScreenAlarm = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults.manifest;

        // Ajouter les permissions
        if (!androidManifest.$) {
            androidManifest.$ = {};
        }

        // Ajouter les uses-permission si elles n'existent pas déjà
        if (!androidManifest["uses-permission"]) {
            androidManifest["uses-permission"] = [];
        }

        const permissions = [
            "android.permission.WAKE_LOCK",
            "android.permission.USE_FULL_SCREEN_INTENT",
            "android.permission.SYSTEM_ALERT_WINDOW",
            "android.permission.TURN_SCREEN_ON",
            "android.permission.SHOW_WHEN_LOCKED",
        ];

        permissions.forEach((permission) => {
            const exists = androidManifest["uses-permission"].some(
                (p) => p.$["android:name"] === permission
            );
            if (!exists) {
                androidManifest["uses-permission"].push({
                    $: { "android:name": permission },
                });
            }
        });

        // Modifier l'activité principale pour afficher au-dessus du lockscreen
        if (androidManifest.application && androidManifest.application[0].activity) {
            const mainActivity = androidManifest.application[0].activity.find(
                (activity) =>
                    activity.$["android:name"] === ".MainActivity" ||
                    activity.$["android:name"] === "com.radioalarm.app.MainActivity"
            );

            if (mainActivity) {
                // Ajouter les attributs pour afficher au-dessus du lockscreen
                mainActivity.$["android:showWhenLocked"] = "true";
                mainActivity.$["android:turnScreenOn"] = "true";
                mainActivity.$["android:showOnLockScreen"] = "true";
            }
        }

        return config;
    });
};

module.exports = withLockScreenAlarm;
