//
//  PortkeySDKRouterModule.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKRouterModule.h"
#import <PortkeySDK/PortkeySDKRNViewController.h>

@implementation PortkeySDKRouterModule

RCT_EXPORT_MODULE(RouterModule);

RCT_EXPORT_METHOD(navigationTo:(NSString *)entry targetScene:(NSString *)targetScene)
{
    if (entry.length <= 0) return;
    dispatch_async(dispatch_get_main_queue(), ^{
        PortkeySDKRNViewController *vc = [[PortkeySDKRNViewController alloc] initWithModuleName:entry];
        [[self topViewController].navigationController pushViewController:vc animated:YES];
    });
}

RCT_EXPORT_METHOD(navigateToWithOptions:(NSString *)entry from:(NSString *)from params:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback)
{
    if (entry.length <= 0) return;
    dispatch_async(dispatch_get_main_queue(), ^{
        PortkeySDKRNViewController *vc = [[PortkeySDKRNViewController alloc] initWithModuleName:entry];
        [[self topViewController].navigationController pushViewController:vc animated:YES];
        
        NSDictionary *result = @{
            @"status": @"success",
            @"result": @{
                @"name": @"portkey",
            }
        };
        callback(@[result]);
    });
}

- (UIViewController *)topViewController {
    UIViewController *resultVC;
    resultVC = [self _topViewController:[[UIApplication sharedApplication].keyWindow rootViewController]];
    while (resultVC.presentedViewController) {
        resultVC = [self _topViewController:resultVC.presentedViewController];
    }
    return resultVC;
}

- (UIViewController *)_topViewController:(UIViewController *)vc {
    if ([vc isKindOfClass:[UINavigationController class]]) {
        return [self _topViewController:[(UINavigationController *)vc topViewController]];
    } else if ([vc isKindOfClass:[UITabBarController class]]) {
        return [self _topViewController:[(UITabBarController *)vc selectedViewController]];
    } else {
        return vc;
    }
    return nil;
}

@end
