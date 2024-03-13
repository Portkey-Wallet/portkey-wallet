//
//  PortkeySDKWalletProtocol.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/30.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol PortkeySDKWalletProtocol <NSObject>

- (void)exitWallet:(void(^)(BOOL , NSString * _Nullable))callback;

@end

NS_ASSUME_NONNULL_END
