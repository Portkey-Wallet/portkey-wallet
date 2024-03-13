//
//  PortkeySDKPermissionModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/25.
//

#import "PortkeySDKPermissionModule.h"
#import <Photos/Photos.h>
#import <AVFoundation/AVCaptureDevice.h>

@implementation PortkeySDKPermissionModule

RCT_EXPORT_MODULE(PermissionModule);

RCT_EXPORT_METHOD(isPermissionGranted:(NSString *)permission
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if ([permission isEqualToString:@"camera"]) {
        [self isCameraPermissionGranted:resolve];
    } else if ([permission isEqualToString:@"photo"]) {
        [self isPhotoPermissionGranted:resolve];
    } else {
        resolve(@NO);
    }
}

RCT_EXPORT_METHOD(requestPermission:(NSString *)permission
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    if ([permission isEqualToString:@"camera"]) {
        [self requestCameraPermission:resolve];
    } else if ([permission isEqualToString:@"photo"]) {
        [self requestPhotoPermission:resolve];
    } else {
        resolve(@NO);
    }
}

#pragma mark - Private Methods

- (void)isPhotoPermissionGranted:(RCTPromiseResolveBlock)resolve {
    PHAuthorizationStatus status;
    if (@available(iOS 14.0, *)) {
        status = [PHPhotoLibrary authorizationStatusForAccessLevel:PHAccessLevelReadWrite];
    } else {
        status = [PHPhotoLibrary authorizationStatus];
    }
    if (status == PHAuthorizationStatusNotDetermined ||
        status == PHAuthorizationStatusRestricted ||
        status == PHAuthorizationStatusDenied) {
        resolve(@NO);
    } else {
        resolve(@YES);
    }
}

- (void)isCameraPermissionGranted:(RCTPromiseResolveBlock)resolve {
    AVAuthorizationStatus authStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (authStatus == AVAuthorizationStatusNotDetermined ||
        authStatus == AVAuthorizationStatusRestricted ||
        authStatus ==AVAuthorizationStatusDenied) {
        resolve(@NO);
    } else {
        resolve(@YES);
    }
}

- (void)requestPhotoPermission:(RCTPromiseResolveBlock)resolve {
    if (@available(iOS 14.0, *)) {
        [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite handler:^(__unused PHAuthorizationStatus status) {
            [self isPhotoPermissionGranted:resolve];
        }];
    } else {
        [PHPhotoLibrary requestAuthorization:^(__unused PHAuthorizationStatus status) {
            [self isPhotoPermissionGranted:resolve];
        }];
    }
}

- (void)requestCameraPermission:(RCTPromiseResolveBlock)resolve {
    [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo
                               completionHandler:^(__unused BOOL granted) {
        [self isCameraPermissionGranted:resolve];
    }];
}

@end
