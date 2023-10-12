//
//  PortkeySDKRouterModule.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKRouterModule.h"
#import <PortkeySDK/PortkeySDKRNViewController.h>

@implementation PortkeySDKRouterModule

+ (instancetype)sharedInstance {
    static PortkeySDKRouterModule *instance = nil;
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        instance = [PortkeySDKRouterModule new];
    });
    return instance;
}

RCT_EXPORT_MODULE(RouterModule);

RCT_EXPORT_METHOD(navigateTo:(NSString *)entry
                  from:(NSString *)from
                  targetScene:(NSString *)targetScene)
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
        UIViewController *topViewController = [self topViewController];
        if (callback && [topViewController isKindOfClass:PortkeySDKRNViewController.class]) {
            ((PortkeySDKRNViewController *)topViewController).navigateCallback = callback;
        }
        NSDictionary *props = [params valueForKey:@"params"];
        PortkeySDKRNViewController *vc = [[PortkeySDKRNViewController alloc] initWithModuleName:entry initialProperties:props];
        [topViewController.navigationController pushViewController:vc animated:YES];
    });
}

RCT_EXPORT_METHOD(navigateBack:(NSString *)from result:(id)result)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topViewController = [self topViewController];
        if (result && [topViewController.navigationController isKindOfClass:UINavigationController.class]) {
            NSArray<__kindof UIViewController *> *viewControllers = topViewController.navigationController.viewControllers;
            if (viewControllers.count >= 2) {
                UIViewController *backViewController = viewControllers[viewControllers.count - 2];
                if ([backViewController isKindOfClass:PortkeySDKRNViewController.class]) {
                    RCTResponseSenderBlock callback = ((PortkeySDKRNViewController *)backViewController).navigateCallback;
                    if (callback) {
                        callback(@[result]);
                        ((PortkeySDKRNViewController *)backViewController).navigateCallback = nil;
                    }
                }
            }
        }
        [topViewController.navigationController popViewControllerAnimated:YES];
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
