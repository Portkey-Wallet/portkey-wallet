import ActionSheet from 'components/ActionSheet';

export const guardianSyncingAlert = () => {
  // TODO: change text
  ActionSheet.alert({
    title2: 'Syncing guardian info, which may take 1-2 minutes. Please try again later.',
    buttons: [{ title: 'OK' }],
  });
};
