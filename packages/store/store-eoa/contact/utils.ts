import { IContactIndexType, IContactItemType, IContactMapType } from '@portkey-wallet/types/types-eoa/contact';

type IContactIdMapNew = Record<string, IContactItemType>;

const CHAR_CODE_A = 'A'.charCodeAt(0);
const OTHER_INDEX = 26;

export const transIndexesToContactMap = (contactIndexList: IContactIndexType[]) => {
  const contactMap: IContactMapType = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contact => {
      const address = contact.addressInfo.address;
      if (contactMap[address]) {
        contactMap[address].push(contact);
      } else {
        contactMap[address] = [contact];
      }
    });
  });
  return contactMap;
};

export const transIndexesToContactIdMap = (contactIndexList: IContactIndexType[]) => {
  const contactIdMap: IContactMapType = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contact => {
      if (contactIdMap[contact.id]) contactIdMap[contact.id].push(contact);
      else contactIdMap[contact.id] = [contact];
    });
  });
  return contactIdMap;
};

const getIndexFromChar = (char: string) => {
  return char === '#' ? OTHER_INDEX : char.charCodeAt(0) - CHAR_CODE_A;
};

export const convertNameToAlphabet = (name: string): string => {
  if (!name || name.length === 0) {
    throw new Error('Input name cannot be empty.');
  }
  const firstChar = name.charAt(0).toUpperCase();

  if (firstChar >= 'A' && firstChar <= 'Z') {
    return firstChar;
  }

  return '&';
};

export const getInitContactIndexList = (): IContactIndexType[] => {
  // A~Z & #
  return new Array(27).fill('').map((_, i) => {
    const index = i === OTHER_INDEX ? '#' : String.fromCharCode(CHAR_CODE_A + i);
    return {
      index,
      contacts: [],
    };
  });
};

export const transContactsToIndexes = (contacts: IContactItemType[]) => {
  const contactIndexList: IContactIndexType[] = getInitContactIndexList();
  contacts.forEach(contact => {
    const idx = getIndexFromChar(contact.index);
    contactIndexList[idx].contacts.push(contact);
  });
  return contactIndexList;
};

export const sortContactIndexList = (contactIndexList: IContactIndexType[]) => {
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.sort((a, b) => a.name.localeCompare(b.name));
  });
  return contactIndexList;
};

export const getContactIdMap = (contactIndexList: IContactIndexType[]) => {
  const contactIdMap: IContactIdMapNew = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contactItem => {
      contactIdMap[contactItem.id] = contactItem;
    });
  });
  return contactIdMap;
};

const aggregateEvent = (_eventList: IContactItemType[]) => {
  const eventMap: Record<string, IContactItemType> = {};
  _eventList.forEach(event => {
    if (!eventMap[event.id]) {
      eventMap[event.id] = event;
    }
  });
  return Object.values(eventMap);
};

export const executeEventToContactIndexList = (
  contactIndexList: IContactIndexType[],
  eventList: IContactItemType[],
): IContactIndexType[] => {
  const contactIdMap = getContactIdMap(contactIndexList);
  eventList = aggregateEvent(eventList);
  eventList.forEach(event => {
    const contactIndex = contactIndexList[getIndexFromChar(event.index)];
    if (!contactIdMap[event.id]) {
      if (!event.isDeleted) {
        //ADD
        contactIdMap[event.id] = event;
        contactIndex.contacts.push(event);
      }
      return;
    }

    const contactItemIndex = contactIndex.contacts.findIndex(item => item.id === event.id);
    if (event.isDeleted) {
      // Delete
      delete contactIdMap[event.id];
      contactIndex.contacts.splice(contactItemIndex, 1);
      return;
    }

    // Edit
    const preContactItem = contactIdMap[event.id];

    if (preContactItem.index !== event.index) {
      // delete preContactItem & add event
      const preContactIndex = contactIndexList[getIndexFromChar(preContactItem.index)];
      const preContactItemIndex = preContactIndex.contacts.findIndex(item => item.id === preContactItem.id);
      preContactIndex.contacts.splice(preContactItemIndex, 1);
      contactIndex.contacts.push(event);
    } else {
      // replace contactItem
      contactIndex.contacts[contactItemIndex] = event;
    }
    contactIdMap[event.id] = event;
  });

  return contactIndexList;
};
