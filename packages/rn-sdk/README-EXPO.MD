# Portkey React Native SDK

## Read this first

This readme.md doc is presented for pure expo-cli project. If you are using react-native, please refer to [react-native-sdk-doc](https://github.com/Portkey-Wallet/react-native-sdk/blob/master/README.MD).

## Installation

__Note that: we recommend that your react-native's version should be v0.72.X, and expo's version should be v49.X.X.__

### Step 1: Install npm package

``` shell
npm install @portkey/react-native-sdk --save
# or
yarn add @portkey/react-native-sdk
```

### Step 2: Configure your project

1. Change your expo's generated project to bare workflow

    Our SDK contains `NativeModules` code which is written in native language, so it will not work properly on Expo Go since if will only compile js/ts codes.

    Luckily, Expo provides a way to convert your project to bare workflow, providing you with the ability to compile native code. See [Expo Bare Workflow](https://docs.expo.dev/archive/managed-vs-bare/) for details.

    You can accomplish this by running the following command in your project directory:

    ``` shell
    expo prebuild
    ```

    After that, you can find a new directory named `ios` and `android` in your project directory.

2. Install the ```expo-dev-client```

    ```expo-dev-client``` is a package that allows you to use Expo Go to run your bare workflow project. See [Expo Dev Client](https://docs.expo.dev/clients/introduction/) for details.

    ``` shell
    yarn add expo-dev-client
    ```

    The next step is to generate your bare workflow apps. If you have the experience to support native projects Configuration, you can use ```XCode``` and ```Android Studio``` to open the ```android``` and ```ios``` directories and compile your project. If not, you should follow the instructions in the [Expo Dev Build](https://docs.expo.dev/develop/development-builds/create-a-build/#prerequisites) to finish development builds.

3. Ensure you are using the correct version of required dependencies

    You should provide the ```resolution``` field in your package.json file to make sure we are using the same version of important dependencies.

    For example, if you are using react-native v0.72.4 and expo v49.0.0, you should add the following code to your package.json file:

    ``` json
    {
        "dependencies":{
            "react-native": "0.72.4",
            "expo": "49.0.0",
            ...
       },
        "resolutions": {
            "react-native": "0.72.4",
            "expo": "49.0.0",
            ...
      }
    }
    ```

4. Create .env file

    In order to use Google login, You need to create an __.env__ file in the same directory as __package.json__, which must contain __GOOGLE_WEB_CLIENT_ID__, __GOOGLE_IOS_CLIENT_ID__ and __GOOGLE_ANDROID_CLIENT_ID__.

    See [Configure Google Login For Portkey SDK](https://github.com/Portkey-Wallet/react-native-sdk/blob/master/docs/google-login.md) for details.

    ``` properties
    # .env file like this
    GOOGLE_WEB_CLIENT_ID = "your google web client id"
    GOOGLE_IOS_CLIENT_ID = "your google ios client id"
    GOOGLE_ANDROID_CLIENT_ID = "your google android client id"
    ```

5. deal with the version gap

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

Once you finish installing the APPs compiled by those generated projects, open it on your device and run ```yarn start``` to start the metro bundler, and press ```R``` button to start reloading bundles.

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
