//
//  PortkeySDKRouterModule.h
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/21.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKRouterModule : NSObject <RCTBridgeModule>

+ (instancetype)sharedInstance;

- (void)navigateTo:(NSString *)entry targetScene:(NSString *)targetScene;

@end

NS_ASSUME_NONNULL_END
