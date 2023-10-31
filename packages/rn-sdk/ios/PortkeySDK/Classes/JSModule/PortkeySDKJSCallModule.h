//
//  PortkeySDKJSCallModule.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/31.
//

#import <Foundation/Foundation.h>

typedef void(^PortkeySDKJSMethodCallback)(NSString *_Nullable);

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKJSCallModule : NSObject

+ (instancetype)sharedInstance;

- (void)enqueueJSCall:(NSString *)moduleName
               method:(NSString *)method
               params:(NSDictionary *)params
             callback:(PortkeySDKJSMethodCallback)callback;

- (void)callCallbackWithEventId:(NSString *)eventId result:(NSString *)result;

@end

NS_ASSUME_NONNULL_END
