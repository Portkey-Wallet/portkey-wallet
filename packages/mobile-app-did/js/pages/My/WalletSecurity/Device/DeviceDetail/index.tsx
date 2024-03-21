import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from '../components/DeviceItem';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ApprovalType } from '@portkey-wallet/types/verifier';
import { TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';

interface RouterParams {
  deviceItem?: DeviceItemType;
}

const DeviceDetail: React.FC = () => {
  const { deviceItem } = useRouterParams<RouterParams>();
  const walletInfo = useCurrentWalletInfo();
  const isCurrent = useMemo(
    () => deviceItem && walletInfo.address === deviceItem.managerAddress,
    [deviceItem, walletInfo.address],
  );

  return (
    <PageContainer
      titleDom={'Devices Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View>
        {deviceItem && <DeviceItem deviceItem={deviceItem} isCurrent={isCurrent} isShowArrow={false} />}
        {!isCurrent && (
          <TextM style={[FontStyles.font3, pageStyles.tipsWrap]}>
            {`Your account is logged in on this device and you can remove it to revoke its access to your account.
Please note that after removing this device, you will need to verify your identity through your guardians when you log in again.`}
          </TextM>
        )}
      </View>
      {!isCurrent && (
        <CommonButton
          type="clear"
          titleStyle={pageStyles.deleteBtnTitle}
          onPress={() => {
            if (!deviceItem?.managerAddress) return;
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.removeOtherManager,
              removeManagerAddress: deviceItem?.managerAddress,
            });
          }}>
          Remove Device
        </CommonButton>
      )}
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
  },
  deleteBtnTitle: {
    color: defaultColors.font12,
  },
});

export default DeviceDetail;
