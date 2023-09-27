//
//  PortkeySDKPortkeyManager.h
//  DoubleConversion
//
//  Created by wade-cui on 2023/9/26.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKSigninOptions.h>
#import <PortkeySDK/PortkeySDKWallet.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^PortkeySDKSignSuccessCallback)(PortkeySDKWallet *);
typedef void(^PortkeySDKSignFailCallback)(NSString *);
typedef void(^PortkeySDKSignCompletionBlock)(BOOL finished);

@interface PortkeySDKPortkeyManager : NSObject

- (void)useSigninWithOption:(PortkeySDKSigninOptions *)option
               successBlock:(PortkeySDKSignSuccessCallback)successBlock
                  failBlock:(PortkeySDKSignFailCallback)failBlock;

- (void)useSignOutWithCompletion:(PortkeySDKSignCompletionBlock)completion;

- (BOOL)isWalletExist;

@end

NS_ASSUME_NONNULL_END
