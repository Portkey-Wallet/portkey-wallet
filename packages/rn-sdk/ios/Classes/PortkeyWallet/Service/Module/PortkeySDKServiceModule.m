//
//  PortkeySDKServiceModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import "PortkeySDKServiceModule.h"
#import <PortkeySDK/PortkeySDKGuardianModule.h>
#import <PortkeySDK/PortkeySDKContractModule.h>
#import <PortkeySDK/PortkeySDKAssetsModule.h>

@interface PortkeySDKServiceModule ()

@property (nonatomic, strong, readwrite) id<PortkeySDKGuardianProtocol> guardian;
@property (nonatomic, strong, readwrite) id<PortkeySDKContractProtocol> contract;
@property (nonatomic, strong, readwrite) id<PortkeySDKAssetsProtocol> assets;

@end

@implementation PortkeySDKServiceModule

- (id<PortkeySDKGuardianProtocol>)guardian {
    if (!_guardian) {
        _guardian = [PortkeySDKGuardianModule new];
    }
    return _guardian;
}

- (id<PortkeySDKContractProtocol>)contract {
    if (!_contract) {
        _contract = [PortkeySDKContractModule new];
    }
    return _contract;
}

- (id<PortkeySDKAssetsProtocol>)assets {
    if (!_assets) {
        _assets = [PortkeySDKAssetsModule new];
    }
    return _assets;
}

@end
