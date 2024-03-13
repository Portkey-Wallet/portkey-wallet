//
//  NSString+PortkeySDK.m
//  PortkeySDK
//
//  Created by wade-cui on 2023/11/21.
//

#import "NSString+PortkeySDK.h"

@implementation NSString (PortkeySDK)

- (NSDictionary *)portkey_jsonObject {
    if (self.length <= 0) {
        return nil;
    }

    NSData *jsonData = [self dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
    if(err) {
        return nil;
    }
    return dic;
}

@end
