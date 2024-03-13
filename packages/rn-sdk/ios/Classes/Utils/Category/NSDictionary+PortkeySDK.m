//
//  NSDictionary+PortkeySDK.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/22.
//

#import "NSDictionary+PortkeySDK.h"

@implementation NSDictionary (PortkeySDK)

- (NSString *)portkey_jsonString {
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:self options:0 error:0];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    return jsonStr;
}

@end
