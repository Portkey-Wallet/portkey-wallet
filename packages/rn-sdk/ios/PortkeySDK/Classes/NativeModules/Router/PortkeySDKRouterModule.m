//
//  PortkeySDKRouterModule.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKRouterModule.h"
#import <PortkeySDK/PortkeySDKRNViewController.h>
#import <PortkeySDK/PortkeySDKNativeWrapperModule.h>

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

RCT_EXPORT_METHOD(navigateToWithOptions:(NSString *)entry
                             launchMode:(NSString *)launchMode
                                   from:(NSString *)from
                                 params:(NSDictionary *)params
                               callback:(RCTResponseSenderBlock)callback)
{
    if (entry.length <= 0) return;
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topViewController = [self topViewController];
        UINavigationController *navigationController = topViewController.navigationController;
        
        if ([self isNavigateToSingleTask:navigationController entry:entry]) {
            [self navigateToSingleTask:navigationController entry:entry params:params];
            return;
        }
        
        NSDictionary *props = [params valueForKey:@"params"];
        PortkeySDKRNViewController *vc = [[PortkeySDKRNViewController alloc] initWithModuleName:entry initialProperties:props];
        if (callback) {
            vc.navigateCallback = callback;
        }
        
        NSString *navigateType = [params valueForKey:@"navigateType"];
        BOOL isPresent = [navigateType isKindOfClass:NSString.class] && [navigateType isEqualToString:@"present"];
        if (isPresent) {
            UINavigationController *nc = [[UINavigationController alloc] initWithRootViewController:vc];
            [topViewController presentViewController:nc animated:YES completion:^{}];
        } else {
            [navigationController pushViewController:vc animated:YES];
        }
        
        if (launchMode.length) vc.launchMode = launchMode;
        
        // close current top view controller after push to new view controller
        if ([[params valueForKey:@"closeCurrentScreen"] isKindOfClass:NSNumber.class]) {
            BOOL closeCurrentScreen = [[params valueForKey:@"closeCurrentScreen"] boolValue];
            if (closeCurrentScreen) {
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    NSMutableArray<UIViewController *> *viewControllers = [navigationController.viewControllers mutableCopy];
                    [viewControllers removeObject:topViewController];
                    navigationController.viewControllers = viewControllers;
                });
            }
        }
    });
}

RCT_EXPORT_METHOD(navigateBack:(id)result)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topViewController = [self topViewController];
        if (result && [topViewController isKindOfClass:PortkeySDKRNViewController.class]) {
            RCTResponseSenderBlock callback = ((PortkeySDKRNViewController *)topViewController).navigateCallback;
            if (callback) {
                callback(@[result]);
                ((PortkeySDKRNViewController *)topViewController).navigateCallback = nil;
            }
        }
        if ([self isModal:topViewController]) {
            [topViewController dismissViewControllerAnimated:YES completion:nil];
        } else {
            [topViewController.navigationController popViewControllerAnimated:YES];
        }
    });
}

- (BOOL)isModal:(UIViewController *)vc {
     if([vc presentingViewController])
         return YES;
     if([[[vc navigationController] presentingViewController] presentedViewController] == [vc navigationController])
         return YES;
     if([[[vc tabBarController] presentingViewController] isKindOfClass:[UITabBarController class]])
         return YES;
    return NO;
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

- (BOOL)isNavigateToSingleTask:(UINavigationController *)navigationController entry:(NSString *)entry {
    __block BOOL result = NO;
    [navigationController.viewControllers enumerateObjectsUsingBlock:^(__kindof UIViewController * _Nonnull vc, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([vc isKindOfClass:PortkeySDKRNViewController.class]) {
            PortkeySDKRNViewController *portkeyVC = (PortkeySDKRNViewController *)vc;
            if ([portkeyVC.moduleName isEqualToString:entry] && [portkeyVC isSingleTask]) {
                result = YES;
                *stop = YES;
            }
        }
    }];
    return result;
}

- (void)navigateToSingleTask:(UINavigationController *)navigationController entry:(NSString *)entry params:(NSDictionary *)params {
    NSArray<UIViewController *> *viewControllers = navigationController.viewControllers;
    __block NSInteger singleTaskIndex = -1;
    [viewControllers enumerateObjectsUsingBlock:^(UIViewController * _Nonnull vc, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([vc isKindOfClass:PortkeySDKRNViewController.class]) {
            PortkeySDKRNViewController *portkeyVC = (PortkeySDKRNViewController *)vc;
            if ([portkeyVC.moduleName isEqualToString:entry] && [portkeyVC isSingleTask]) {
                singleTaskIndex = idx;
                *stop = YES;
            }
        }
    }];
    if (singleTaskIndex >= 0 && singleTaskIndex < viewControllers.count) {
        NSArray<UIViewController *> *subViewControllers = [viewControllers subarrayWithRange:NSMakeRange(0, singleTaskIndex)];
        navigationController.viewControllers = subViewControllers;
        [PortkeySDKNativeWrapperModule sendOnNewIntentWithParams:params bridge:self.bridge];
    }
}

@end
