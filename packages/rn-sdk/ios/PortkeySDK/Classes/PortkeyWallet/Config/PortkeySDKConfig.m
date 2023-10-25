//
//  PortkeySDKConfig.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/25.
//

#import "PortkeySDKConfig.h"
#import <PortkeySDK/PortkeySDKMMKVStorage.h>

const static NSString *kTermsOfServicePrefix = @"PortkeySDKTermsOfServicePrefix";
const static NSString *kTermsOfServiceTitle = @"PortkeySDKTermsOfServiceTitle";

@implementation PortkeySDKConfig

+ (void)configTermsOfServiceWithPrefix:(NSString *)prefix title:(NSString *)title {
    [PortkeySDKMMKVStorage writeString:prefix forKey:(NSString *)kTermsOfServicePrefix];
    [PortkeySDKMMKVStorage writeString:title forKey:(NSString *)kTermsOfServiceTitle];
}

+ (NSString *)termsOfServicePrefix {
    return [PortkeySDKMMKVStorage readString:(NSString *)kTermsOfServicePrefix];
}

+ (NSString *)termsOfServiceTitle {
    return [PortkeySDKMMKVStorage readString:(NSString *)kTermsOfServiceTitle];
}

@end
