//
//  PortkeySDKMMKVStorage.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/12.
//

#import "PortkeySDKMMKVStorage.h"
#import <MMKV/MMKV.h>

static const MMKV *storage;
extern const NSString *kPortkeySDKTempStorageIdentifier;

@implementation PortkeySDKMMKVStorage

+ (void)initialize {
    if (self == [PortkeySDKMMKVStorage class]) {
        [MMKV initializeMMKV:nil];
        NSData *cryptKey = [@"PortkeyCrypyKey" dataUsingEncoding:NSUTF8StringEncoding];
        storage = [MMKV mmkvWithID:@"portkey-sdk" cryptKey:cryptKey];
    }
}

+ (NSString *)readString:(NSString *)key {
    return [storage getStringForKey:key];
}

+ (NSString *)readTempString:(NSString *)key {
    NSString *tempKey = [NSString stringWithFormat:@"%@#%@", key, kPortkeySDKTempStorageIdentifier];
    return [self readString:tempKey];
}

+ (void)writeString:(NSString *)value forKey:(NSString *)key {
    if (key) {
        [storage setString:value forKey:key];
    }
}

+ (BOOL)getBool:(NSString *)key {
    return [storage getBoolForKey:key defaultValue:NO];
}

+ (void)setBool:(BOOL)value forKey:(NSString *)key {
    if (key) {
        [storage setBool:value forKey:key];
    }
}

+ (double)getDouble:(NSString *)key {
    return [storage getDoubleForKey:key];
}

+ (void)setDouble:(double)value forKey:(NSString *)key {
    if (key) {
        [storage setDouble:value forKey:key];
    }
}

+ (void)clear {
    [storage clearAll];
}

@end
