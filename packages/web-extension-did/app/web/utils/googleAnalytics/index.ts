import { LoginMethod, TAllLoginKey } from '@portkey-wallet/types/types-ca/wallet';
import { getWalletState } from 'utils/lib/SWGetReduxStore';
import { TGAPageKey } from './types';

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

// Get via https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
const MEASUREMENT_ID = 'G-CH7VZD8PZD';
// TODO
const GA_API_SECRET = process.env.GA_API_SECRET;
const DEFAULT_ENGAGEMENT_TIME_MSEC = 100;

// Duration of inactivity after which a new session is created
const SESSION_EXPIRATION_IN_MIN = 30;

class Analytics {
  debug: boolean;
  constructor(debug = false) {
    this.debug = debug;
  }

  // Returns the client id, or creates a new one if one doesn't exist.
  // Stores client id in local storage to keep the same client id as long as
  // the extension is installed.
  async getOrCreateClientId() {
    let { clientId } = await chrome.storage.local.get('clientId');
    if (!clientId) {
      // Generate a unique client ID, the actual value is not relevant
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  // Returns the current session id, or creates a new one if one doesn't exist or
  // the previous one has expired.
  async getOrCreateSessionId() {
    // Use storage.session because it is only in memory
    let { sessionData } = await chrome.storage.session.get('sessionData');
    const currentTimeInMs = Date.now();
    // Check if session exists and is still valid
    if (sessionData && sessionData.timestamp) {
      // Calculate how long ago the session was last updated
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      // Check if last update lays past the session expiration threshold
      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        // Clear old session id to start a new session
        sessionData = null;
      } else {
        // Update timestamp to keep session alive
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      // Create and store a new session
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  // Fires an event with optional params. Event names must only include letters and underscores.
  async fireEvent(name: string, params: any = {}) {
    // Configure session id and engagement time if not present, for more details see:
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
    if (!params.session_id) {
      params.session_id = await this.getOrCreateSessionId();
    }
    if (!params.engagement_time_msec) {
      params.engagement_time_msec = DEFAULT_ENGAGEMENT_TIME_MSEC;
    }
    if (!GA_API_SECRET) return;
    try {
      const response = await fetch(
        `${this.debug ? GA_DEBUG_ENDPOINT : GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [
              {
                name,
                params,
              },
            ],
          }),
        },
      );
      if (!this.debug) {
        return;
      }
      console.log(await response.text());
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // Fire a page view event.
  async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams = {}) {
    return this.fireEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      ...additionalParams,
    });
  }

  async loginStartEvent(loginType: TAllLoginKey, additionalParams = {}) {
    try {
      const params = { timestamp: Date.now(), loginType };
      await chrome.storage.session.set({ loginStart: params });
      const { currentNetwork } = await getWalletState();

      return this.fireEvent('extension_login_start', {
        ...params,
        networkType: currentNetwork,
        ...additionalParams,
      });
    } catch (error) {
      console.error('Google Analytics request failed with an exception', error);
    }
  }

  async loginEndEvent(loginMethod: LoginMethod, additionalParams = {}) {
    try {
      const { loginStart } = await chrome.storage.session.get('loginStart');
      const { loginType, timestamp } = loginStart ?? {};
      const { currentNetwork } = await getWalletState();

      const params = { timestamp: Date.now(), loginType, loginMethod, duration: 0 };

      params.duration = params.timestamp - timestamp;

      return this.fireEvent('extension_login_end', {
        ...params,
        networkType: currentNetwork,
        ...additionalParams,
      });
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async pageStateUpdateStartEvent(pageKey: TGAPageKey, _additionalParams = {}) {
    try {
      const params = { timestamp: Date.now(), pageKey };

      await chrome.storage.session.set({ [`${pageKey}_pageStateUpdate`]: { timestamp: params.timestamp } });
      // console.log(params, pageKey, 'params===pageStateUpdateStartEvent====pageStateUpdate');

      // return this.fireEvent('extension_page_update_start', {
      //   ...params,
      //   ...additionalParams,
      // });
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  async pageStateUpdateEndEvent(pageKey: TGAPageKey, additionalParams = {}) {
    try {
      const sessionKey = `${pageKey}_pageStateUpdate`;
      const sessionParams = await chrome.storage.session.get(sessionKey);
      const { timestamp } = sessionParams?.[sessionKey] ?? {};

      const params = { timestamp: Date.now(), pageKey, duration: 0 };

      params.duration = params.timestamp - timestamp;
      // console.log(params, pageKey, 'params===pageStateUpdateEndEvent====pageStateUpdate');
      return this.fireEvent('extension_page_update_end', {
        ...params,
        ...additionalParams,
      });
    } catch (e) {
      console.error('Google Analytics request failed with an exception', e);
    }
  }

  // Fire an error event.
  async fireErrorEvent(error: any, additionalParams = {}) {
    // Note: 'error' is a reserved event name and cannot be used
    // see https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
    return this.fireEvent('extension_error', {
      ...error,
      ...additionalParams,
    });
  }
}

const googleAnalytics = new Analytics();
export default googleAnalytics;
