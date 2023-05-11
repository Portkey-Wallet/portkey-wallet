import { BaseConfig } from '../../types';

const BASE_URL = `/api/app/contacts`;
const KeyList = ['addContact', 'editContact', 'deleteContact', 'checkContactName'] as const;

const ApiObject: Record<typeof KeyList[number], BaseConfig> = {
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
};

export default ApiObject;
