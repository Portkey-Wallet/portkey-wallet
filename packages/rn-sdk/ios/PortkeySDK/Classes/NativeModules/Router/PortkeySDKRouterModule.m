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

RCT_EXPORT_METHOD(navigateTo:(NSString *)entry targetScene:(NSString *)targetScene)
{
    NSLog(@"navigateTo");
    if (entry.length <= 0) return;
    PortkeySDKRNViewController *vc = [[PortkeySDKRNViewController alloc] initWithModuleName:entry];
    [[self topViewController].navigationController pushViewController:vc animated:YES];
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
