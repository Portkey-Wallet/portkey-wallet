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
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android/distribution_groups/did-test-group"
                                },
                                      {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v3_027o_e27390d9-f6e4-4c1d-a538-f201dfb49c6g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
       $RNNOTICE_BOT_URI
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
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS/distribution_groups/did-test-group"
                                },
                                {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v3_027o_04ca9071-1f6c-4798-afa0-35b37b9f0d8g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
       $NOTICE_BOT_URI
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

     # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-testFlight" ];
     then
        curl -X POST -H "Content-Type: application/json" \
         -d '{"msg_type":"text","content":{"text":"The latest ios package(id:'$APPCENTER_BUILD_ID') has been completed and successfully pushed to testFlight, you can apply to join the internal testing group and view/download the latest version of the app on testFlight."}}' \
       $NOTICE_BOT_URI

    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi



    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "google-play" ];
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
                                    "text": "The latest android alpha package(id:'$APPCENTER_BUILD_ID',environment:'$ENVIRONMENT')has updated at googlePlay, "
                                },
                                {
                                    "tag": "a",
                                    "text": "click here",
                                    "href": "https://play.google.com/apps/internaltest/4700133845286187191"
                                },
                                {
                                    "tag": "text",
                                    "text": "view/download the latest version of the app on googlePlay."
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
       $NOTICE_BOT_URI
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi


        # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "android-v2" ];
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
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android-V2/distribution_groups/did-test-group"
                                },
                                      {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v3_027o_1f2f81f0-cbfa-46d1-b966-c403dec9eb0g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
        $NOTICE_BOT_URI
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi


    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-v2" ];
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
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS-V2/distribution_groups/did-test-group"
                                },
                                {
                                    "tag": "text",
                                    "text": "check and download"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v3_027o_2b4935be-cbde-466e-898d-c0dab7c2528g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
         $NOTICE_BOT_URI
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

     # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-testFlight-v2" ];
     then
        curl -X POST -H "Content-Type: application/json" \
         -d '{"msg_type":"text","content":{"text":"The latest ios package(id:'$APPCENTER_BUILD_ID') has been completed and successfully pushed to testFlight, you can apply to join the internal testing group and view/download the latest version of the app on testFlight."}}' \
       $NOTICE_BOT_URI

    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi



    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "google-play-v2" ];
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
                                    "text": "The latest android alpha package(id:'$APPCENTER_BUILD_ID',environment:'$ENVIRONMENT')has updated at googlePlay, "
                                },
                                {
                                    "tag": "a",
                                    "text": "click here",
                                    "href": "https://play.google.com/apps/internaltest/4701401229375917460"
                                },
                                {
                                    "tag": "text",
                                    "text": "view/download the latest version of the app on googlePlay."
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
       $NOTICE_BOT_URI
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi



fi


