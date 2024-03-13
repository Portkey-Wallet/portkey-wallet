//
//  TermsOfServiceViewController.m
//  PortkeySDKExample_Example
//
//  Created by wade-cui on 2023/10/25.
//  Copyright © 2023 wade-portkey. All rights reserved.
//

#import "TermsOfServiceViewController.h"
#import <YYKit/YYKit.h>
#import <Toast/Toast.h>
#import <PortkeySDK/PortkeySDKPortkey.h>

@interface TermsOfServiceViewController ()

@property (nonatomic, strong) UITextField *prefixTextField;
@property (nonatomic, strong) UITextField *titleTextField;

@property (nonatomic, strong) UIButton *confirmButton;

@end

@implementation TermsOfServiceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    self.title = @"Terms Of Service Config";
    
    CGSize screenSize = UIScreen.mainScreen.bounds.size;
    
    CGRect textFieldRect = CGRectZero;
    textFieldRect.size = [self textFieldSize];
    textFieldRect.origin = CGPointMake((screenSize.width - [self textFieldSize].width) / 2, 150);
    
    self.prefixTextField = [self createTextFieldWithPlaceholder:@"please input prefix"];
    self.prefixTextField.frame = textFieldRect;
    [self.view addSubview:self.prefixTextField];
    
    self.titleTextField = [self createTextFieldWithPlaceholder:@"please input title"];
    self.titleTextField.frame = textFieldRect;
    self.titleTextField.top = self.prefixTextField.bottom + 20;
    [self.view addSubview:self.titleTextField];
    
    self.confirmButton.size = CGSizeMake(200, 44);
    self.confirmButton.centerX = screenSize.width / 2;
    self.confirmButton.top = self.titleTextField.bottom + 100;
    [self.confirmButton addTarget:self action:@selector(confirmButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:self.confirmButton];
    
    [self readAndShowConfig];
}

- (void)readAndShowConfig {
    NSString *prefix = [[self config] termsOfServicePrefix];
    if (prefix.length) {
        self.prefixTextField.text = prefix;
    }
    
    NSString *title = [[self config] termsOfServiceTitle];
    if (title.length) {
        self.titleTextField.text = title;
    }
}

#pragma mark - Selector Methods

- (void)confirmButtonClicked:(id)sender {
    [[self config] configTermsOfServiceWithPrefix:[self.prefixTextField.text stringByTrim]
                                               title:[self.titleTextField.text stringByTrim]];
    
    [self.view makeToast:@"config success"];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self.navigationController popViewControllerAnimated:YES];
    });
}

#pragma mark - Private Methods

- (UITextField *)createTextFieldWithPlaceholder:(NSString *)placeholder {
    UITextField *textField = [[UITextField alloc] init];
    textField.layer.cornerRadius = 8;
    textField.layer.borderWidth = 2;
    textField.layer.borderColor = [UIColor blueColor].CGColor;
    textField.layer.sublayerTransform = CATransform3DMakeTranslation(5, 0, 0);
    textField.placeholder = placeholder;
    return textField;
}

- (UIButton *)confirmButton {
    if (!_confirmButton) {
        _confirmButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [_confirmButton setTitle:@"Confirm" forState:UIControlStateNormal];
        _confirmButton.layer.cornerRadius = 8;
        _confirmButton.titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [_confirmButton setBackgroundColor:[UIColor lightGrayColor]];
    }
    return _confirmButton;
}

- (CGSize)textFieldSize {
    return CGSizeMake(300, 44);
}

- (id<PortkeySDKConfigProtocol>)config {
    return [PortkeySDKPortkey portkey].config;
}

@end
