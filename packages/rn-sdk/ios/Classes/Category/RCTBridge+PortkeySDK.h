//
//  RCTBridge+PortkeySDK.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import <React/RCTBridge.h>

@interface RCTBridge (PortkeySDK)

- (void)executeSourceCode:(NSData *)sourceCode withSourceURL:(NSURL *)url sync:(BOOL)sync;

@end

