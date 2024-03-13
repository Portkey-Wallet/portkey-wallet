//
//  PortkeySDKStorageModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/16.
//

#import "PortkeySDKStorageModule.h"
#import <PortkeySDK/PortkeySDKMMKVStorage.h>

static NSString *kPortkeyInternalEncryptKey = @"kPortkeyInternalEncryptKey";

@implementation PortkeySDKStorageModule

RCT_EXPORT_MODULE(StorageModule);

- (NSDictionary *)constantsToExport {
    return @{
        @"internalEncryptKey": [self internalEncryptKey]
    };
}

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_METHOD(setString:(NSString *)key value:(NSString *)value)
{
    [PortkeySDKMMKVStorage writeString:value forKey:key];
}

RCT_EXPORT_METHOD(setBoolean:(NSString *)key value:(BOOL)value)
{
    [PortkeySDKMMKVStorage setBool:value forKey:key];
}

RCT_EXPORT_METHOD(setNumber:(NSString *)key value:(NSNumber *)value)
{
    [PortkeySDKMMKVStorage setDouble:[value doubleValue] forKey:key];
}

RCT_EXPORT_METHOD(getString:(NSString *)key
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject)
{
    resolve([PortkeySDKMMKVStorage readString:key] ?: @"");
}

RCT_EXPORT_METHOD(getBoolean:(NSString *)key
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@([PortkeySDKMMKVStorage getBool:key]));
}

RCT_EXPORT_METHOD(getNumber:(NSString *)key
                    resolve:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@([PortkeySDKMMKVStorage getDouble:key]));
}

- (NSString *)internalEncryptKey {
    NSUserDefaults *userDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"Portkey"];
    NSString *internalEncryptKey = [userDefaults stringForKey:kPortkeyInternalEncryptKey];
    if (internalEncryptKey && internalEncryptKey.length > 0) {
        return internalEncryptKey;
    } else {
        internalEncryptKey = [[NSUUID UUID] UUIDString] ?: @"";
        [userDefaults setObject:internalEncryptKey forKey:kPortkeyInternalEncryptKey];
        [userDefaults synchronize];
        return internalEncryptKey;
    }
}

@end
