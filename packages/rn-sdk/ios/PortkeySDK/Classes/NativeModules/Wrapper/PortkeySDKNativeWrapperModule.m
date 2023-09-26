//
//  PortkeySDKNativeWrapperModule.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKNativeWrapperModule.h"

@implementation PortkeySDKNativeWrapperModule

RCT_EXPORT_MODULE(NativeWrapperModule);

- (NSDictionary *)constantsToExport
{
    return @{ @"platformName": @"ios" };
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
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
    
}

@end
