//
//  PortkeySDKRNViewController.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKRNViewController.h"
#import "PortkeySDKRootView.h"
#import <PortkeySDK/PortkeySDKNativeWrapperModule.h>

@interface PortkeySDKRNViewController ()

@property (nonatomic, strong) PortkeySDKRootView *rnRootView;

@end

@implementation PortkeySDKRNViewController

- (instancetype)initWithModuleName:(NSString *)moduleName {
    return [self initWithModuleName:moduleName initialProperties:nil];
}

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(nullable NSDictionary  *)initialProperties {
    self = [super init];
    if (self) {
        self.rnRootView = [[PortkeySDKRootView alloc] initWithModuleName:moduleName initialProperties:initialProperties];
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.view addSubview:self.rnRootView];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [PortkeySDKNativeWrapperModule sendOnShowEventWithModuleName:self.rnRootView.moduleName
                                                          bridge:self.rnRootView.bridge
                                                     containerId:self.containerId];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    self.rnRootView.frame = self.view.bounds;
}

- (BOOL)isSingleTask {
    return self.launchMode.length && [self.launchMode isEqualToString:@"single_task"];
}

- (NSString *)moduleName {
    return self.rnRootView.moduleName;
}

@end
