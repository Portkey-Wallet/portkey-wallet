//
//  APKViewController.m
//  AelfPortkey
//
//  Created by wade-portkey on 09/13/2023.
//  Copyright (c) 2023 wade-portkey. All rights reserved.
//

#import "APKViewController.h"
#import <AelfPortkey/ARNSDKRootView.h>

@interface APKViewController ()

@property (nonatomic, strong) ARNSDKRootView *rnRootView;

@end

@implementation APKViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    CGSize size = UIScreen.mainScreen.bounds.size;
    self.rnRootView = [[ARNSDKRootView alloc] initWithFrame:CGRectMake(0, 0, size.width, size.height)];
    [self.view addSubview:self.rnRootView];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
