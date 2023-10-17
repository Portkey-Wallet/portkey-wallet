//
//  PortkeySDKStorageModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/16.
//

#import "PortkeySDKStorageModule.h"
#import <PortkeySDK/PortkeySDKMMKVStorage.h>

@implementation PortkeySDKStorageModule

RCT_EXPORT_MODULE(StorageModule);

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

@end
