//
//  JSSDKViewController.m
//  PortkeySDKExample_Example
//
//  Created by wade-portkey on 2023/9/25.
//  Copyright © 2023 wade-portkey. All rights reserved.
//

#import "JSSDKViewController.h"
#import <PortkeySDK/PortkeySDKAelfModule.h>

@interface JSSDKViewController ()

@end

@implementation JSSDKViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"JS SDK";
    self.view.backgroundColor = [UIColor whiteColor];
    
    [PortkeySDKAelfModule sharedInstance];
}

@end
