//
//  PortkeySDKContractCallParam.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKContractCallParam : NSObject

@property (nonatomic, copy) NSString *contractMethodName;
@property (nonatomic, assign) BOOL isViewMethod;
@property (nonatomic, copy) NSDictionary *params;

@end

NS_ASSUME_NONNULL_END
