//
//  PortkeySDKWalletModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/30.
//

#import "PortkeySDKWalletModule.h"
#import <PortkeySDK/PortkeySDKJSCallModule.h>
#import <PortkeySDK/NSString+PortkeySDK.h>

@implementation PortkeySDKWalletModule

- (void)exitWallet:(void(^)(BOOL , NSString * _Nullable))callback {
    [[self jsCall] enqueueJSCall:@"WalletModule"
                          method:@"exitWallet"
                          params:@{}
                        callback:^(NSString * _Nullable result) {
        if (callback) {
            NSDictionary *res = [result portkey_jsonObject];
            if (res) {
                BOOL success = [[res objectForKey:kPortkeySDKJSCallStatusKey] isEqualToString:(NSString *)kPortkeySDKJSCallStatusSuccess];
                id errorObj = [res objectForKey:kPortkeySDKJSCallErrorKey];
                NSString *errorMsg = [errorObj isKindOfClass:NSString.class] ? errorObj : @"";
                callback(success, errorMsg);
            }
        }
    }];
}

- (PortkeySDKJSCallModule *)jsCall {
    return [PortkeySDKJSCallModule sharedInstance];
}

@end
