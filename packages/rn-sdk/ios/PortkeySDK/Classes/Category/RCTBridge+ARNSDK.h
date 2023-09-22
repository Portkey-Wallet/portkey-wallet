//
//  RCTBridge+ARNSDK.h
//  PortkeySDK
//
//  Created by wade-portkey on 2023/9/15.
//

#import <React/RCTBridge.h>

@interface RCTBridge (ARNSDK)

- (void)executeSourceCode:(NSData *)sourceCode withSourceURL:(NSURL *)url sync:(BOOL)sync;

@end

