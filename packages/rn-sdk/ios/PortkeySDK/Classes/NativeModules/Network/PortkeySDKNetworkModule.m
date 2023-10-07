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
            if (res.statusCode == 200) {
                NSDictionary *dataDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
                if (dataDict) {
                    NSDictionary *result = @{
                        @"status": @1,
                        @"result": dataDict,
                        @"errCode": @""
                    };
                    NSData *resultData = [NSJSONSerialization  dataWithJSONObject:result options:0 error:nil];
                    NSString *resultString = [[NSString alloc] initWithData:resultData encoding:NSUTF8StringEncoding];
                    resolve(resultString);
                } else {
                    reject(@"-101", @"response data is null", nil);
                }
            }
        } else {
            reject([@(error.code) stringValue], error.description, error);
        }
    }];
    [task resume];
}

@end
