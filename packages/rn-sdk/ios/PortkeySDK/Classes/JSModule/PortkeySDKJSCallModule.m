//
//  PortkeySDKJSCallModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/31.
//

#import "PortkeySDKJSCallModule.h"
#import <React/RCTBridge.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>

@interface PortkeySDKJSCallModule () <RCTBridgeDelegate>

@property (nonatomic, strong, readwrite) RCTBridge *bridge;
@property (nonatomic, strong) NSMutableDictionary<NSString *, PortkeySDKJSMethodCallback> *methodEventDict;

@end

@implementation PortkeySDKJSCallModule

+ (instancetype)sharedInstance {
    static PortkeySDKJSCallModule *instance = nil;
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        instance = [PortkeySDKJSCallModule new];
        instance.bridge = [[RCTBridge alloc] initWithDelegate:instance launchOptions:nil];
    });
    return instance;
}

- (void)enqueueJSCall:(NSString *)moduleName
               method:(NSString *)method
               params:(NSDictionary *)params
             callback:(PortkeySDKJSMethodCallback)callback {
    NSString *eventId = [[NSUUID UUID] UUIDString] ?: @"";
    [self setMethodEventCallback:callback eventId:eventId];
    NSDictionary *args = @{
        @"eventId" : eventId,
        @"params": params ?: [NSNull null],
    };
    [self.bridge enqueueJSCall:moduleName method:method args:@[args] completion:^{}];
}

- (void)callCallbackWithEventId:(NSString *)eventId result:(NSString *)result {
    PortkeySDKJSMethodCallback callback = [self getMethodEventCallback:eventId];
    if (callback) {
        callback(result);
        [self removeMethodEventCallback:eventId];
    }
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
    return [PortkeySDKBundleUtil sourceURL];
}

#pragma mark - Getter

- (void)removeMethodEventCallback:(NSString *)eventId {
    @synchronized (self) {
        if (eventId) {
            [self.methodEventDict removeObjectForKey:eventId];
        }
    }
}

- (void)setMethodEventCallback:(PortkeySDKJSMethodCallback)callback eventId:(NSString *)eventId {
    @synchronized (self) {
        if (callback && eventId) {
            [self.methodEventDict setValue:callback forKey:eventId];
        }
    }
}

- (PortkeySDKJSMethodCallback)getMethodEventCallback:(NSString *)key {
    @synchronized (self) {
        if (key) {
            return [self.methodEventDict objectForKey:key];
        }
        return nil;
    }
}

- (NSMutableDictionary *)methodEventDict {
    if (!_methodEventDict) {
        _methodEventDict = [NSMutableDictionary new];
    }
    return _methodEventDict;
}


@end
