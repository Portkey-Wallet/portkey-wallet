if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then

    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "android" ];
     then
        curl -X POST -H "Content-Type: application/json" \
        -d '{
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": "Notification about package updating",
                        "content": [
                            [{
                                    "tag": "text",
                                    "text": "The latest android package（id:'$APPCENTER_BUILD_ID',environment:'$ENVIRONMENT'）has updated: "
                                },
                                {
                                    "tag": "a",
                                    "text": "click here",
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android"
                                },
                                      {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v2_4fe5ee4e-d195-47b8-a783-33a7201118bg"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi


    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios" ];
     then
        curl -X POST -H "Content-Type: application/json" \
        -d '{
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": "Notification about package updating",
                        "content": [
                            [
                                {
                                    "tag": "text",
                                    "text": "The latest ios package(id:'$APPCENTER_BUILD_ID',environment:'$ENVIRONMENT')has updated: "
                                },
                                {
                                    "tag": "a",
                                    "text": "click here",
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS"
                                },
                                {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v2_4dceff8d-f98a-4774-9319-ac019165206g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

     # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-testFlight" ];
     then
        curl -X POST -H "Content-Type: application/json" \
         -d '{"msg_type":"text","content":{"text":"The latest ios package(id:'$APPCENTER_BUILD_ID') has been completed and successfully pushed to testFlight, you can apply to join the internal testing group and view/download the latest version of the app on testFlight."}}' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2

    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

fi




