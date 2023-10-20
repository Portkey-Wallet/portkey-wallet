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
                  params:(NSDictionary *)params
                  headers:(NSDictionary *)headers
                  extraOptions:(NSDictionary *)extraOptions
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
    
    // set body
    if ([method isEqualToString:@"POST"] && params) {
        NSData *jsonBodyData = [NSJSONSerialization dataWithJSONObject:params options:kNilOptions error:nil];
        request.HTTPBody = jsonBodyData;
    }
    
    // set header
    [request setValue:@"application/json; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    if (headers) {
        [headers enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull value, BOOL * _Nonnull stop) {
            if (key && value) {
                [request setValue:value forHTTPHeaderField:key];
            }
        }];
    }
    
    // set other params
    if ([extraOptions isKindOfClass:NSDictionary.class]) {
        // set timeout interval
        NSNumber *maxWaitingTimeValue = [extraOptions valueForKey:@"maxWaitingTime"];
        if ([maxWaitingTimeValue isKindOfClass:NSNumber.class]) {
            NSInteger maxWaitingTime = [maxWaitingTimeValue integerValue];
            request.timeoutInterval = maxWaitingTime / 1000;
        }
    }
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task= [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSLog(@"url : %@; statusCode : %lid", url, (long)((NSHTTPURLResponse *)response).statusCode);
        NSLog(@"url : %@; response : %@", url, response);
        if(!error){
            NSHTTPURLResponse *res = (NSHTTPURLResponse *)response;
            NSDictionary *dataDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSLog(@"url : %@; data : %@", url, dataDict);
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
