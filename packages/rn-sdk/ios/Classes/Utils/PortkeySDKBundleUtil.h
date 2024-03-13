//
//  PortkeySDKBundleUtil.h
//  DoubleConversion
//
//  Created by wade-portkey on 2023/9/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKBundleUtil : NSObject

+ (NSURL *)sourceURL;

+ (void)setUseLocalBundle:(BOOL)useLocal;

+ (BOOL)useLocalBundle;

@end

NS_ASSUME_NONNULL_END
