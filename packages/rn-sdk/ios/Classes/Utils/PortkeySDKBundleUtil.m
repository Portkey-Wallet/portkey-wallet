//
//  PortkeySDKBundleUtil.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import "PortkeySDKBundleUtil.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTBridgeDelegate.h>
#import <PortkeySDK/PortkeySDKMMKVStorage.h>
#import <PortkeySDK/PortkeySDKPortkey.h>

const static NSString *kUseLocalBundleKey = @"UseLocalBundleKey";

@implementation PortkeySDKBundleUtil

+ (NSURL *)bundleUrl {
    NSString *bundlePath = [[NSBundle bundleForClass:[self class]].resourcePath
                                stringByAppendingPathComponent:@"/JSBundle.bundle"];
    NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
    NSURL *sourceUrl = [resourceBundle URLForResource:@"index.ios" withExtension:@"bundle"];
    return sourceUrl;
}

+ (void)setUseLocalBundle:(BOOL)useLocal {
    [PortkeySDKMMKVStorage setBool:useLocal forKey:(NSString *)kUseLocalBundleKey];
}

+ (BOOL)useLocalBundle {
    return [PortkeySDKMMKVStorage getBool:(NSString *)kUseLocalBundleKey];
}

+ (NSURL *)sourceURL
{
    if ([PortkeySDKPortkey portkey].config.isUseInNativeApp) {
#if DEBUG
        if ([self useLocalBundle]) {
            return [self bundleUrl];
        } else {
            return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
        }
#else
        return [self bundleUrl];
#endif
    } else {
        id<UIApplicationDelegate> appDelegate = [[UIApplication sharedApplication] delegate];
        if ([appDelegate conformsToProtocol:@protocol(RCTBridgeDelegate)]
            && [appDelegate respondsToSelector:@selector(sourceURLForBridge:)]) {
            return [(id<RCTBridgeDelegate>)appDelegate sourceURLForBridge:nil];
        } else {
#if DEBUG
            return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
            return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
        }
    }
}

@end
