//
//  PortkeySDKEventEmitter.m
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/25.
//

#import "PortkeySDKEventEmitter.h"

const NSString *kPortkeySDKEventEmitterKey = @"PortkeySDKEventEmitter";

@implementation PortkeySDKEventEmitter

RCT_EXPORT_MODULE();

- (void)dealloc {
    [self stopObserving];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"PortkeyEvent"];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendPortkeySDKEvent:) name:(NSString *)kPortkeySDKEventEmitterKey object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)sendPortkeySDKEvent:(NSNotification *)notification {
    [self sendEventWithName:@"PortkeyEvent" body:notification.object];
}

@end
