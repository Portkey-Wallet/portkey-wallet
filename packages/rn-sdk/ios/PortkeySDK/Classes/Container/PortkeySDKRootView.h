//
//  PortkeySDKRootView.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKRootView : UIView

- (instancetype)initWithFrame:(CGRect)frame;

- (instancetype)initWithModuleName:(NSString *)moduleName;

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(NSDictionary *)initialProperties;

@end

NS_ASSUME_NONNULL_END
