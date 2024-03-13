//
//  PortkeySDKServiceProtocol.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKGuardianProtocol.h>
#import <PortkeySDK/PortkeySDKContractProtocol.h>
#import <PortkeySDK/PortkeySDKAssetsProtocol.h>

NS_ASSUME_NONNULL_BEGIN

@protocol PortkeySDKServiceProtocol <NSObject>

@property (nonatomic, strong, readonly) id<PortkeySDKGuardianProtocol> guardian;
@property (nonatomic, strong, readonly) id<PortkeySDKContractProtocol> contract;
@property (nonatomic, strong, readonly) id<PortkeySDKAssetsProtocol> assets;

@end

NS_ASSUME_NONNULL_END
