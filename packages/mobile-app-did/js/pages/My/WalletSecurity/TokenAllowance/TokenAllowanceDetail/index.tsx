import React from 'react';
import { View } from 'react-native';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import TokenAllowanceItem from '../components/TokenAllowanceItem';
import { TextM, TextS } from 'components/CommonText';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import Touchable from 'components/Touchable';
import { copyText } from 'utils';
import CommonSwitch from 'components/CommonSwitch';
import MenuItem from 'pages/My/components/MenuItem';
import { showApproveModal } from 'dapp/components/ApproveOverlay';
import OverlayModal from 'components/OverlayModal';

const TokenAllowanceDetail: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PageContainer
      leftCallback={() => navigationService.navigate('Tab')}
      titleDom={t('Details')}
      safeAreaColor={['blue', 'white']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TokenAllowanceItem type="detail" />
      <View style={pageStyles.contractAddressWrap}>
        <TextM style={FontStyles.font16}>Contract Address</TextM>
        <View style={GStyles.flex1} />
        <TextM style={[GStyles.marginRight(pTd(8)), FontStyles.font3]}>
          {formatStr2EllipsisStr('contract address', 8)}
        </TextM>
        <Touchable onPress={() => copyText('copyBtnWrap')}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>

      <View style={pageStyles.approvalWrap}>
        <View style={pageStyles.approvalLeft}>
          <TextM style={FontStyles.font16}>Approve multiple tokens</TextM>
          <View style={GStyles.width(pTd(2))} />
          <TextS style={FontStyles.font3}>Skip guardians approve after enabled enough amount</TextS>
        </View>
        <Touchable
          style={pageStyles.approvalRight}
          onPress={() => {
            console.log('Touchable');
          }}>
          <View pointerEvents="none">
            <CommonSwitch value={true} />
          </View>
        </Touchable>
      </View>

      <MenuItem
        title="Approve Amount"
        suffix={1000}
        onPress={() => {
          showApproveModal({
            isEditBatchApprovalInApp: true,
            dappInfo: {
              origin: '',
              name: undefined,
              icon: undefined,
              svgIcon: undefined,
              sessionInfo: undefined,
              connectedTime: undefined,
            },
            approveParams: {
              approveInfo: {
                symbol: '',
                amount: '',
                spender: '',
                decimals: 0,
                targetChainId: 'AELF',
                alias: undefined,
              },
              eventName: '',
              isDiscover: undefined,
            },
            onReject: () => {
              OverlayModal.hide();
            },
          });
        }}
      />
    </PageContainer>
  );
};

export default TokenAllowanceDetail;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  contactListStyle: {
    backgroundColor: defaultColors.bg1,
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
  contractAddressWrap: {
    borderRadius: pTd(6),
    paddingHorizontal: pTd(16),
    paddingVertical: pTd(18),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  approvalWrap: {
    marginBottom: pTd(24),
    borderRadius: pTd(6),
    padding: pTd(16),
    backgroundColor: defaultColors.bg1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  approvalLeft: {
    flex: 1,
    paddingRight: pTd(8),
  },
  approvalRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
