//
//  PortkeySDKConfigProtocol.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKNetworkConfigItem.h>

NS_ASSUME_NONNULL_BEGIN

@protocol PortkeySDKConfigProtocol <NSObject>

- (void)configTermsOfServiceWithPrefix:(NSString *)prefix title:(NSString *)title;
- (NSString *)termsOfServicePrefix;
- (NSString *)termsOfServiceTitle;

- (void)setUseInNativeApp:(BOOL)isUseInNativeApp;
- (BOOL)isUseInNativeApp;
- (void)setNetwork:(PortkeySDKNetworkConfigItem *)network;

@end

NS_ASSUME_NONNULL_END
