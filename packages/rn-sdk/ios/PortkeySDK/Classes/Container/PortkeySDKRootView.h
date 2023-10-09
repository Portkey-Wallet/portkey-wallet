//
//  PortkeySDKRootView.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RCTBridge;

@interface PortkeySDKRootView : UIView

@property (nonatomic, copy, readonly) NSString *moduleName;
@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) NSNumber *reactTag;

- (instancetype)initWithFrame:(CGRect)frame;

- (instancetype)initWithModuleName:(NSString *)moduleName;

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(NSDictionary *)initialProperties;

@end

NS_ASSUME_NONNULL_END
