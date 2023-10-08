//
//  PortkeySDKRNViewController.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import "PortkeySDKRNViewController.h"
#import "PortkeySDKRootView.h"

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

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    self.rnRootView.frame = self.view.bounds;
}

@end
