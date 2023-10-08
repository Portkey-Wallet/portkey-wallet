//
//  PortkeySDKRNViewController.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/21.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface PortkeySDKRNViewController : UIViewController

@property (nonatomic, copy, nullable) RCTResponseSenderBlock navigateCallback;

- (instancetype)initWithModuleName:(NSString *)moduleName;

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(nullable NSDictionary *)initialProperties;

@end

NS_ASSUME_NONNULL_END
