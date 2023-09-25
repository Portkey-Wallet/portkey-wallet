//
//  PortkeySDKAelfModule.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import "PortkeySDKAelfModule.h"
#import <React/RCTBridge.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>

@interface PortkeySDKAelfModule () <RCTBridgeDelegate>

@property (nonatomic, strong) RCTBridge *bridge;

@end

@implementation PortkeySDKAelfModule

+ (instancetype)sharedInstance {
    static PortkeySDKAelfModule *instance = nil;
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        instance = [PortkeySDKAelfModule new];
        instance.bridge = [[RCTBridge alloc] initWithDelegate:instance launchOptions:nil];
        [instance addNotification];
    });
    return instance;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)addNotification {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(javaScriptDidLoad:)
                                                 name:RCTJavaScriptDidLoadNotification
                                               object:_bridge];
}

- (void)bundleFinishedLoading:(RCTBridge *)bridge {
    // bundle finish load
}

#pragma mark - Notification

- (void)javaScriptDidLoad:(NSNotification *)notification
{
    RCTBridge *bridge = notification.userInfo[@"bridge"];
    if (bridge != _bridge) {
        [self bundleFinishedLoading:bridge];
    }
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
    return [PortkeySDKBundleUtil sourceURL];
}

@end
