//
//  PortkeySDKMMKVStorage.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/12.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKMMKVStorage : NSObject

+ (NSString *)readString:(NSString *)key;
+ (NSString *)readTempString:(NSString *)key;
+ (void)writeString:(NSString *)value forKey:(NSString *)key;

+ (BOOL)getBool:(NSString *)key;
+ (void)setBool:(BOOL)value forKey:(NSString *)key;

+ (double)getDouble:(NSString *)key;
+ (void)setDouble:(double)value forKey:(NSString *)key;

+ (void)clear;


@end

NS_ASSUME_NONNULL_END
