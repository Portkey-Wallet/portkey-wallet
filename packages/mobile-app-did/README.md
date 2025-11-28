<p align="center">
    <img width="200" src= "../../logo.png"/>
</p>

<h1 align="center">Portkey DID APP</h1>

[![Node Version](https://img.shields.io/badge/node-%3E%3D%2016.11.1-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![React Native](https://img.shields.io/badge/react--native-%3D0.69.7-red)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-%3D46.0.0-green)](https://docs.expo.dev/versions/latest/)

# Getting Start

## Prerequisites

Before getting started, 
the documentation assumes you are able to create a project with React Native, Expo(Bare workflow) and that you have an active Firebase project. 
If you do not meet these prerequisites, follow the links below:

[React Native - Setting up the development environment](https://reactnative.dev/docs/environment-setup)

[Create a new Firebase project](https://console.firebase.google.com/)

[Installing Expo modules](https://docs.expo.dev/bare/installing-expo-modules/)

## Code style

pre commit: husky + eslint + commit lint + prettier + Typescript

after publish: SuperLinter + eslint

Super Linter does not support rn yet. Waiting [PR2918](https://github.com/github/super-linter/pull/2918) to be merged.


## Installing
```
yarn
```

## Android 
```bash
yarn android
```

## iOS
```bash
yarn pod-install

yarn ios
```

## Debugging

First, make sure you have the following running:

-   Your Android emulator or iOS simulator
-   `yarn android` or `yarn ios`

Next, install the [Flipper](https://fbflipper.com/) desktop app (verified working with v0.127.0)

Finally, check that the debugger is working:

-   Open your emulator or simulator alongside the Flipper app
-   Flipper should auto-detect the device and the application to debug
-   You should now be able to access features such as `Logs`

### Debugging Physical iOS devices

-   Debugging physical iOS devices requires `idb` to be installed, which consists of 2 parts
-   Install the two idb parts:
    1. `brew tap facebook/fb` & `brew install idb-companion`
    2. `pip3.9 install fb-idb` (This step may require that you install python3 via `python -m pip3 install --upgrade pip`)

### Debug a website inside the WebView (in-app browser)

Android

-   Run the app in debug mode (for example, in a simulator)
-   Open Chrome on your desktop
-   Go to `chrome://inspect/#devices`
-   Look for the device and click inspect

iOS

-   Run the app in debug mode (for example, in a simulator)
-   Open Safari on your desktop
-   Go to the menu Develop -> [Your device] -> [Website]

You should see the console for the website that is running inside the WebView

#### Miscellaneous

-   [Troubleshooting for React Native](https://facebook.github.io/react-native/docs/troubleshooting#content)
-   [Flipper Documentation](https://fbflipper.com/docs/features/react-native/)


## Notifee
