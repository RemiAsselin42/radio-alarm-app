package expo.modules.systemalarm

import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactPackage
import expo.modules.kotlin.modules.Module

class ExpoSystemAlarmPackage : Package {
  override fun createExpoModules(): List<Module> = listOf(ExpoSystemAlarmModule())
}