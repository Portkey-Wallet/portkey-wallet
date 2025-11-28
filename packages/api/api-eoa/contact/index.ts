import { BaseConfig } from '../../types';

const BASE_URL = `/api/app/contacts`;
const BASE_URL_V2 = `/api/app/address-book`;

const KeyList = [
  'addContact',
  'editContact',
  'deleteContact',
  'checkContactName',
  'readImputation',
  'contactPrivacyList',
  'updateContactPrivacy',
] as const;

const KeyListV2 = [
  'createSaved',
  'updateSaved',
  'deleteSaved',
  'checkSavedName',
  'getSavedList',
  'getSupportNetworkList',
] as const;

const ApiObject: Record<(typeof KeyList)[number], BaseConfig> = {
  addContact: {
    target: `${BASE_URL}`,
    config: { method: 'POST' },
  },
  editContact: {
    target: `${BASE_URL}`,
    config: { method: 'PUT' },
  },
  deleteContact: {
    target: `${BASE_URL}`,
    config: { method: 'DELETE' },
  },
  checkContactName: {
    target: `${BASE_URL}/exist`,
    config: { method: 'GET' },
  },
  readImputation: {
    target: `${BASE_URL}/read`,
    config: { method: 'POST' },
  },
  contactPrivacyList: {
    target: `/api/app/privacyPermission`,
    config: { method: 'GET' },
  },
  updateContactPrivacy: {
    target: `/api/app/privacyPermission`,
    config: { method: 'POST' },
  },
};
const ApiObjectV2: Record<(typeof KeyListV2)[number], BaseConfig> = {
  createSaved: {
    target: `${BASE_URL_V2}/create`,
    config: { method: 'POST' },
  },
  updateSaved: {
    target: `${BASE_URL_V2}/update`,
    config: { method: 'POST' },
  },
  deleteSaved: {
    target: `${BASE_URL_V2}/delete`,
    config: { method: 'POST' },
  },
  checkSavedName: {
    target: `${BASE_URL_V2}/exist`,
    config: { method: 'GET' },
  },
  getSavedList: {
    target: `${BASE_URL_V2}/read`,
    config: { method: 'GET' },
  },
  getSupportNetworkList: {
    target: `/api/app/proxy/api/app/address-book/network`,
    config: { method: 'GET' },
  },
};

export default Object.assign(ApiObject, ApiObjectV2);
