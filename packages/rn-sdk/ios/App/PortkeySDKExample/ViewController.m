//
//  ViewController.m
//  PortkeySDK
//
//  Created by wade-portkey on 09/13/2023.
//  Copyright (c) 2023 wade-portkey. All rights reserved.
//

#import "ViewController.h"
#import <PortkeySDK/PortkeySDKRootView.h>
#import "JSSDKViewController.h"
#import <PortkeySDK/PortkeySDKRouterModule.h>

@interface ViewController ()

@property (nonatomic, strong) UIButton *loginButton;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.title = @"Portkey SDK";
    
    CGSize screenSize = UIScreen.mainScreen.bounds.size;
    
    CGRect jssdkButtonRect = CGRectZero;
    jssdkButtonRect.size = [self buttonSize];
    jssdkButtonRect.origin = CGPointMake((screenSize.width - [self buttonSize].width) / 2, 150);
    
    CGRect loginButtonRect = jssdkButtonRect;
    loginButtonRect.origin = CGPointMake((screenSize.width - [self buttonSize].width) / 2, 250);
    self.loginButton.frame = loginButtonRect;
    [self.view addSubview:self.loginButton];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Selector

- (void)loginButtonClicked:(id)sender {
    [[PortkeySDKRouterModule sharedInstance] navigateTo:@"referral_entry" from:@"" targetScene:@""];
}

#pragma mark - Getter

- (UIButton *)loginButton {
    if (!_loginButton) {
        _loginButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        _loginButton.layer.cornerRadius = 8;
        [_loginButton setTitle:@"login/register" forState:UIControlStateNormal];
        _loginButton.titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [_loginButton setBackgroundColor:[UIColor greenColor]];
        [_loginButton addTarget:self action:@selector(loginButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginButton;
}

- (CGSize)buttonSize {
    return CGSizeMake(200, 44);
}

@end
