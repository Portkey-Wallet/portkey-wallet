//
//  ViewController.m
//  PortkeySDK
//
//  Created by wade-portkey on 09/13/2023.
//  Copyright (c) 2023 wade-portkey. All rights reserved.
//

#import "ViewController.h"
#import <PortkeySDK/PortkeySDKRootView.h>

@interface ViewController ()

@property (nonatomic, strong) PortkeySDKRootView *rnRootView;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.title = @"Hello Portkey";
    
    CGSize size = UIScreen.mainScreen.bounds.size;
    self.rnRootView = [[PortkeySDKRootView alloc] initWithModuleName:@"entry"];
    self.rnRootView.frame = CGRectMake(0, 0, size.width, size.height);
    [self.view addSubview:self.rnRootView];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
