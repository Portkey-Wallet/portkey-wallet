//
//  PortkeySDKJSCallModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/31.
//

#import "PortkeySDKJSCallModule.h"
#import <React/RCTBridge.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>

#if __has_include(<React-RCTAppDelegate/RCTAppDelegate.h>)
#import <React-RCTAppDelegate/RCTAppDelegate.h>
#elif __has_include(<React_RCTAppDelegate/RCTAppDelegate.h>)
// for importing the header from framework, the dash will be transformed to underscore
#import <React_RCTAppDelegate/RCTAppDelegate.h>
#endif

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
    });
    return instance;
}

- (void)enqueueJSCall:(NSString *)moduleName
               method:(NSString *)method
               params:(NSDictionary *)params
             callback:(PortkeySDKJSMethodCallback)callback {
    NSString *eventId = [[NSUUID UUID] UUIDString] ?: @"";
    [self setMethodEventCallback:callback eventId:eventId];
    NSMutableDictionary *args = [[NSMutableDictionary alloc] initWithDictionary:@{
        @"eventId" : eventId,
    }];
    [args addEntriesFromDictionary:params];
    [self.bridge enqueueJSCall:moduleName method:method args:@[args] completion:^{}];
}

- (void)callCallbackWithEventId:(NSString *)eventId result:(NSString *)result {
    PortkeySDKJSMethodCallback callback = [self getMethodEventCallback:eventId];
    if (callback) {
        dispatch_async(dispatch_get_main_queue(), ^{
            callback(result);
            [self removeMethodEventCallback:eventId];
        });
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

- (RCTBridge *)bridge {
    if (!_bridge) {
        _bridge = [self createBridge];
    }
    return _bridge;
}

- (RCTBridge *)createBridge {
    __block RCTBridge *bridge;
    if ([[NSThread currentThread] isMainThread]) {
        id<UIApplicationDelegate> appDelagete = [UIApplication sharedApplication].delegate;
        if ([appDelagete isKindOfClass:RCTAppDelegate.class]
            && ((RCTAppDelegate *)appDelagete).bridge != NULL) {
            bridge = ((RCTAppDelegate *)appDelagete).bridge;
        } else {
            bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
        }
    } else {
        dispatch_semaphore_t semaphore = dispatch_semaphore_create(1);
        dispatch_async(dispatch_get_main_queue(), ^{
            id<UIApplicationDelegate> appDelagete = [UIApplication sharedApplication].delegate;
            if ([appDelagete isKindOfClass:RCTAppDelegate.class]
                && ((RCTAppDelegate *)appDelagete).bridge != NULL) {
                bridge = ((RCTAppDelegate *)appDelagete).bridge;
            } else {
                bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
            }
            dispatch_semaphore_signal(semaphore);
        });
        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    }
    return bridge;
}

@end
