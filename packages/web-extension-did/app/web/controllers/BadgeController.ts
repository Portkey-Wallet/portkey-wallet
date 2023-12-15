import { ZERO } from '@portkey-wallet/constants/misc';

export default class BadgeController {
  setBadge(props: { value?: string | number; color?: string }) {
    const { value, color } = props;
    // set a badge
    let _v = '';
    if (value && value !== '0' && !isNaN(ZERO.plus(value).toNumber())) {
      _v = ZERO.plus(value).toFixed(0);
      if (ZERO.plus(value).gt(999)) {
        _v = '999+';
      }
    }
    chrome.action.setBadgeText({ text: _v });
    // set badge color
    color && chrome.action.setBadgeBackgroundColor({ color: `${color}` });
  }
}
