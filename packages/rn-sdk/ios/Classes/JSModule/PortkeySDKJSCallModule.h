//
//  PortkeySDKJSCallModule.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/31.
//

#import <Foundation/Foundation.h>

typedef void(^PortkeySDKJSMethodCallback)(NSString *_Nullable);

static const NSString * _Nonnull kPortkeySDKJSCallStatusKey = @"status";
static const NSString * _Nonnull kPortkeySDKJSCallStatusSuccess = @"success";
static const NSString * _Nonnull kPortkeySDKJSCallStatusFail = @"fail";
static const NSString * _Nonnull kPortkeySDKJSCallDataKey = @"data";
static const NSString * _Nonnull kPortkeySDKJSCallErrorKey = @"error";

NS_ASSUME_NONNULL_BEGIN

@class RCTBridge;

@interface PortkeySDKJSCallModule : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;

+ (instancetype)sharedInstance;

- (void)enqueueJSCall:(NSString *)moduleName
               method:(NSString *)method
               params:(NSDictionary *)params
             callback:(PortkeySDKJSMethodCallback)callback;

- (void)callCallbackWithEventId:(NSString *)eventId result:(NSString *)result;

@end

NS_ASSUME_NONNULL_END
