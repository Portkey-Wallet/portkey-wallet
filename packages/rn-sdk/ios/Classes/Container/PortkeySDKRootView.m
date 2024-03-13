//
//  PortkeySDKRootView.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import "PortkeySDKRootView.h"
#import <React/React-Core-umbrella.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>
#import <PortkeySDK/RCTRootView+PortkeySDK.h>
#import <PortkeySDK/PortkeySDKJSCallModule.h>

@interface PortkeySDKRootView ()

@property (nonatomic, strong) RCTRootView *rootView;

@end

@implementation PortkeySDKRootView

- (instancetype)initWithFrame:(CGRect)frame {
    return [self initWithFrame:frame moduleName:nil];
}

- (instancetype)initWithModuleName:(NSString *)moduleName {
    return [self initWithFrame:CGRectZero moduleName:moduleName];
}

- (instancetype)initWithFrame:(CGRect)frame moduleName:(NSString *)moduleName {
    self = [super initWithFrame:frame];
    if (self) {
        self.rootView = [[RCTRootView alloc] initWithBridge:[PortkeySDKJSCallModule sharedInstance].bridge moduleName:moduleName.length > 0 ? moduleName : @"Root" initialProperties:nil];
        [self addSubview:self.rootView];
    }
    return self;
}

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(NSDictionary *)initialProperties {
    self = [super initWithFrame:CGRectZero];
    if (self) {
        self.rootView = [[RCTRootView alloc] initWithBridge:[PortkeySDKJSCallModule sharedInstance].bridge moduleName:moduleName.length > 0 ? moduleName : @"Root" initialProperties:initialProperties];
        [self addSubview:self.rootView];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.rootView.frame = self.bounds;
}

- (NSString *)moduleName {
    return self.rootView.moduleName;
}

- (RCTBridge *)bridge {
    return self.rootView.bridge;
}

- (NSNumber *)reactTag {
    return [self.rootView reactTag];
}

@end
