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

@property (nonatomic, copy, readonly) NSString *moduleName;
@property (nonatomic, copy, nullable) RCTResponseSenderBlock navigateCallback;
@property (nonatomic, copy) NSString *launchMode;
@property (nonatomic, copy) NSString *containerId;

- (instancetype)initWithModuleName:(NSString *)moduleName;

- (instancetype)initWithModuleName:(NSString *)moduleName initialProperties:(nullable NSDictionary *)initialProperties;

- (BOOL)isSingleTask;

@end

NS_ASSUME_NONNULL_END
