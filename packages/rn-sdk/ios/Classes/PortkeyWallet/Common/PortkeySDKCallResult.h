//
//  PortkeySDKCallResult.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/13.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

const NSString *kPortkeySDKCallResult = @"success";

@interface PortkeySDKCallResult : NSObject

@property (nonatomic, copy) NSString *status;   // 'success' | 'fail' | 'pending'
@property (nonatomic, strong) id data;          // Dictionary or Model
@property (nonatomic, assign) NSInteger errorCode;
@property (nonatomic, copy) NSString *errorMsg;

@end

NS_ASSUME_NONNULL_END
