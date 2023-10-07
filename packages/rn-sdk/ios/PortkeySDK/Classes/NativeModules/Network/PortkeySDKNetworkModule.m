//
//  PortkeySDKNetworkModule.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/10/7.
//

#import "PortkeySDKNetworkModule.h"

@implementation PortkeySDKNetworkModule

RCT_EXPORT_MODULE(NetworkModule);

RCT_EXPORT_METHOD(fetch:(NSString *)url
                  method:(NSString *)method
                  params:(id)params
                  headers:(id)headers
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *errorMsg = nil;
    if (url.length <= 0) {
        errorMsg = @"url can not be null";
    }
    if (![method isEqualToString:@"GET"] && ![method isEqualToString:@"POST"]) {
        errorMsg = @"methos must be GET or POST";
    }
    if (errorMsg.length > 0) {
        reject(@"-100", errorMsg, nil);
        return;
    }
    NSURL *requestUrl= [NSURL URLWithString:url];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:requestUrl];
    request.HTTPMethod = method;
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task= [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if(!error){
            NSHTTPURLResponse *res = (NSHTTPURLResponse *)response;
            NSDictionary *dataDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            if (dataDict) {
                NSDictionary *result = @{
                    @"status": @1,
                    @"result": dataDict ?: @{},
                    @"errCode": @""
                };
                NSData *resultData = [NSJSONSerialization  dataWithJSONObject:result options:0 error:nil];
                NSString *resultString = [[NSString alloc] initWithData:resultData encoding:NSUTF8StringEncoding];
                resolve(resultString);
            } else {
                resolve([self resultWrapperWithStatus:1 errCode:[@(res.statusCode) stringValue] result:nil]);
            }
        } else {
            resolve([self resultWrapperWithStatus:-1 errCode:[@(error.code) stringValue] result:nil]);
        }
    }];
    [task resume];
}

- (NSString *)resultWrapperWithStatus:(NSInteger)status
                                  errCode:(NSString *)errCode
                                   result:(NSDictionary *)result {
    NSDictionary *resultDict = @{
        @"status": @(status),
        @"result": result ?: @{},
        @"errCode": errCode ?: @"0"
    };
    NSData *resultData = [NSJSONSerialization dataWithJSONObject:resultDict options:0 error:nil];
    NSString *resultString = [[NSString alloc] initWithData:resultData encoding:NSUTF8StringEncoding];
    return resultString;
}

@end
