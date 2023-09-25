//
//  PortkeySDKBundleUtil.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import "PortkeySDKBundleUtil.h"
#import <React/RCTBundleURLProvider.h>

@implementation PortkeySDKBundleUtil

+ (NSURL *)bundleUrl {
    NSString *bundlePath = [[NSBundle bundleForClass:[self class]].resourcePath
                                stringByAppendingPathComponent:@"/JSBundle.bundle"];
    NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
    NSURL *sourceUrl = [resourceBundle URLForResource:@"index.ios" withExtension:@"bundle"];
    return sourceUrl;
}

+ (NSURL *)sourceURL
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [self bundleUrl];
#endif
}

@end
