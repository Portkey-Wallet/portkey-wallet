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

+ (void)writeString:(NSString *)value forKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
