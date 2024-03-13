//
//  PortkeySDKPortkey.m
//  DoubleConversion
//
//  Created by wade-cui on 2023/9/26.
//

#import "PortkeySDKPortkey.h"
#import <PortkeySDK/PortkeySDKAccountModule.h>
#import <PortkeySDK/PortkeySDKConfigModule.h>
#import <PortkeySDK/PortkeySDKServiceModule.h>
#import <PortkeySDK/PortkeySDKWalletModule.h>

@interface PortkeySDKPortkey ()

@property (nonatomic, strong) id<PortkeySDKAccountProtocol> accountModule;
@property (nonatomic, strong, readwrite) id<PortkeySDKServiceProtocol> service;
@property (nonatomic, strong, readwrite) id<PortkeySDKConfigProtocol> config;
@property (nonatomic, strong, readwrite) id<PortkeySDKWalletProtocol> wallet;

@end

@implementation PortkeySDKPortkey

#pragma mark - Public

+ (instancetype)portkey {
    static PortkeySDKPortkey *portkey = nil;
    static dispatch_once_t token;
    dispatch_once(&token, ^{
        portkey = [PortkeySDKPortkey new];
    });
    return portkey;
}

+ (void)initPortkey {
    
}

- (void)login:(void (^)(NSError * _Nullable, PortkeySDKAccountInfo * _Nullable))callback {
    [self.accountModule login:^(NSError * _Nullable error, PortkeySDKAccountInfo * _Nullable accountInfo) {
        if (!error) {
            [self generateService];
        }
        if (callback) {
            callback(error, accountInfo);
        }
    }];
}

- (void)logout:(void (^)(NSError * _Nullable))callback {
    
}

#pragma mark - Private

- (void)generateService {
    self.service = [PortkeySDKServiceModule new];
}

#pragma mark - Getter

- (id<PortkeySDKAccountProtocol>)accountModule {
    if (!_accountModule) {
        _accountModule = [PortkeySDKAccountModule new];
    }
    return _accountModule;
}

- (id<PortkeySDKConfigProtocol>)config {
    if (!_config) {
        _config = [PortkeySDKConfigModule new];
    }
    return _config;
}

- (id<PortkeySDKWalletProtocol>)wallet {
    if (!_wallet) {
        _wallet = [PortkeySDKWalletModule new];
    }
    return _wallet;
}

@end
