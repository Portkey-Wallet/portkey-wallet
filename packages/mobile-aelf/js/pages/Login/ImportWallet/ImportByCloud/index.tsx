import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { useCardStyles, useWalletCommonStyles } from '../../styles';
import CommonAvatar from 'components/CommonAvatar';
import navigationService from 'utils/navigationService';
import Touchable from 'components/Touchable';
import fonts from 'assets/theme/fonts';
import { useCloudStorage } from '../../CloudBackup/useCloudStorage';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import dayjs from 'dayjs';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useMultiChainAddressesModal } from 'hooks/useMultiChainAddressesModal';

interface IAddressInfo {
  address: string;
  addressShow: string;
  info?: {
    updateTime: string;
    wallet: string;
  };
}

export default function ImportByCloud() {
  const styles = getStyles();
  const commonStyles = useWalletCommonStyles();
  const cardStyles = useCardStyles();

  const { handleListContents, readFile } = useCloudStorage();
  const { showMultiChainAddressesModal } = useMultiChainAddressesModal();

  const [addressesInfo, setAddressesInfo] = useState<IAddressInfo[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const { checkedSecurityLock } = useRouterParams<{
    checkedSecurityLock?: boolean;
  }>();

  useEffect(() => {
    const getAddressList = async () => {
      const addressList = await handleListContents();
      console.log('address list', addressList);
      if (addressList) {
        const _addressesInfo = addressList.map(item => {
          return {
            address: item,
            addressShow: formatStr2EllipsisStr(addressFormat(item), 8),
            // addressShow: addressFormat(item),
            info: {
              updateTime: '',
              wallet: '',
            },
          };
        });
        setAddressesInfo(_addressesInfo);
        setAddresses(addressList);
        // getAddressInfo(addressList, _addressesInfo);
      }
    };
    getAddressList();
  }, [handleListContents, readFile]);

  useEffect(() => {
    if (addresses.length === 0) {
      return;
    }
    const getAddressInfo = async (addressList: string[]) => {
      const promiseList = [];
      for (const address of addressList) {
        promiseList.push(readFile(address));
      }
      const _addressesInfo = JSON.parse(JSON.stringify(addressesInfo)) as IAddressInfo[];
      await Promise.all(promiseList).then(results => {
        results.forEach((result, index) => {
          const address = addressList[index];
          const _index = _addressesInfo.findIndex(item => item.address === address);
          if (result && _index >= 0) {
            console.log('addressInfo result ', result, _index);
            _addressesInfo[_index].info = JSON.parse(result);
          }
        });
      });
      setAddressesInfo(_addressesInfo);
    };
    getAddressInfo(addresses);
  }, [addresses, readFile]);

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={commonStyles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <Text style={commonStyles.title}>Choose backup</Text>
      <Text style={[commonStyles.desc, styles.marginBottom40]}>Select the backup you wish to import.</Text>

      {/*{loading ? <LottieLoading lottieWrapStyle={GStyles.marginTop(pTd(24))} /> : null}*/}
      {addressesInfo.map((item, index) => {
        return (
          <Touchable
            key={index}
            onPress={() => {
              if (!item.info?.wallet) {
                return;
              }
              navigationService.push('ImportByCloudDecrypt', {
                walletInCloud: item.info?.wallet,
                checkedSecurityLock,
              });
            }}>
            <View style={[cardStyles.card, styles.marginVertical16]}>
              <View style={cardStyles.textContainer}>
                <Touchable
                  style={styles.tagContainer}
                  onPress={() => {
                    showMultiChainAddressesModal({
                      address: item.address,
                    });
                  }}>
                  <Text style={styles.tagText}>Multichain</Text>
                  <CommonAvatar
                    hasBorder={false}
                    style={styles.tagIcon}
                    svgName="chevron_down"
                    avatarSize={pTd(14)}
                    height={pTd(14)}
                    width={pTd(14)}
                  />
                </Touchable>
                <Text style={styles.title}>{item.addressShow}</Text>
                <Text style={styles.subtitle}>
                  {item.info?.updateTime ? 'Added on ' + dayjs(item.info.updateTime).format('MMM DD, YYYY') : ' '}
                </Text>
              </View>
              <View style={styles.rightContainer}>
                <CommonAvatar
                  hasBorder={false}
                  style={styles.icon}
                  svgName="chevron_right"
                  avatarSize={pTd(16)}
                  height={pTd(16)}
                  width={pTd(16)}
                />
              </View>
            </View>
          </Touchable>
        );
      })}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  rightContainer: {
    justifyContent: 'center',
  },
  icon: {
    // marginRight: pTd(12),
    backgroundColor: 'transparent',
  },
  marginBottom40: {
    marginBottom: pTd(40),
  },
  marginVertical16: {
    marginVertical: pTd(8),
  },
  tagContainer: {
    flexDirection: 'row',
    borderColor: theme.colors.borderBase1,
    borderRadius: pTd(4),
    borderWidth: pTd(1),
    // paddingHorizontal: pTd(4),
    // paddingVertical: pTd(6),
    width: pTd(90),
    height: pTd(24),
    backgroundColor: theme.colors.bgBase1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  tagText: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(12),
    lineHeight: pTd(12) * 1.4,
    marginLeft: pTd(6),
    marginRight: pTd(4),
  },
  tagIcon: {
    marginRight: pTd(16),
    backgroundColor: 'transparent',
  },
  title: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    fontWeight: 'bold',
    lineHeight: pTd(16) * 1.4,
    marginTop: pTd(8),
  },
  subtitle: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginTop: pTd(12),
  },
}));
