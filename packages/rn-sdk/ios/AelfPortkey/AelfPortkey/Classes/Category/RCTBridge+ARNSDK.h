//
//  RCTBridge+ARNSDK.h
//  AelfPortkey
//
//  Created by 崔风川 on 2023/9/15.
//

#import <React/RCTBridge.h>

@interface RCTBridge (ARNSDK)

- (void)executeSourceCode:(NSData *)sourceCode withSourceURL:(NSURL *)url sync:(BOOL)sync;

@end

