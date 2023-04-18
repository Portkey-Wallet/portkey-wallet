# React Native Wallet APP 

[![GitHub Super-Linter](https://github.com/AElfProject/aelf-wallet-rn/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)
[![Node Version](https://img.shields.io/badge/node-%3E%3D%2016.11.1-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![React Native](https://img.shields.io/badge/react--native-%3D0.68.2-red)](https://reactnative.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo%20SDK-%3D45.0.0-green)](https://docs.expo.dev/versions/latest/)

# Getting Start

## Prerequisites

Before getting started, 
the documentation assumes you are able to create a project with React Native, Expo(Bare workflow) and that you have an active Firebase project. 
If you do not meet these prerequisites, follow the links below:

[React Native - Setting up the development environment](https://reactnative.dev/docs/environment-setup)

[Create a new Firebase project](https://console.firebase.google.com/)

[Installing Expo modules](https://docs.expo.dev/bare/installing-expo-modules/)

## How dev

## Code style

pre commit: husky + eslint + commit lint + prettier + Typescript

after publish: SuperLinter + eslint

Super Linter does not support rn yet. Waiting [PR2918](https://github.com/github/super-linter/pull/2918) to be merged.

## Expo

What can we do with Expo in Bare React Native.
https://docs.expo.dev/introduction/managed-vs-bare/#workflow-comparison

### Step 1 Install Expo
Expo [Automatic installation](https://docs.expo.dev/bare/installing-expo-modules/#automatic-installation)

iOS [Todo] `pod install`

```zsh
› Installing ios pods...
> pod install
Couldn't install Pods. Updating the Pods project and trying again...
> pod install --repo-update
Couldn't install Pods. Updating the Pods project and trying again...
Uncaught Error CocoaPodsError: Command `pod install` failed.
└─ Cause: spawn pod ENOENT
    at getImprovedPodInstallError (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:908331)
    at CocoaPodsPackageManager.handleInstallErrorAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:903884)
    at CocoaPodsPackageManager.runInstallTypeCommandAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:904913)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async CocoaPodsPackageManager._installAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:904482)
    at async CocoaPodsPackageManager.handleInstallErrorAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:904075)
    at async CocoaPodsPackageManager.runInstallTypeCommandAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:904902)
    at async CocoaPodsPackageManager._installAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:904482)
    at async CocoaPodsPackageManager.installAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:903518)
    at async installPodsAsync (/Users/huangzongzhe/.npm/_npx/b99c464f4819196b/node_modules/install-expo-modules/build/index.js:33:977028) {
  code: 'COMMAND_FAILED',
  cause: Error: spawn pod ENOENT
      at Process.ChildProcess._handle.onexit (node:internal/child_process:282:19)
      at onErrorNT (node:internal/child_process:477:16)
      at processTicksAndRejections (node:internal/process/task_queues:83:21) {
    errno: -2,
    code: 'ENOENT',
    syscall: 'spawn pod',
    path: 'pod',
    spawnargs: [ 'install', '--repo-update', '--ansi' ],
    pid: undefined,
    output: [ '', '' ],
    stdout: '',
    stderr: '',
    status: null,
    signal: null
  },
  isPackageManagerError: true
}
```

### Sept 2 Install modules from Expo SDK & Rebuild APP

For example:
```zsh
# add battery module
expo install expo-battery
# rebuild your app
yarn android # yarn ios
# We can call the API of expo-battery in our APP now.
```

## Notifee
