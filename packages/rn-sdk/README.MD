# Portkey React Native SDK

## Read this first

This readme.md doc is presented for pure react-native project. If you are using expo, please refer to [expo-sdk-doc](https://github.com/Portkey-Wallet/react-native-sdk/blob/master/README-EXPO.MD).

Don't know whether you are an expo project user? If one of the following conditions is met, you are an expo project user:

1. you created your project with expo-cli-like command, such as `expo init my-project` or `npx create-expo-app XXX`
2. you can find `.expo` dictionary in your project root path
3. you can find those expo's commands in your package.json file that look like:

```JSON
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  ...
```

## Installation

__Note: react-native's version should be less than v0.73.0 !__

### Step 1: Install npm package

``` shell
npm install @portkey/react-native-sdk --save
# or
yarn add @portkey/react-native-sdk
```

### Step 2: Configure your project

1. Configure the expo autolinking plugin

    ``` groovy
    //in android/settings.gradle file
    dependencyResolutionManagement {
        repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
        repositories {
            google()
            mavenCentral()
            maven { url "https://jitpack.io" }
            // add this maven path for expo-camera dependencies
            maven {
                url "../node_modules/expo-camera/android/maven"
            }
        }
    }

    // add the follow code for autolink
    apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle");
    useExpoModules()
    ```

    ``` podspec
    # in iOS Podfile, add the follow code

    platform :ios, '13.0'

    require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")

    use_expo_modules!
    post_integrate do |installer|
      begin
        expo_patch_react_imports!(installer)
      rescue => e
        Pod::UI.warn e
      end
    end
    ```

2. Create .env file

    In order to use Google login, You need to create an __.env__ file in the same directory as __package.json__, which must contain __GOOGLE_WEB_CLIENT_ID__, __GOOGLE_IOS_CLIENT_ID__ and __GOOGLE_ANDROID_CLIENT_ID__.

    See [Configure Google Login For Portkey SDK](https://github.com/Portkey-Wallet/react-native-sdk/blob/master/docs/google-login.md) for details.

    ``` properties
    # .env file like this
    GOOGLE_WEB_CLIENT_ID = "your google web client id"
    GOOGLE_IOS_CLIENT_ID = "your google ios client id"
    GOOGLE_ANDROID_CLIENT_ID = "your google android client id"
    ```

3. extends tsconfig.json

    In your tsconfig.json, add  "extends" key-value.

    ``` JSON
    {
      "extends": "@portkey/react-native-sdk/tsconfig.json",
      "compilerOptions": {
        ...
      }
    }
    ```

    if you already extends other tsconfig.json, you can config like this:

    ``` JSON
    {
      "compilerOptions": {
          // add this code
          "types": ["reflect-metadata"],
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true,
      }

    }
    ```

4. deal with the version gap

      Since both our SDK project and your project are using particular versions of several dependencies that are common in react-native development, there may be version conflicts, which will cause runtime errors.

      For example, if your project is using react-native version 0.63.4, but our SDK project is using react-native version 0.63.3, then there will be a version conflict. The only way to stop this conflict is to make sure that both projects are using the same version of react-native.

      You can solve this problem by those instructions:

      a. check the SDK's dependencies

      Please refer to the package.json file in the dictionary of `<Your Project Root>/node_modules/@portkey/react-native-sdk`, and check the dependencies' and 'devDependencies' field. You can ignore those dependencies marked with "peerDependencies" since they have no version code.

      b. check your project's dependencies and compare

      Check your project's package.json file, and compare the dependencies' and 'devDependencies' field with the SDK's. Record the version code of those dependencies that are different from the SDK's.

      c. make a decision

      We recommend you to use the same version of conflicting dependencies as the SDK's. You can do that by changing your project's dependencies' version code to the SDK's version code.

      But if for some reason you can't do that, you can try to use your project's version code and make the SDK's version code the same as yours. But this may cause some unexpected errors.

      You can use the ```resolutions``` field or ```overrides``` field in your project's package.json file to solve this problem. the ```resolutions``` field will only work on ```yarn```, and the ```overrides``` field will only work on ```npm``` (although they all looks the same).

      ```JSON
      {
        "dependencies": {
          "react-native": "0.63.4", // and SDK is using 0.63.3
          ...
        },

        // use resolutions field for yarn
        "resolutions": {
          "react-native": "0.63.3"
        },

        // use overrides field for npm
        "overrides": {
          "react-native": "0.63.3"
        }
      }
      ```

      This will force the react-native version to be 0.63.3, which is the same as the SDK's.

      To make sure there are no other version conflicts, you can check that there are no matching dependencies under `<Your Project Root>/node_modules/@portkey/react-native-sdk/node_modules`, since dependency conflicts will make a different version of the same dependency coexists in there.

### Step 3: Init

``` TS
// Please import the following statement in your entry file
import '@portkey/react-native-sdk';
```

> Note: We use autolink, you don't need to configure Android/iOS dependencies. But you need to recompile your Android/iOS project so that the autolink takes effect.

Now, all configuration is complete and you can use the portkey service freely.

## API Usage

``` TS
import { portkey } from '@portkey/react-native-sdk';
// get walletInfo
const walletInfo = await portkey.getWalletInfo();
// open assets dashboard
portkey.openAssetsDashboard();
```

## Function Introduction

``` TS
import { portkey } from '@portkey/react-native-sdk';

// Open login page and return UnlockedWallet object after login
function login(): Promise<UnlockedWallet | undefined>;

// Open assets dashboard
function openAssetsDashboard();

// Open guardians manager page
function guardiansManager();

// Open settings manager page
function settingsManager();

// Open Scan QRCode page
function scanQRCodeManager();

// Open payment security manager page
function paymentSecurityManager();

// Unlock wallet and return UnlockedWallet object
function unlockWallet(): Promise<UnlockedWallet | undefined>;

// Call contract method
function callCaContractMethod(props: CallCaMethodProps): Promise<BaseMethodResult>;

// Get wallet info
function getWalletInfo(): Promise<UnlockedWallet>;

// Get wallet state
function getWalletState(): Promise<WalletState>();

// Lock wallet
function lockWallet(): Promise<boolean>();

// Exit wallet
function exitWallet(): Promise<boolean>();
```

 Feel free to open an issue or contact us if you have any questions.

## Q&A

__Q: Why does Google login always prompt "login fail"?__

A: Make sure the applicationId, keystore, .env file correspond correctly.

__Q: problem occurred evaluating project ':portkey_react-native-sdk'. > Project with path ':expo-modules-core' could not be found in project ':portkey_react-native-sdk'.__

A: make sure you have set the expo autolink config in android/settings.gradle file.
