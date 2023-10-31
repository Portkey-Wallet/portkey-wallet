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

static const NSString *kPortkeySDKTempStorageIdentifier;

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
    return @[@"onShow"];
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

+ (void)sendOnShowEventWithModuleName:(NSString *)moduleName bridge:(RCTBridge *)bridge reactTag:(NSNumber *)reactTag {
    PortkeySDKNativeWrapperModule *module = [bridge moduleForClass:self];
    return [module sendOnShowEvent:reactTag];
}

- (void)sendOnShowEvent:(NSNumber *)reactTag {
    [self sendEventWithName:@"onShow" body:reactTag];
}

@end
