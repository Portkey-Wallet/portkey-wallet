//
//  PortkeySDKSigninOptions.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/9/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKSigninOptions : NSObject

@property (nonatomic, assign) BOOL disableGoogleLogin;
@property (nonatomic, assign) BOOL disableAppleLogin;

+ (instancetype)defaultOption;

@end

NS_ASSUME_NONNULL_END
