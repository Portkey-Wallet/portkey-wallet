//
//  PortkeySDKContractModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/31.
//

#import "PortkeySDKContractModule.h"
#import <PortkeySDK/PortkeySDKJSCallModule.h>
#import <PortkeySDK/NSString+PortkeySDK.h>

@interface PortkeySDKContractModule ()

@end

@implementation PortkeySDKContractModule

- (void)callCaContractMethodWithParam:(PortkeySDKContractCallParam *)param
                             callback:(void(^)(NSError * _Nullable, NSDictionary * _Nullable))callback {
    if (!param || param.contractMethodName.length <= 0) {
        return;
    }
    NSDictionary *params = @{
        @"contractMethodName": param.contractMethodName,
        @"isViewMethod": @(param.isViewMethod),
        @"params": param.params ?: [NSNull null]
    };
    [[self jsCall] enqueueJSCall:@"WalletModule"
                          method:@"callCaContractMethod"
                          params:params
                        callback:^(NSString * _Nullable result) {
        if (callback) {
            NSDictionary *res = [result portkey_jsonObject];
            callback(nil, res);
        }
    }];
}

- (PortkeySDKJSCallModule *)jsCall {
    return [PortkeySDKJSCallModule sharedInstance];
}

@end
