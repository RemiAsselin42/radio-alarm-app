// Test script pour vérifier le module ExpoSystemAlarm
const { SystemAlarm } = require('./modules/expo-system-alarm/functions');

console.log('Testing SystemAlarm module...');

if (SystemAlarm) {
    console.log('✅ SystemAlarm module loaded successfully');
    console.log('Available methods:', Object.keys(SystemAlarm));
} else {
    console.log('❌ SystemAlarm module failed to load');
}

// Test d'import ES6
try {
    const { SystemAlarm: SystemAlarmES6 } = require('./modules/expo-system-alarm/functions.ts');
    console.log('✅ ES6 import also works');
} catch (error) {
    console.log('⚠️  ES6 import needs build step:', error.message);
}