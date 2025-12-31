#!/bin/bash
# Fix 16KB page size alignment for expo-modules-core
# This script patches the CMakeLists.txt to add the required linker flags

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
EXPO_CORE_CMAKE="$PROJECT_DIR/node_modules/expo-modules-core/android/CMakeLists.txt"

# Check if the file exists
if [ ! -f "$EXPO_CORE_CMAKE" ]; then
    echo "Warning: expo-modules-core CMakeLists.txt not found at $EXPO_CORE_CMAKE"
    exit 0
fi

# Check if already patched
if grep -q "max-page-size=16384" "$EXPO_CORE_CMAKE"; then
    echo "expo-modules-core already patched for 16KB alignment"
    exit 0
fi

echo "Patching expo-modules-core for 16KB page alignment..."

# Add the linker flag after the target_compile_options for CommonSettings
# This adds the 16KB page alignment flag to the shared library
cat >> "$EXPO_CORE_CMAKE" << 'EOF'

# 16KB page size alignment fix for Android 15+ (targetSdk 35+)
# Required for Google Play Store submission
if(ANDROID)
  target_link_options(${PACKAGE_NAME} PRIVATE "-Wl,-z,max-page-size=16384")
endif()
EOF

echo "Successfully patched expo-modules-core for 16KB alignment"

