package expo.modules.systemalarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationManager
import android.app.NotificationChannel
import android.app.PendingIntent
import android.os.Build
import androidx.core.app.NotificationCompat
import android.media.AudioAttributes
import android.net.Uri
import android.app.KeyguardManager
import android.os.PowerManager
import android.view.WindowManager

class AlarmReceiver : BroadcastReceiver() {
  
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == "SYSTEM_ALARM_TRIGGERED") {
      val alarmId = intent.getStringExtra("alarmId") ?: return
      val stationUrl = intent.getStringExtra("stationUrl") ?: return
      val stationName = intent.getStringExtra("stationName") ?: return
      val vibrate = intent.getBooleanExtra("vibrate", false)
      
      // Réveiller l'écran et déverrouiller
      wakeUpScreen(context)
      
      // Lancer l'application avec l'écran d'alarme
      launchAlarmActivity(context, alarmId, stationUrl, stationName, vibrate)
      
      // Créer une notification full-screen comme backup
      createFullScreenNotification(context, alarmId, stationUrl, stationName, vibrate)
    }
  }
  
  private fun wakeUpScreen(context: Context) {
    val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
    
    // Réveiller l'écran
    val wakeLock = powerManager.newWakeLock(
      PowerManager.SCREEN_BRIGHT_WAKE_LOCK or 
      PowerManager.ACQUIRE_CAUSES_WAKEUP or 
      PowerManager.ON_AFTER_RELEASE,
      "RadioAlarm:AlarmWakeLock"
    )
    wakeLock.acquire(10 * 60 * 1000L) // 10 minutes max
    
    // Déverrouiller l'écran si possible
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      val activity: android.app.Activity? = null // Safe null handling
      if (activity != null) {
        keyguardManager.requestDismissKeyguard(activity, null)
      }
    }
  }
  
  private fun launchAlarmActivity(context: Context, alarmId: String, stationUrl: String, stationName: String, vibrate: Boolean) {
    val packageManager = context.packageManager
    val launchIntent = packageManager.getLaunchIntentForPackage(context.packageName)
    
    launchIntent?.let { intent ->
      intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or 
                    Intent.FLAG_ACTIVITY_CLEAR_TOP or
                    Intent.FLAG_ACTIVITY_SINGLE_TOP
      
      // Ajouter les données de l'alarme
      intent.putExtra("isSystemAlarm", true)
      intent.putExtra("alarmId", alarmId)
      intent.putExtra("stationUrl", stationUrl)
      intent.putExtra("stationName", stationName)
      intent.putExtra("vibrate", vibrate)
      
      context.startActivity(intent)
    }
  }
  
  private fun createFullScreenNotification(context: Context, alarmId: String, stationUrl: String, stationName: String, vibrate: Boolean) {
    val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channelId = "SYSTEM_ALARM_CHANNEL"
    
    // Créer le canal de notification pour les alarmes système
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "Alarmes Système",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Notifications pour les alarmes système"
        setSound(
          Uri.parse("android.resource://${context.packageName}/raw/alarm_sound"),
          AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .setUsage(AudioAttributes.USAGE_ALARM)
            .build()
        )
        enableVibration(true)
        vibrationPattern = longArrayOf(0, 1000, 500, 1000)
        setBypassDnd(true)
        lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      }
      notificationManager.createNotificationChannel(channel)
    }
    
    // Intent pour ouvrir l'application
    val fullScreenIntent = Intent(context, Class.forName("${context.packageName}.MainActivity")).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or 
              Intent.FLAG_ACTIVITY_CLEAR_TOP
      
      putExtra("isSystemAlarm", true)
      putExtra("alarmId", alarmId)
      putExtra("stationUrl", stationUrl)
      putExtra("stationName", stationName)
      putExtra("vibrate", vibrate)
    }
    
    val fullScreenPendingIntent = PendingIntent.getActivity(
      context,
      alarmId.hashCode(),
      fullScreenIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    
    // Créer la notification full-screen
    val notification = NotificationCompat.Builder(context, channelId)
      .setContentTitle("🔔 Alarme Radio")
      .setContentText("$stationName - Alarme activée")
      .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setFullScreenIntent(fullScreenPendingIntent, true)
      .setAutoCancel(false)
      .setOngoing(true)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .build()
    
    notificationManager.notify(alarmId.hashCode(), notification)
  }
}