export enum PortkeyEntries {
  TEST = 'test',

  // entry stage
  SIGN_IN_ENTRY = 'sign_in_entry',
  SIGN_UP_ENTRY = 'sign_up_entry',
  SELECT_COUNTRY_ENTRY = 'select_country_entry',
  GUARDIAN_APPROVAL_ENTRY = 'guardian_approval_entry',
  VERIFIER_DETAIL_ENTRY = 'verifier_detail_entry',

  // verify stage
  GUARDIAN_HOME_ENTRY = 'guardian_home_entry',
  GUARDIAN_DETAIL_ENTRY = 'guardian_detail_entry',
  ADD_GUARDIAN_ENTRY = 'add_guardian_entry',
  MODIFY_GUARDIAN_ENTRY = 'modify_guardian_entry',

  // pin stage
  CHECK_PIN = 'check_pin_entry',
  SET_PIN = 'set_pin_entry',
  CONFIRM_PIN = 'confirm_pin_entry',
  SET_BIO = 'set_bio_entry',

  // account setting
  ACCOUNT_SETTING_ENTRY = 'account_setting_entry',
  BIOMETRIC_SWITCH_ENTRY = 'biometric_switch_entry',

  // tools and general settings
  SCAN_QR_CODE = 'scan_qr_code_entry',
  SCAN_LOG_IN = 'scan_log_in_entry',
  VIEW_ON_WEBVIEW = 'view_on_webview',

  // base assets service
  ASSETS_HOME_ENTRY = 'assets_home_entry',
  RECEIVE_TOKEN_ENTRY = 'receive_token_entry',

  // assets module ① : activity page
  ACTIVITY_LIST_ENTRY = 'activity_list_entry',
  ACTIVITY_DETAIL_ENTRY = 'activity_detail_entry',

  // assets module ② : token and nft details
  TOKEN_DETAIL_ENTRY = 'token_detail_entry',
  NFT_DETAIL_ENTRY = 'nft_detail_entry',

  // assets module ③ : add token
  TOKEN_MANAGE_LIST_ENTRY = 'token_manage_list_entry',
  TOKEN_MANAGE_ADD_ENTRY = 'token_manage_add_entry',

  // send token service
  SEND_TOKEN_HOME_ENTRY = 'send_token_home_entry',
  SEND_TOKEN_CONFIRM_ENTRY = 'send_token_confirm_entry',

  // payment security service
  PAYMENT_SECURITY_HOME_ENTRY = 'payment_security_home_entry',
  PAYMENT_SECURITY_DETAIL_ENTRY = 'payment_security_detail_entry',
  PAYMENT_SECURITY_EDIT_ENTRY = 'payment_security_edit_entry',

  // contact
  CONTACT_DETAIL_ENTRY = 'contact_detail_entry',
  CONTACT_ACTIVITY_ENTRY = 'contact_activity_entry',

  // ramp
  RAMP_HOME_ENTRY = 'ramp_home_entry',
  RAMP_PREVIEW_ENTRY = 'ramp_preview_entry',
}

export function isPortkeyEntries(variable: any): boolean {
  return Object.values(PortkeyEntries).includes(variable);
}
