//
//  PortkeySDKAelfModule.m
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import "PortkeySDKAelfModule.h"
#import <React/RCTBridge.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>

extern NSString *kPortkeySDKEventEmitterKey;

typedef void(^PortkeySDKMethodEventCallback)(NSString *);

@interface PortkeySDKAelfModule () <RCTBridgeDelegate>

@property (nonatomic, strong) RCTBridge *bridge;
@property (nonatomic, strong) NSMutableDictionary *methodEventDict;

@end

@implementation PortkeySDKAelfModule

+ (instancetype)sharedInstance {
    static PortkeySDKAelfModule *instance = nil;
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        instance = [PortkeySDKAelfModule new];
        instance.bridge = [[RCTBridge alloc] initWithDelegate:instance launchOptions:nil];
        [instance addJavaScriptLoadNotification];
    });
    return instance;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Public

- (void)callJsMethodWithName:(NSString *)methodName callback:(PortkeySDKMethodEventCallback)callback {
    NSString *eventId = nil;
    if (callback) {
        eventId = [self generateEventId];
        [self setMethodEventCallback:callback eventId:eventId];
    }
    [self postMethodEventNotification:methodName eventId:eventId];
}

- (void)callNativeCallbackWithEventId:(NSString *)eventId result:(NSString *)result{
    PortkeySDKMethodEventCallback callback = [self getMethodEventCallck:eventId];
    if (callback) {
        callback(result);
    }
}

#pragma mark - Private

- (void)postMethodEventNotification:(NSString *)methodName eventId:(NSString *)eventId {
    NSDictionary *userInfo = @{
        @"eventId" : eventId ?: @"",
    };
    [[NSNotificationCenter defaultCenter] postNotificationName:methodName object:nil userInfo:nil];
}

- (void)addJavaScriptLoadNotification {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(javaScriptDidLoad:)
                                                 name:RCTJavaScriptDidLoadNotification
                                               object:_bridge];
}

- (NSString *)generateEventId {
    return [NSUUID UUID].UUIDString;
}

#pragma mark - Notification

- (void)javaScriptDidLoad:(NSNotification *)notification
{
    RCTBridge *bridge = notification.userInfo[@"bridge"];
    if (bridge != _bridge) {
        // bundle finish load
    }
}

#pragma mark - RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
    return [PortkeySDKBundleUtil sourceURL];
}

#pragma mark - Getter

- (void)setMethodEventCallback:(id)callback eventId:(NSString *)eventId {
    @synchronized (self) {
        if (callback && eventId) {
            [self.methodEventDict setValue:callback forKey:eventId];
        }
    }
}

- (id)getMethodEventCallck:(NSString *)key {
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
