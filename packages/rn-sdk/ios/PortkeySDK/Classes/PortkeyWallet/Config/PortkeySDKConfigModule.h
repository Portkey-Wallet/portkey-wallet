//
//  PortkeySDKConfigModule.h
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKConfigModule : NSObject

+ (void)configTermsOfServiceWithPrefix:(NSString *)prefix title:(NSString *)title;
+ (NSString *)termsOfServicePrefix;
+ (NSString *)termsOfServiceTitle;

@end

NS_ASSUME_NONNULL_END
