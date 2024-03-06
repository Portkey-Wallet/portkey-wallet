import Config from 'react-native-config';

export const SCHEME = 'portkey.finance://';

export const TWITTER_CLIENT_ID = Config.TWITTER_CLIENT_ID;

export const LINK_TWITTER_URL = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
  SCHEME,
)}&scope=tweet.read%20users.read%20follows.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
