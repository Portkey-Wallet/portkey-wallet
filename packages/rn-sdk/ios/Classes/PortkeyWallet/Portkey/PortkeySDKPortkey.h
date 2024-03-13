//
//  PortkeySDKPortkey.h
//  DoubleConversion
//
//  Created by wade-cui on 2023/9/26.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKAccountProtocol.h>
#import <PortkeySDK/PortkeySDKServiceProtocol.h>
#import <PortkeySDK/PortkeySDKConfigProtocol.h>
#import <PortkeySDK/PortkeySDKWalletProtocol.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^PortkeySDKSignCompletionBlock)(BOOL finished);

@interface PortkeySDKPortkey : NSObject <PortkeySDKAccountProtocol>

@property (nonatomic, strong, readonly) id<PortkeySDKServiceProtocol> service;
@property (nonatomic, strong, readonly) id<PortkeySDKConfigProtocol> config;
@property (nonatomic, strong, readonly) id<PortkeySDKWalletProtocol> wallet;

+ (instancetype)portkey;

+ (void)initPortkey;

@end

NS_ASSUME_NONNULL_END
