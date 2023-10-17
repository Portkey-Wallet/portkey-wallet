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
#import <PortkeySDK/PortkeySDKMMKVStorage.h>
#import <YYKit/YYKit.h>
#import <Toast/Toast.h>

@interface ViewController ()

@property (nonatomic, strong) UIButton *loginButton;

@property (nonatomic, strong) UIButton *mainChainButton;
@property (nonatomic, strong) UIButton *tdvvChainButton;
@property (nonatomic, strong) UIButton *tdvwChainButton;

@property (nonatomic, strong) UIButton *mainNetButton;
@property (nonatomic, strong) UIButton *testNetButton;
@property (nonatomic, strong) UIButton *test1NetButton;
@property (nonatomic, strong) UIButton *test2NetButton;

@property (nonatomic, strong) UIButton *exitButton;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.title = @"Portkey SDK";
    
    CGSize screenSize = UIScreen.mainScreen.bounds.size;
    
    CGRect loginButtonRect = CGRectZero;
    loginButtonRect.size = [self buttonSize];
    loginButtonRect.origin = CGPointMake((screenSize.width - [self buttonSize].width) / 2, 100);
    self.loginButton.frame = loginButtonRect;
    [self.view addSubview:self.loginButton];
    
    self.mainChainButton = [self createButtonWithTitle:@"Switch to MAIN CHAIN"];
    self.mainChainButton.frame = self.loginButton.frame;
    self.mainChainButton.top = self.loginButton.bottom + 20;
    @weakify(self)
    [self.mainChainButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchChainWithChainId:@"AELF"];
    }];
    [self.view addSubview:self.mainChainButton];
    
    self.tdvvChainButton = [self createButtonWithTitle:@"Switch to SIDE CHAIN tDVV"];
    self.tdvvChainButton.frame = self.mainChainButton.frame;
    self.tdvvChainButton.top = self.mainChainButton.bottom + 5;
    [self.tdvvChainButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchChainWithChainId:@"tDVV"];
    }];
    [self.view addSubview:self.tdvvChainButton];
    
    self.tdvwChainButton = [self createButtonWithTitle:@"Switch to SIDE CHAIN tDVW"];
    self.tdvwChainButton.frame = self.tdvvChainButton.frame;
    self.tdvwChainButton.top = self.tdvvChainButton.bottom + 5;
    [self.tdvwChainButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchChainWithChainId:@"tDVW"];
    }];
    [self.view addSubview:self.tdvwChainButton];
    
    self.mainNetButton = [self createButtonWithTitle:@"Switch to MAIN NET"];
    self.mainNetButton.frame = self.tdvwChainButton.frame;
    self.mainNetButton.top = self.tdvwChainButton.bottom + 20;
    [self.mainNetButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchEndPointUrl:@"https://did-portkey.portkey.finance"];
    }];
    [self.view addSubview:self.mainNetButton];
    
    self.testNetButton = [self createButtonWithTitle:@"Switch to TEST NET"];
    self.testNetButton.frame = self.mainNetButton.frame;
    self.testNetButton.top = self.mainNetButton.bottom + 5;
    [self.testNetButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchEndPointUrl:@"https://did-portkey-test.portkey.finance"];
    }];
    [self.view addSubview:self.testNetButton];
    
    self.test1NetButton = [self createButtonWithTitle:@"Switch to TEST1 NET"];
    self.test1NetButton.frame = self.testNetButton.frame;
    self.test1NetButton.top = self.testNetButton.bottom + 5;
    [self.test1NetButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchEndPointUrl:@"https://localtest-applesign.portkey.finance"];
    }];
    [self.view addSubview:self.test1NetButton];
    
    self.test2NetButton = [self createButtonWithTitle:@"Switch to TEST2 NET"];
    self.test2NetButton.frame = self.test1NetButton.frame;
    self.test2NetButton.top = self.test1NetButton.bottom + 5;
    [self.test2NetButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self switchEndPointUrl:@"https://localtest-applesign2.portkey.finance"];
    }];
    [self.view addSubview:self.test2NetButton];
    
    self.exitButton = [self createButtonWithTitle:@"Exit Wallet"];
    self.exitButton.frame = self.test2NetButton.frame;
    self.exitButton.top = self.test2NetButton.bottom + 20;
    [self.exitButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self exitWallet];
    }];
    [self.view addSubview:self.exitButton];
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

- (void)switchChainWithChainId:(NSString *)chainId {
    [PortkeySDKMMKVStorage writeString:chainId forKey:@"currChainId"];
    [self.view makeToast:[NSString stringWithFormat:@"chainId changed to %@", chainId]];
}

- (void)switchEndPointUrl:(NSString *)url {
    [PortkeySDKMMKVStorage writeString:url forKey:@"endPointUrl"];
    [self.view makeToast:[NSString stringWithFormat:@"endPoint changed to %@", url]];
}

- (void)exitWallet {
    [self.view makeToast:@"Exit Wallet Successfully"];
}

#pragma mark - Getter

- (UIButton *)loginButton {
    if (!_loginButton) {
        _loginButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        _loginButton.layer.cornerRadius = 8;
        [_loginButton setTitle:@"login/register" forState:UIControlStateNormal];
        _loginButton.titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [_loginButton setBackgroundColor:[UIColor lightGrayColor]];
        [_loginButton addTarget:self action:@selector(loginButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginButton;
}

- (CGSize)buttonSize {
    return CGSizeMake(300, 44);
}

- (UIButton *)createButtonWithTitle:(NSString *)title {
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.layer.cornerRadius = 8;
    [button setTitle:title forState:UIControlStateNormal];
    button.titleLabel.font = [UIFont boldSystemFontOfSize:18];
    [button setBackgroundColor:[UIColor lightGrayColor]];
    return button;
}

@end
