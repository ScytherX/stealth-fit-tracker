#!/bin/bash
export JAVA_HOME=/home/linuxbrew/.linuxbrew/opt/openjdk@21

echo "Verificando versión de Java..."
JAVA_VER=$($JAVA_HOME/bin/java -version 2>&1 | head -1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)

if [ -z "$JAVA_VER" ] || [ "$JAVA_VER" -lt 21 ]; then
    echo "⚠️ No se encontró Java 21 en $JAVA_HOME"
    exit 1
fi

echo "✅ Usando Java $JAVA_VER desde $JAVA_HOME"
echo "Compilando el APK (Debug)..."
cd android
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ APK compilado con éxito."
    echo "El archivo APK se encuentra en: android/app/build/outputs/apk/debug/app-debug.apk"
    echo "Puedes enviarlo a tus amigos o instalarlo en tu teléfono con: adb install android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo "❌ Error al compilar el APK."
fi
