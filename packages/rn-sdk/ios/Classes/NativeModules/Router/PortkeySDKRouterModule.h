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

- (void)navigateTo:(NSString *)entry
        launchMode:(NSString *)launchMode
              from:(NSString *)from
       targetScene:(NSString *)targetScene
closeCurrentScreen:(BOOL)closeCurrentScreen
            params:(NSDictionary *)params;

- (void)navigateToWithOptions:(NSString *)entry
                   launchMode:(NSString *)launchMode
                         from:(NSString *)from
                       params:(NSDictionary *)params
                     callback:(RCTResponseSenderBlock)callback;

@end

NS_ASSUME_NONNULL_END
