//
//  ARNSDKRootView.m
//  AelfPortkey
//
//  Created by 崔风川 on 2023/9/15.
//

#import "ARNSDKRootView.h"
#import <React/React-Core-umbrella.h>
#import "RCTBridge+ARNSDK.h"

@interface ARNSDKRootView () {
    RCTBridge *_bridge;
}

@property (nonatomic, strong) RCTRootView *rootView;

@end

@implementation ARNSDKRootView

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        _bridge = [[RCTBridge alloc] initWithBundleURL:[[self class] bundleUrl] moduleProvider:nil launchOptions:nil];
        self.rootView = [[RCTRootView alloc] initWithBridge:_bridge moduleName:@"Root" initialProperties:nil];
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
    
    NSData *data = [NSData dataWithContentsOfURL:sourceUrl];
    [_bridge.batchedBridge executeSourceCode:nil withSourceURL:sourceUrl sync:NO];
}

+ (void)testMethod {
    // 读取bundle中的源码
    NSString *bundlePath = [[NSBundle bundleForClass:[self class]].resourcePath
                                stringByAppendingPathComponent:@"/JSBundle.bundle"];
    NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
    
    NSURL *sourceUrl = [resourceBundle URLForResource:@"index.ios" withExtension:@"bundle"];
    
    NSData *data = [NSData dataWithContentsOfURL:sourceUrl];
    NSString *str2 = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSLog(@"");
}

+ (NSURL *)bundleUrl {
    NSString *bundlePath = [[NSBundle bundleForClass:[self class]].resourcePath
                                stringByAppendingPathComponent:@"/JSBundle.bundle"];
    NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
    NSURL *sourceUrl = [resourceBundle URLForResource:@"index.ios" withExtension:@"bundle"];
    return sourceUrl;
}

@end
