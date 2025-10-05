package expo.modules.systemalarm

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat

class ExpoSystemAlarmModule : Module() {
  
  private val context: Context
    get() = appContext.reactContext ?: throw Exception("React context is null")

  override fun definition() = ModuleDefinition {
    Name("ExpoSystemAlarm")

    AsyncFunction("scheduleSystemAlarm") { alarmId: String, triggerTimeMillis: Double, stationUrl: String, stationName: String, vibrate: Boolean, promise: Promise ->
      try {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        
        // Créer l'Intent pour l'alarme
        val intent = Intent(context, AlarmReceiver::class.java).apply {
          putExtra("alarmId", alarmId)
          putExtra("stationUrl", stationUrl)
          putExtra("stationName", stationName)
          putExtra("vibrate", vibrate)
          action = "SYSTEM_ALARM_TRIGGERED"
        }

        val pendingIntent = PendingIntent.getBroadcast(
          context,
          alarmId.hashCode(),
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Programmer l'alarme exacte
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          if (alarmManager.canScheduleExactAlarms()) {
            alarmManager.setExactAndAllowWhileIdle(
              AlarmManager.RTC_WAKEUP,
              triggerTimeMillis.toLong(),
              pendingIntent
            )
            promise.resolve(true)
          } else {
            promise.resolve(false)
          }
        } else {
          alarmManager.setExact(
            AlarmManager.RTC_WAKEUP,
            triggerTimeMillis.toLong(),
            pendingIntent
          )
          promise.resolve(true)
        }
      } catch (e: Exception) {
        promise.reject("ALARM_ERROR", "Failed to schedule system alarm: ${e.message}", e)
      }
    }

    AsyncFunction("cancelSystemAlarm") { alarmId: String, promise: Promise ->
      try {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
          context,
          alarmId.hashCode(),
          intent,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        alarmManager.cancel(pendingIntent)
        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("CANCEL_ERROR", "Failed to cancel system alarm: ${e.message}", e)
      }
    }

    AsyncFunction("setAlarmAudioStream") { promise: Promise ->
      try {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        
        // Définir le stream audio sur ALARM au lieu de MUSIC
        // Ceci affecte le volume utilisé pour la lecture audio
        audioManager.requestAudioFocus(
          null,
          AudioManager.STREAM_ALARM,
          AudioManager.AUDIOFOCUS_GAIN
        )
        
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("AUDIO_ERROR", "Failed to set alarm audio stream: ${e.message}", e)
      }
    }

    AsyncFunction("restoreAudioStream") { promise: Promise ->
      try {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        audioManager.abandonAudioFocus(null)
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("AUDIO_ERROR", "Failed to restore audio stream: ${e.message}", e)
      }
    }

    AsyncFunction("canScheduleExactAlarms") { promise: Promise ->
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
          val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
          promise.resolve(alarmManager.canScheduleExactAlarms())
        } else {
          promise.resolve(true)
        }
      } catch (e: Exception) {
        promise.resolve(false)
      }
    }

    AsyncFunction("openAlarmSettings") { promise: Promise ->
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
          val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
          intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
          context.startActivity(intent)
        }
        promise.resolve(null)
      } catch (e: Exception) {
        promise.reject("SETTINGS_ERROR", "Failed to open alarm settings: ${e.message}", e)
      }
    }
  }
}