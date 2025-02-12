import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { useCardStyles, useWalletCommonStyles } from '../styles';
import CommonAvatar from 'components/CommonAvatar';
import { IconName } from 'components/Svg';
import iCloudImage from 'assets/image/pngs/iCloud.png';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useCloudStorage } from '../CloudBackup/useCloudStorage';
import CommonToast from 'components/CommonToast';

interface IListItem {
  isAndroid?: boolean;
  isIOS?: boolean;
  svgName?: IconName;
  importType?: string;
  localImage?: number;
  title: string;
  subTitle: string;
}
const ListItem: IListItem[] = [
  {
    isAndroid: true,
    svgName: 'google-drive',
    title: 'Google Drive',
    importType: 'google',
    subTitle: 'Import your seed phrase from Google Drive.',
  },
  {
    isIOS: true,
    localImage: iCloudImage,
    title: 'iCloud',
    importType: 'iCloud',
    subTitle: 'Import your seed phrase from iCloud.',
  },
  {
    svgName: 'recovery phrase',
    title: 'Seed phrase',
    importType: 'seedPhrase',
    subTitle: 'Enter your seed phrase manually',
  },
  {
    svgName: 'private key',
    title: 'Private key',
    importType: 'privateKey',
    subTitle: 'Enter your private key manually',
  },
];

export default function WalletImportTypeSelect() {
  const styles = getStyles();
  const commonStyles = useWalletCommonStyles();
  const cardStyles = useCardStyles();
  const { needCheckSecurityLock } = useRouterParams<{
    needCheckSecurityLock?: boolean;
  }>();
  const checkSecurityLock = useCheckSecurityLock();
  const { cloudAvailable } = useCloudStorage();

  const importWalletPress = useCallback(
    (item: IListItem) => {
      if (!item.importType) {
        return;
      }
      if (item.isAndroid || item.isIOS) {
        if (!cloudAvailable) {
          CommonToast.fail('Cloud is not available');
          return;
        }
        navigationService.push('ImportByCloud', {
          importType: item.importType,
          checkedSecurityLock: needCheckSecurityLock,
        });
      } else {
        navigationService.push('ImportWallet', {
          importType: item.importType,
          checkedSecurityLock: needCheckSecurityLock,
        });
      }
    },
    [cloudAvailable, needCheckSecurityLock],
  );

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={commonStyles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <Text style={commonStyles.title}>Import your wallet</Text>
      <Text style={[commonStyles.desc, styles.marginBottom40]}>Choose your preferred method</Text>

      {ListItem.map((item, index) => {
        if (item.isIOS && !isIOS) {
          return null;
        }
        if (item.isAndroid && isIOS) {
          return null;
        }
        return (
          <Touchable
            key={index}
            onPress={async () => {
              if (needCheckSecurityLock) {
                await checkSecurityLock(() => {
                  importWalletPress(item);
                });
                return;
              }
              importWalletPress(item);
            }}>
            <View style={[cardStyles.card, styles.marginVertical16]}>
              {/* TODO: iCloud, google drive loading */}
              <CommonAvatar
                hasBorder={false}
                style={styles.icon}
                svgName={item.svgName || undefined}
                localImage={item.localImage || undefined}
                avatarSize={pTd(24)}
                height={pTd(24)}
                width={pTd(24)}
              />
              <View style={cardStyles.textContainer}>
                <Text style={cardStyles.title}>{item.title}</Text>
                <Text style={cardStyles.subtitle}>{item.subTitle}</Text>
              </View>
            </View>
          </Touchable>
        );
      })}
    </PageContainer>
  );
}

const getStyles = makeStyles(() => ({
  icon: {
    marginRight: pTd(12),
    backgroundColor: 'transparent',
  },
  marginBottom40: {
    marginBottom: pTd(40),
  },
  marginVertical16: {
    marginVertical: pTd(8),
  },
}));
