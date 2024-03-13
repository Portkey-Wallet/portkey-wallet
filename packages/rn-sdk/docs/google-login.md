# Configure Google Login For Portkey SDK

## 1. Generate client Ids

You can generate client ids for each of the platforms that are needed for Portkey SDK to use.

1. Go to [Google API Console](https://console.developers.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Click on `Create credentials` and select `OAuth client ID`
4. Select the application type:
   1. `Android` for Android Applications, you should provide the package name and the SHA-1 signing-certificate fingerprint that are about to be used to sign the APK.
   2. `Web application` for Web Applications, if you don't have other requirements, leave the optional fields empty
   3. `iOS` for iOS Applications, you should provide the bundle identifier which is written in the `Info.plist` file
5. Click on `Create` and copy the generated client id
6. Repeat the steps for each platform of `Android`, `iOS` and `Web application`, and copy the generated client ids from the console

## 2. Usage

Complete the content below and add it to the `.env` file in the root directory of your react-native project.

```properties
GOOGLE_WEB_CLIENT_ID = "your google web client id"
GOOGLE_IOS_CLIENT_ID = "your google ios client id"
GOOGLE_ANDROID_CLIENT_ID = "your google android client id"
```
