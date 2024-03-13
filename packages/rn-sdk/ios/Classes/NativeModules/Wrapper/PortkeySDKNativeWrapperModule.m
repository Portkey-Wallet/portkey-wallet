//
//  PortkeySDKNativeWrapperModule.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKNativeWrapperModule.h"
#import <PortkeySDK/PortkeySDKJSCallModule.h>

@implementation PortkeySDKNativeWrapperModule

RCT_EXPORT_MODULE(NativeWrapperModule);

const NSString *kPortkeySDKTempStorageIdentifier;

+ (void)initialize {
    if (self == [PortkeySDKNativeWrapperModule class]) {
        kPortkeySDKTempStorageIdentifier = [[NSUUID UUID] UUIDString];
    }
}

- (NSDictionary *)constantsToExport
{
    return @{
        @"platformName": @"ios",
        @"tempStorageIdentifier": kPortkeySDKTempStorageIdentifier
    };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onShow", @"onNewIntent"];
}

RCT_EXPORT_METHOD(onError:(NSString *)from errMsg:(NSString *)errMsg data:(id)data)
{
    
}

RCT_EXPORT_METHOD(onFatalError:(NSString *)from errMsg:(NSString *)errMsg data:(id)data)
{
    
}

RCT_EXPORT_METHOD(onWarning:(NSString *)from warnMsg:(NSString *)errMsg)
{
    
}

RCT_EXPORT_METHOD(emitJSMethodResult:(NSString *)eventId result:(NSString *)result)
{
    [[PortkeySDKJSCallModule sharedInstance] callCallbackWithEventId:eventId result:result];
}

+ (void)sendOnShowEventWithModuleName:(NSString *)moduleName bridge:(RCTBridge *)bridge containerId:(NSString *)containerId {
    PortkeySDKNativeWrapperModule *module = [bridge moduleForClass:self];
    return [module sendOnShowEvent:@{
        @"containerId": containerId ?: @""
    }];
}

+ (void)sendOnNewIntentWithParams:(NSDictionary *)params bridge:(RCTBridge *)bridge {
    PortkeySDKNativeWrapperModule *module = [bridge moduleForClass:self];
    [module sendEventWithName:@"onNewIntent" body:params];
}

- (void)sendOnShowEvent:(NSDictionary *)body {
    [self sendEventWithName:@"onShow" body:body];
}

@end
