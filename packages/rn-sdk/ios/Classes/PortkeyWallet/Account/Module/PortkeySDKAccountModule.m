//
//  PortkeySDKAccountModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import "PortkeySDKAccountModule.h"
#import <PortkeySDK/PortkeySDKJSCallModule.h>
#import <PortkeySDK/PortkeySDKRouterModule.h>

@implementation PortkeySDKAccountModule

- (void)login:(void (^)(NSError * _Nullable, PortkeySDKAccountInfo * _Nullable))callback {
    [[PortkeySDKRouterModule sharedInstance] navigateToWithOptions:@"sign_in_entry"
                                                        launchMode:@""
                                                              from:@""
                                                            params:@{}
                                                          callback:^(NSArray *response) {
        NSLog(@"response: %@", response);
    }];
}

- (void)logout:(void(^)(NSError * _Nullable))callback {
    
}

- (PortkeySDKJSCallModule *)jsCall {
    return [PortkeySDKJSCallModule sharedInstance];
}

@end
