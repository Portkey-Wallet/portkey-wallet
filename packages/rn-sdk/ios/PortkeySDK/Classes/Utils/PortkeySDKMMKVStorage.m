//
//  PortkeySDKMMKVStorage.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/12.
//

#import "PortkeySDKMMKVStorage.h"
#import <MMKV/MMKV.h>

static const MMKV *storage;

@implementation PortkeySDKMMKVStorage

+ (void)initialize {
    if (self == [PortkeySDKMMKVStorage class]) {
        [MMKV initializeMMKV:nil];
        storage = [MMKV mmkvWithID:@"portkey-sdk"];
    }
}

+ (NSString *)readString:(NSString *)key {
    return [storage getStringForKey:key];
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
