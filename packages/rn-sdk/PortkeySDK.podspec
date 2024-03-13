#
# Be sure to run `pod lib lint PortkeySDK.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'PortkeySDK'
  s.version          = '0.1.0'
  s.summary          = 'A short description of PortkeySDK.'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/wade-portkey/PortkeySDK'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.author           = { 'wade-portkey' => 'codingwizard@portkey.finance' }
  s.source           = { :git => 'https://github.com/wade-portkey/PortkeySDK.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '10.0'

  s.resources = ['ios/Assets/**/*.png']
  s.source_files = 'ios/Classes/**/*'
  
  s.resource_bundles = {
    'JSBundle' => ['ios/Assets/*.bundle'],
#    'ImageResources' => ['PortkeySDK/Assets/**/*.png']
  }

  s.public_header_files = 'Pod/Classes/**/*.h'
  s.dependency 'React'
  s.dependency 'React-RCTAppDelegate'
  s.dependency 'MMKV'
end
