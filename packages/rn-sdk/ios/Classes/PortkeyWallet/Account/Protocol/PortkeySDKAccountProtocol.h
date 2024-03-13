//
//  PortkeySDKAccountProtocol.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKAccountInfo.h>

NS_ASSUME_NONNULL_BEGIN

@protocol PortkeySDKAccountProtocol <NSObject>

- (void)login:(void(^)(NSError * _Nullable, PortkeySDKAccountInfo * _Nullable))callback;
- (void)logout:(void(^)(NSError * _Nullable))callback;

@end

NS_ASSUME_NONNULL_END
