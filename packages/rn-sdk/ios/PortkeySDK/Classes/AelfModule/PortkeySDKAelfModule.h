//
//  PortkeySDKAelfModule.h
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKAelfModule : NSObject

+ (instancetype)sharedInstance;

- (void)callNativeCallbackWithEventId:(NSString *)eventId result:(NSString *)result;

@end

NS_ASSUME_NONNULL_END
