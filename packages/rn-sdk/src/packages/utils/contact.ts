type AddressListItem = {
  name: string;
  address: string;
  [key: string]: any;
};

export const filterAddressList = (list: AddressListItem[], keyword: string): AddressListItem[] => {
  const result = list.filter(contact => {
    if (contact?.name) {
      return (
        contact.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        contact.address.toLowerCase().includes(keyword.trim().toLowerCase())
      );
    } else {
      return contact.address.toLowerCase().includes(keyword.trim().toLowerCase());
    }
  });

  return result || [];
};
