//
//  PortkeySDKContractProtocol.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/10.
//

#import <Foundation/Foundation.h>
#import <PortkeySDK/PortkeySDKContractCallParam.h>

NS_ASSUME_NONNULL_BEGIN

@protocol PortkeySDKContractProtocol <NSObject>

- (void)callCaContractMethodWithParam:(PortkeySDKContractCallParam *)param
                             callback:(void(^)(NSError * _Nullable, NSDictionary * _Nullable))callback;

@end

NS_ASSUME_NONNULL_END
