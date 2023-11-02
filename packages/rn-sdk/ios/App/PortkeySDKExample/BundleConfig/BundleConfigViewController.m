//
//  BundleConfigViewController.m
//  PortkeySDKExample_Example
//
//  Created by wade-cui on 2023/11/2.
//  Copyright © 2023 wade-portkey. All rights reserved.
//

#import "BundleConfigViewController.h"
#import <YYKit/YYKit.h>

const NSString *kBundleConfigKey = @"BundleConfigKey";

@interface BundleConfigViewController ()

@property (nonatomic, strong) UILabel *useLocalLabel;
@property (nonatomic, strong) UISwitch *useLocalSwitch;


@end

@implementation BundleConfigViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self.view addSubview:self.useLocalLabel];
    [self.view addSubview:self.useLocalSwitch];
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    
    [self.useLocalLabel sizeToFit];
    self.useLocalLabel.left = 20;
    self.useLocalLabel.top = 100;
    
    [self.useLocalSwitch sizeToFit];
    self.useLocalSwitch.left = self.useLocalLabel.right + 8;
    self.useLocalSwitch.centerY = self.useLocalLabel.centerY;
}

- (void)initShowSwitch

#pragma mark - Selector

- (void)switchValueChanged:(UISwitch *)useLocalSwitch {
    
}

#pragma mark - Getter

- (UILabel *)useLocalLabel {
    if (!_useLocalLabel) {
        _useLocalLabel = [UILabel new];
        _useLocalLabel.text = @"use local host: ";
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

@end
