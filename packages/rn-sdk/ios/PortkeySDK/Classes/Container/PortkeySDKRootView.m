//
//  PortkeySDKRootView.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import "PortkeySDKRootView.h"
#import <React/React-Core-umbrella.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>
#import <PortkeySDK/RCTBridge+ARNSDK.h>

@interface PortkeySDKRootView () {
    RCTBridge *_bridge;
}

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
        _bridge = [[RCTBridge alloc] initWithBundleURL:[PortkeySDKBundleUtil sourceURL] moduleProvider:nil launchOptions:nil];
        self.rootView = [[RCTRootView alloc] initWithBridge:_bridge moduleName:moduleName.length > 0 ? moduleName : @"Root" initialProperties:nil];
        [self addSubview:self.rootView];
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.rootView.frame = self.bounds;
}

- (void)loadSource {
    NSString *bundlePath = [[NSBundle bundleForClass:[self class]].resourcePath
                                stringByAppendingPathComponent:@"/JSBundle.bundle"];
    NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
    
    NSURL *sourceUrl = [resourceBundle URLForResource:@"index.ios" withExtension:@"bundle"];
    
//    NSData *data = [NSData dataWithContentsOfURL:sourceUrl];
    [_bridge.batchedBridge executeSourceCode:nil withSourceURL:sourceUrl sync:NO];
}

@end
