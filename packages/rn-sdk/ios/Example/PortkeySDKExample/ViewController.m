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

@interface ViewController ()

//@property (nonatomic, strong) PortkeySDKRootView *rnRootView;
@property (nonatomic, strong) UIButton *jssdkButton;

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.title = @"Hello Portkey";
    
    CGSize screenSize = UIScreen.mainScreen.bounds.size;
//    self.rnRootView = [[PortkeySDKRootView alloc] initWithModuleName:@"test"];
//    self.rnRootView.frame = CGRectMake(0, 0, size.width, size.height);
//    [self.view addSubview:self.rnRootView];
    CGRect jssdkButtonRect = CGRectZero;
    jssdkButtonRect.size = [self buttonSize];
    jssdkButtonRect.origin = CGPointMake((screenSize.width - [self buttonSize].width) / 2, 150);
    self.jssdkButton.frame = jssdkButtonRect;
    [self.view addSubview:self.jssdkButton];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Selector

- (void)jssdkButtonClicked:(id)sender {
    JSSDKViewController *vc = [JSSDKViewController new];
    [self.navigationController pushViewController:vc animated:YES];
}

#pragma mark - Getter

- (UIButton *)jssdkButton {
    if (!_jssdkButton) {
        _jssdkButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        _jssdkButton.layer.cornerRadius = 8;
        [_jssdkButton setTitle:@"JS SDK Test" forState:UIControlStateNormal];
        _jssdkButton.titleLabel.font = [UIFont boldSystemFontOfSize:18];
        [_jssdkButton setBackgroundColor:[UIColor greenColor]];
        [_jssdkButton addTarget:self action:@selector(jssdkButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _jssdkButton;
}

- (CGSize)buttonSize {
    return CGSizeMake(200, 44);
}

@end
