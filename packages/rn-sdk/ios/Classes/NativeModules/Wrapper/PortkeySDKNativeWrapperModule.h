//
//  PortkeySDKNativeWrapperModule.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKNativeWrapperModule : RCTEventEmitter <RCTBridgeModule>

+ (void)sendOnShowEventWithModuleName:(NSString *)moduleName bridge:(RCTBridge *)bridge containerId:(NSString *)containerId;

+ (void)sendOnNewIntentWithParams:(NSDictionary *)params bridge:(RCTBridge *)bridge;

@end

NS_ASSUME_NONNULL_END
