//
//  ViewController.m
//  PortkeySDK
//
//  Created by wade-portkey on 09/13/2023.
//  Copyright (c) 2023 wade-portkey. All rights reserved.
//

#import "ViewController.h"
#import <PortkeySDK/PortkeySDKRNViewController.h>
#import <PortkeySDK/PortkeySDKRouterModule.h>
#import <PortkeySDK/PortkeySDKMMKVStorage.h>
#import <YYKit/YYKit.h>
#import <Toast/Toast.h>
#import "TermsOfServiceViewController.h"
#import <PortkeySDK/PortkeySDKJSCallModule.h>

@interface ViewController ()

@property (nonatomic, strong) UIButton *loginButton;

@property (nonatomic, strong) UIButton *mainChainButton;
@property (nonatomic, strong) UIButton *tdvvChainButton;
@property (nonatomic, strong) UIButton *tdvwChainButton;

@property (nonatomic, strong) UIButton *mainNetButton;
@property (nonatomic, strong) UIButton *testNetButton;

@property (nonatomic, strong) UIButton *scanQrcodeButton;

@property (nonatomic, strong) UIButton *exitButton;

@property (nonatomic, strong) UIButton *termsButton;

@property (nonatomic, strong) UIButton *jsCallButton;

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
    
    self.exitButton = [self createButtonWithTitle:@"Exit Wallet"];
    self.exitButton.frame = self.testNetButton.frame;
    self.exitButton.top = self.testNetButton.bottom + 20;
    [self.exitButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self exitWallet];
    }];
    [self.view addSubview:self.exitButton];
    
    self.termsButton = [self createButtonWithTitle:@"Config Terms Of Service"];
    self.termsButton.frame = self.exitButton.frame;
    self.termsButton.top = self.exitButton.bottom + 40;
    [self.termsButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        @strongify(self)
        [self configTermsOfService];
    }];
    [self.view addSubview:self.termsButton];
    
    self.scanQrcodeButton = [self createButtonWithTitle:@"Scan QRCode"];
    self.scanQrcodeButton.frame = self.termsButton.frame;
    self.scanQrcodeButton.top = self.termsButton.bottom + 20;
    [self.scanQrcodeButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        [[PortkeySDKRouterModule sharedInstance] navigateTo:@"scan_qr_code_entry" from:@"" targetScene:@""];
    }];
    [self.view addSubview:self.scanQrcodeButton];
    
    self.jsCallButton = [self createButtonWithTitle:@"Call JS"];
    self.jsCallButton.frame = self.scanQrcodeButton.frame;
    self.jsCallButton.top = self.scanQrcodeButton.bottom + 20;
    [self.jsCallButton addBlockForControlEvents:UIControlEventTouchUpInside block:^(id  _Nonnull sender) {
        [[PortkeySDKJSCallModule sharedInstance] enqueueJSCall:@"WalletModule" method:@"callContractMethod" params:@{@"name": @"portkey"} callback:^(NSString * _Nullable result) {
            NSLog(@"js call result : %@", result);
        }];
    }];
    [self.view addSubview:self.jsCallButton];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - Selector

- (void)loginButtonClicked:(id)sender {
//    [[PortkeySDKRouterModule sharedInstance] navigateTo:@"referral_entry" from:@"" targetScene:@""];
    [[PortkeySDKRouterModule sharedInstance] navigateToWithOptions:@"referral_entry"
                                                              from:@""
                                                            params:@{}
                                                          callback:^(NSArray *response) {
        NSLog(@"response: %@", response);
    }];
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
    [PortkeySDKMMKVStorage clear];
    [self.view makeToast:@"Exit Wallet Successfully"];
}

- (void)configTermsOfService {
    TermsOfServiceViewController *vc = [TermsOfServiceViewController new];
    [self.navigationController pushViewController:vc animated:YES];
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
