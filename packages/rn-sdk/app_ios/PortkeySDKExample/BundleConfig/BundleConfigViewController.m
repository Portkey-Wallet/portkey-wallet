//
//  BundleConfigViewController.m
//  PortkeySDKExample_Example
//
//  Created by wade-cui on 2023/11/2.
//  Copyright © 2023 wade-portkey. All rights reserved.
//

#import "BundleConfigViewController.h"
#import <YYKit/YYKit.h>
#import <PortkeySDK/PortkeySDKBundleUtil.h>
#import <Toast/Toast.h>
#import <React/React-Core-umbrella.h>

@interface BundleConfigViewController ()

@property (nonatomic, strong) UILabel *useLocalLabel;
@property (nonatomic, strong) UISwitch *useLocalSwitch;

@property (nonatomic, strong) UIButton *bundleServerButton;

@end

@implementation BundleConfigViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self.view addSubview:self.useLocalLabel];
    [self.view addSubview:self.useLocalSwitch];
    [self.view addSubview:self.bundleServerButton];
    
    [self initShowSwitch];
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    
    [self.useLocalLabel sizeToFit];
    self.useLocalLabel.left = 20;
    self.useLocalLabel.top = 100;
    
    [self.useLocalSwitch sizeToFit];
    self.useLocalSwitch.left = self.useLocalLabel.right + 8;
    self.useLocalSwitch.centerY = self.useLocalLabel.centerY;
    
    self.bundleServerButton.size = [self buttonSize];
    self.bundleServerButton.top = self.useLocalLabel.top + 44;
    self.bundleServerButton.centerX = self.view.width / 2;
}

- (void)initShowSwitch {
    self.useLocalSwitch.on = [PortkeySDKBundleUtil useLocalBundle];
}

#pragma mark - Selector

- (void)switchValueChanged:(UISwitch *)useLocalSwitch {
    [PortkeySDKBundleUtil setUseLocalBundle:useLocalSwitch.on];
    [self.view makeToast:@"Please Restart Your Device"];
}

- (void)bundleServerButtonClicked:(id)sender {
    UIAlertController *alertController = [UIAlertController
        alertControllerWithTitle:@"Configure Bundler"
                         message:@"Provide a custom bundler address, port, and entrypoint."
                  preferredStyle:UIAlertControllerStyleAlert];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
      textField.placeholder = @"0.0.0.0";
    }];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
      textField.placeholder = @"8081";
    }];
    [alertController addTextFieldWithConfigurationHandler:^(UITextField *textField) {
      textField.placeholder = @"index";
    }];
    @weakify(self)
    [alertController
        addAction:[UIAlertAction
                      actionWithTitle:@"Apply Changes"
                                style:UIAlertActionStyleDefault
                              handler:^(__unused UIAlertAction *action) {
                                NSArray *textfields = alertController.textFields;
                                UITextField *ipTextField = textfields[0];
                                UITextField *portTextField = textfields[1];
                                UITextField *bundleRootTextField = textfields[2];
                                if (ipTextField.text.length == 0 && portTextField.text.length == 0) {
                                  [weak_self setDefaultJSBundle];
                                  return;
                                }
                                NSNumberFormatter *formatter = [NSNumberFormatter new];
                                formatter.numberStyle = NSNumberFormatterDecimalStyle;
                                NSNumber *portNumber =
                                    [formatter numberFromString:portTextField.text];
                                if (portNumber == nil) {
                                  portNumber = [NSNumber numberWithInt:RCT_METRO_PORT];
                                }
                                [RCTBundleURLProvider sharedSettings].jsLocation = [NSString
                                    stringWithFormat:@"%@:%d", ipTextField.text, portNumber.intValue];
                              }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Reset to Default"
                                                        style:UIAlertActionStyleDefault
                                                      handler:^(__unused UIAlertAction *action) {
                                                        [weak_self setDefaultJSBundle];
                                                      }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Cancel"
                                                        style:UIAlertActionStyleCancel
                                                      handler:^(__unused UIAlertAction *action) {
                                                        return;
                                                      }]];
    [RCTPresentedViewController() presentViewController:alertController animated:YES completion:NULL];
}

#pragma mark - Private

- (void)setDefaultJSBundle
{
    [[RCTBundleURLProvider sharedSettings] resetToDefaults];
}

#pragma mark - Getter

- (CGSize)buttonSize {
    return CGSizeMake(300, 44);
}

- (UILabel *)useLocalLabel {
    if (!_useLocalLabel) {
        _useLocalLabel = [UILabel new];
        _useLocalLabel.text = @"use local bundle: ";
    }
    return _useLocalLabel;
}

- (UISwitch *)useLocalSwitch {
    if (!_useLocalSwitch) {
        _useLocalSwitch = [UISwitch new];
        [_useLocalSwitch addTarget:self action:@selector(switchValueChanged:) forControlEvents:UIControlEventValueChanged];
    }
    return _useLocalSwitch;
}

- (UIButton *)bundleServerButton {
    if (!_bundleServerButton) {
        _bundleServerButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [_bundleServerButton setTitle:@"Config Server Bundle" forState:UIControlStateNormal];
        _bundleServerButton.layer.cornerRadius = 8;
        _bundleServerButton.titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [_bundleServerButton setBackgroundColor:[UIColor lightGrayColor]];
        [_bundleServerButton addTarget:self action:@selector(bundleServerButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _bundleServerButton;
}

@end
