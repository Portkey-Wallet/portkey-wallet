//
//  PortkeySDKSigninOptions.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/9/26.
//

#import "PortkeySDKSigninOptions.h"

static PortkeySDKSigninOptions *_defaultOption;

@implementation PortkeySDKSigninOptions

+ (instancetype)defaultOption {
    if (!_defaultOption) {
        _defaultOption = [PortkeySDKSigninOptions new];
        _defaultOption.disableGoogleLogin = YES;
        _defaultOption.disableAppleLogin = YES;
    }
    return _defaultOption;
}

@end
