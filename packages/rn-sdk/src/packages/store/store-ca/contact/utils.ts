import { ContactIndexType, ContactItemType, ContactMapType } from 'packages/types/types-ca/contact';

type IContactIdMap = Record<string, ContactItemType>;
const CHAR_CODE_A = 'A'.charCodeAt(0);
const OTHER_INDEX = 26;

export const transIndexesToContactMap = (contactIndexList: ContactIndexType[]) => {
  const contactMap: ContactMapType = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contact => {
      const addressList = Array.from(new Set(contact.addresses.map(addressItem => addressItem.address)));
      addressList.forEach(address => {
        if (contactMap[address]) contactMap[address].push(contact);
        else contactMap[address] = [contact];
      });
    });
  });
  return contactMap;
};

export const transIndexesToContactRelationIdMap = (contactIndexList: ContactIndexType[]) => {
  const contactRelationIdMap: ContactMapType = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contact => {
      if (contact.imInfo?.relationId) {
        if (contactRelationIdMap[contact.imInfo?.relationId])
          contactRelationIdMap[contact.imInfo?.relationId].push(contact);
        else contactRelationIdMap[contact.imInfo?.relationId] = [contact];
      }
    });
  });
  return contactRelationIdMap;
};

export const transIndexesToContactIdMap = (contactIndexList: ContactIndexType[]) => {
  const contactIdMap: ContactMapType = {};
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

export const getInitContactIndexList = (): ContactIndexType[] => {
  // A~Z & #
  return new Array(27).fill('').map((_, i) => {
    const index = i === OTHER_INDEX ? '#' : String.fromCharCode(CHAR_CODE_A + i);
    return {
      index,
      contacts: [],
    };
  });
};

export const transContactsToIndexes = (contacts: ContactItemType[]) => {
  const contactIndexList: ContactIndexType[] = getInitContactIndexList();
  contacts.forEach(contact => {
    const idx = getIndexFromChar(contact.index);
    contactIndexList[idx].contacts.push(contact);
  });
  return contactIndexList;
};

export const sortContactIndexList = (contactIndexList: ContactIndexType[]) => {
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.sort((a, b) => a.name.localeCompare(b.name));
  });
  return contactIndexList;
};

export const getContactIdMap = (contactIndexList: ContactIndexType[]) => {
  const contactIdMap: IContactIdMap = {};
  contactIndexList.forEach(contactIndex => {
    contactIndex.contacts.forEach(contactItem => {
      contactIdMap[contactItem.id] = contactItem;
    });
  });
  return contactIdMap;
};

const aggregateEvent = (_eventList: ContactItemType[]) => {
  const eventMap: Record<string, ContactItemType> = {};
  _eventList.forEach(event => {
    if (!eventMap[event.id] || eventMap[event.id].modificationTime < event.modificationTime) {
      eventMap[event.id] = event;
    }
  });
  return Object.values(eventMap).sort((a, b) => a.modificationTime - b.modificationTime);
};

export const executeEventToContactIndexList = (
  contactIndexList: ContactIndexType[],
  eventList: ContactItemType[],
): ContactIndexType[] => {
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
    if (preContactItem.modificationTime > event.modificationTime) {
      console.log('expired event:', {
        event,
        contactIndex,
        contactItemIndex,
      });
      return;
    }

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
