const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Plugin Expo pour le module système d'alarme
 * Configure les permissions et le BroadcastReceiver pour les vraies alarmes système
 */
const withSystemAlarm = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults.manifest;

        // Ajouter les permissions spécifiques aux alarmes système
        if (!androidManifest["uses-permission"]) {
            androidManifest["uses-permission"] = [];
        }

        const alarmPermissions = [
            "android.permission.SCHEDULE_EXACT_ALARM",
            "android.permission.USE_EXACT_ALARM",
            "android.permission.WAKE_LOCK",
            "android.permission.USE_FULL_SCREEN_INTENT",
            "android.permission.SYSTEM_ALERT_WINDOW",
        ];

        alarmPermissions.forEach((permission) => {
            const exists = androidManifest["uses-permission"].some(
                (p) => p.$["android:name"] === permission
            );
            if (!exists) {
                androidManifest["uses-permission"].push({
                    $: { "android:name": permission },
                });
            }
        });

        // Ajouter le BroadcastReceiver pour les alarmes système
        if (androidManifest.application && androidManifest.application[0]) {
            if (!androidManifest.application[0].receiver) {
                androidManifest.application[0].receiver = [];
            }

            // Ajouter le AlarmReceiver
            const alarmReceiver = {
                $: {
                    "android:name": "expo.modules.systemalarm.AlarmReceiver",
                    "android:enabled": "true",
                    "android:exported": "false",
                },
                "intent-filter": [
                    {
                        action: [
                            {
                                $: {
                                    "android:name": "SYSTEM_ALARM_TRIGGERED",
                                },
                            },
                        ],
                    },
                ],
            };

            // Vérifier si le receiver n'existe pas déjà
            const receiverExists = androidManifest.application[0].receiver.some(
                (receiver) =>
                    receiver.$["android:name"] === "expo.modules.systemalarm.AlarmReceiver"
            );

            if (!receiverExists) {
                androidManifest.application[0].receiver.push(alarmReceiver);
            }
        }

        return config;
    });
};

module.exports = withSystemAlarm;