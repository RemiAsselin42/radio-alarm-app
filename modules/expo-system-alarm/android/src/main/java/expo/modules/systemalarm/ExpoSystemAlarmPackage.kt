package expo.modules.systemalarm

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSystemAlarmPackage : expo.modules.core.interfaces.Package {
  override fun createExpoModules(): List<Module> = listOf(ExpoSystemAlarmModule())
}