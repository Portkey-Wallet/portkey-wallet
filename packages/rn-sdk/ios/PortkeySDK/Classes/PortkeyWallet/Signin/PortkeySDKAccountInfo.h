//
//  PortkeySDKAccountInfo.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/9/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKAccountInfo : NSObject

@property (nonatomic, copy) NSString *sessionId;
@property (nonatomic, assign) NSInteger createType;
@property (nonatomic, copy) NSString *accountChainId;

@end

NS_ASSUME_NONNULL_END
