import { Text, TextStyle, View, ViewStyle } from 'react-native';
import Touchable from 'components/Touchable';
import CommonAvatar from 'components/CommonAvatar';
import { pTd } from 'utils/unit';
import { LOCAL_AVATARS } from 'assets/image/avatars';
import { darkColors } from 'assets/theme';
import React, { ReactNode, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { getAddressCardStyles, getCardStyles, getStyles } from '../styles';
// import Svg from '../../../../components/Svg';
// import CommonTooltip from '../../../../components/CommonTooltip';
import { AddressCardHeader } from './AddressCardHeader';
import { changeCurrentWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
import OverlayModal from 'components/OverlayModal';
// import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LottieView } from 'components/LottieView';
import { useAddAddress, useEmptyAddress } from '../hooks/useAddAddress';

export interface IAddressCardProps {
  viewOnly?: boolean;
  addressSelecting?: boolean;
  cardTouchable?: boolean;
  addressManaging?: boolean;
  addressManageView?: boolean;
  currentWallet?: TWalletInfo;
  walletInfo?: TWalletInfo;
  removeWalletDisabled?: boolean;
  addressesTotalBalanceInUsd?: { [key: string]: number | string };
}

export interface IAddressCardPropsExtend extends IAddressCardProps {
  addAddressDisabled: boolean;
  accountState: string;
  addNewAddress: () => void;
}

export const TouchOrView = ({
  touchable = false,
  children,
  onPress,
  style,
  ...props
}: {
  children?: ReactNode;
  touchable?: boolean;
  onPress?: (() => void) | undefined;
  style?: ViewStyle & TextStyle;
}) => {
  if (touchable) {
    return (
      <Touchable onPress={onPress} style={style} {...props}>
        {children}
      </Touchable>
    );
  }
  return (
    <View {...props} style={style}>
      {children}
    </View>
  );
};

export const AddressCard = ({
  // viewOnly = false,
  addressSelecting = false,
  walletInfo,
  currentWallet,
  // cardTouchable = false,
  // addressManageView = false,
  addressManaging = false,
  removeWalletDisabled = false,
  addressesTotalBalanceInUsd,
}: IAddressCardProps) => {
  const useDynamicHook = addressSelecting ? useEmptyAddress : useAddAddress;
  const { addAddressDisabled, accountState, addNewAddress } = useDynamicHook({ walletInfo });

  if (addressManaging) {
    return (
      <AddressCardManaging
        walletInfo={walletInfo}
        currentWallet={currentWallet}
        removeWalletDisabled={removeWalletDisabled}
        addAddressDisabled={addAddressDisabled}
        accountState={accountState}
        addNewAddress={addNewAddress}
        addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
      />
    );
  }
  if (addressSelecting) {
    return (
      <AddressCardSelect
        walletInfo={walletInfo}
        currentWallet={currentWallet}
        addAddressDisabled={addAddressDisabled}
        accountState={accountState}
        addNewAddress={addNewAddress}
        addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
      />
    );
  }
  // addressManageView; default
  return (
    <AddressCardManageView
      walletInfo={walletInfo}
      currentWallet={currentWallet}
      addAddressDisabled={addAddressDisabled}
      accountState={accountState}
      addNewAddress={addNewAddress}
      addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
    />
  );
};

export const AddressCardManageView = ({
  walletInfo,
  currentWallet,
  addAddressDisabled,
  accountState,
  addNewAddress,
  addressesTotalBalanceInUsd,
}: IAddressCardPropsExtend) => {
  return (
    <AddressCardBase
      cardTouchable={true}
      addressManageView={true}
      walletInfo={walletInfo}
      currentWallet={currentWallet}
      addAddressDisabled={addAddressDisabled}
      accountState={accountState}
      addNewAddress={addNewAddress}
      addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
    />
  );
};

export const AddressCardManaging = ({
  walletInfo,
  currentWallet,
  removeWalletDisabled,
  addAddressDisabled,
  accountState,
  addNewAddress,
  addressesTotalBalanceInUsd,
}: IAddressCardPropsExtend) => {
  return (
    <AddressCardBase
      viewOnly={true}
      addressManaging={true}
      walletInfo={walletInfo}
      currentWallet={currentWallet}
      removeWalletDisabled={removeWalletDisabled}
      addAddressDisabled={addAddressDisabled}
      accountState={accountState}
      addNewAddress={addNewAddress}
      addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
    />
  );
};

export const AddressCardSelect = ({
  walletInfo,
  currentWallet,
  addAddressDisabled,
  accountState,
  addNewAddress,
  addressesTotalBalanceInUsd,
}: IAddressCardPropsExtend) => {
  return (
    <AddressCardBase
      viewOnly={true}
      addressSelecting={true}
      cardTouchable={true}
      walletInfo={walletInfo}
      currentWallet={currentWallet}
      addAddressDisabled={addAddressDisabled}
      accountState={accountState}
      addNewAddress={addNewAddress}
      addressesTotalBalanceInUsd={addressesTotalBalanceInUsd}
    />
  );
};

export const AddressCardBase = ({
  viewOnly = false,
  addressSelecting = false,
  cardTouchable = false,
  addressManaging = false,
  addressManageView = false,
  removeWalletDisabled = false,
  walletInfo,
  // currentWallet,
  addAddressDisabled,
  accountState,
  addNewAddress,
  addressesTotalBalanceInUsd = {},
}: IAddressCardPropsExtend) => {
  const styles = getStyles();
  const cardStyles = getCardStyles();
  const addressCardStyles = getAddressCardStyles();
  const dispatch = useAppCommonDispatch();
  const currentAccount = useCurrentAccount();
  // const isSelected = currentWallet?.key === walletInfo?.key;
  //
  // const useDynamicHook = addressSelecting ? useEmptyAddress : useAddAddress;
  // const { addAddressDisabled, accountState, addNewAddress } = useDynamicHook({ walletInfo });

  const cardOperation = useCallback(
    (account: TAccountInfo) => {
      if (addressManageView) {
        navigationService.push('AddressDetail', {
          currentWalletKey: walletInfo?.key,
          currentAddress: account.address,
        });
      }
      if (addressSelecting) {
        dispatch(
          changeCurrentWallet({
            address: account.address,
          }),
        );
        OverlayModal.hide();
      }
    },
    [addressManageView, addressSelecting, dispatch, walletInfo?.key],
  );

  return (
    <View style={cardStyles.cardContainer}>
      <AddressCardHeader
        privateKeyTipShow={addressManageView}
        useManageStyle={addressManaging}
        walletInfo={walletInfo}
        removeWalletDisabled={removeWalletDisabled}
      />
      <View alias-name="address-card">
        <View style={addressCardStyles.cardListContainer}>
          {walletInfo?.accountList.map((account: TAccountInfo, index: number) => {
            const isSelected = currentAccount?.address === account.address;
            const totalBalanceInUsd = addressesTotalBalanceInUsd[account.address];
            return (
              <View key={index}>
                <TouchOrView
                  touchable={cardTouchable}
                  onPress={() => cardOperation(account)}
                  style={addressCardStyles.cardContainer}>
                  <View style={addressCardStyles.card}>
                    <View style={addressCardStyles.info}>
                      <CommonAvatar
                        hasBorder={false}
                        style={addressCardStyles.avatarIcon}
                        localImage={LOCAL_AVATARS[account.icon || 'avatar_1']}
                        avatarSize={pTd(24)}
                        height={pTd(24)}
                        width={pTd(24)}
                      />
                      <View>
                        <Text style={addressCardStyles.title}>{account.name}</Text>
                        {/*<Text style={addressCardStyles.subtitle}>{account.totalBalance || '-'}</Text>*/}
                        <Text style={addressCardStyles.subtitle}>
                          {totalBalanceInUsd ? `$${totalBalanceInUsd}` : '-'}
                        </Text>
                      </View>
                    </View>
                    {/* TODO: addressManageView && notSelected */}
                    {addressManageView && !isSelected && (
                      <View>
                        <CommonAvatar
                          hasBorder={false}
                          style={styles.icon}
                          svgName="chevron_right"
                          avatarSize={pTd(12)}
                          height={pTd(12)}
                          width={pTd(12)}
                        />
                      </View>
                    )}
                    {(addressSelecting || addressManageView) && isSelected && (
                      <View>
                        <CommonAvatar
                          hasBorder={false}
                          style={styles.icon}
                          svgName="check-circle"
                          avatarSize={pTd(24)}
                          height={pTd(24)}
                          width={pTd(24)}
                          color={darkColors.textBase4}
                        />
                      </View>
                    )}
                  </View>
                </TouchOrView>
                <View style={addressCardStyles.divider} />
              </View>
            );
          })}
          {!viewOnly && walletInfo?.AESEncryptMnemonic && (
            <Touchable onPress={addNewAddress} alias-name="add-address" style={addressCardStyles.cardContainer}>
              <View style={[addressCardStyles.card, addressCardStyles.operationCard]}>
                <View style={addressCardStyles.info}>
                  {accountState === 'adding' ? (
                    <LottieView
                      source={require('assets/lottieFiles/loading.json')}
                      style={[addressCardStyles.loadingStyle, addressCardStyles.avatarIcon]}
                      autoPlay
                      loop
                    />
                  ) : (
                    <CommonAvatar
                      hasBorder={false}
                      style={addressCardStyles.avatarIcon}
                      // svgName={addressShowInfo.icon}
                      color={addAddressDisabled ? darkColors.textDisabled1 : ''}
                      svgName="add_v2"
                      avatarSize={pTd(24)}
                      height={pTd(24)}
                      width={pTd(24)}
                    />
                  )}
                  <View>
                    <Text
                      style={[
                        addressCardStyles.operationText,
                        addAddressDisabled ? addressCardStyles.operationTextDisabled : '',
                      ]}>
                      Add address
                    </Text>
                  </View>
                </View>
              </View>
            </Touchable>
          )}
        </View>
        {/*<TouchOrView*/}
        {/*  touchable={cardTouchable}*/}
        {/*  onPress={() => {*/}
        {/*    if (addressManageView) {*/}
        {/*      // TODO: WalletHome page need dev...*/}
        {/*      // TODO: not WalletHome, a new page address detail.*/}
        {/*      // logic like WalletHome/MyWallet/index.ts*/}
        {/*      // navigationService.push('WalletHome');*/}
        {/*    }*/}
        {/*    if (addressSelecting) {*/}
        {/*      // TODO: change current wallet*/}
        {/*      dispatch(*/}
        {/*        changeCurrentWallet({*/}
        {/*          address: 'P4qUg6dd9HYv9TGYuLDvh5u2rcLy9DNhxuWEXk7jCAepi2AXL',*/}
        {/*        }),*/}
        {/*      );*/}
        {/*    }*/}
        {/*    console.log('address-card');*/}
        {/*  }}*/}
        {/*  style={addressCardStyles.cardContainer}>*/}
        {/*  <View style={addressCardStyles.card}>*/}
        {/*    <View style={addressCardStyles.info}>*/}
        {/*      <CommonAvatar*/}
        {/*        hasBorder={false}*/}
        {/*        style={addressCardStyles.avatarIcon}*/}
        {/*        svgName="edit"*/}
        {/*        avatarSize={pTd(24)}*/}
        {/*        height={pTd(24)}*/}
        {/*        width={pTd(24)}*/}
        {/*      />*/}
        {/*      <View>*/}
        {/*        <Text style={addressCardStyles.title}>Address 1</Text>*/}
        {/*        <Text style={addressCardStyles.subtitle}>$56.78</Text>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*    {addressManageView && (*/}
        {/*      <View>*/}
        {/*        <CommonAvatar*/}
        {/*          hasBorder={false}*/}
        {/*          style={styles.icon}*/}
        {/*          svgName="chevron_right"*/}
        {/*          avatarSize={pTd(12)}*/}
        {/*          height={pTd(12)}*/}
        {/*          width={pTd(12)}*/}
        {/*        />*/}
        {/*      </View>*/}
        {/*    )}*/}
        {/*  </View>*/}
        {/*</TouchOrView>*/}
        {/*<View style={addressCardStyles.divider} />*/}

        {/*<TouchOrView*/}
        {/*  touchable={cardTouchable}*/}
        {/*  onPress={() => {*/}
        {/*    console.log('address-card');*/}
        {/*  }}*/}
        {/*  style={addressCardStyles.cardContainer}>*/}
        {/*  <View style={addressCardStyles.card}>*/}
        {/*    <View style={addressCardStyles.info}>*/}
        {/*      <CommonAvatar*/}
        {/*        hasBorder={false}*/}
        {/*        style={addressCardStyles.avatarIcon}*/}
        {/*        localImage={LOCAL_AVATARS.avatar_1}*/}
        {/*        avatarSize={pTd(24)}*/}
        {/*        height={pTd(24)}*/}
        {/*        width={pTd(24)}*/}
        {/*      />*/}
        {/*      <View>*/}
        {/*        <Text style={addressCardStyles.title}>Address 1 Touch Test</Text>*/}
        {/*        <Text style={addressCardStyles.subtitle}>$56.78</Text>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*    /!* TODO: addressManageView && notSelected *!/*/}
        {/*    /!*{addressManageView && (*!/*/}
        {/*    /!*  <View>*!/*/}
        {/*    /!*    <CommonAvatar*!/*/}
        {/*    /!*      hasBorder={false}*!/*/}
        {/*    /!*      style={styles.icon}*!/*/}
        {/*    /!*      svgName="chevron_right"*!/*/}
        {/*    /!*      avatarSize={pTd(12)}*!/*/}
        {/*    /!*      height={pTd(12)}*!/*/}
        {/*    /!*      width={pTd(12)}*!/*/}
        {/*    /!*    />*!/*/}
        {/*    /!*  </View>*!/*/}
        {/*    /!*)}*!/*/}
        {/*    {(addressSelecting || addressManageView) && (*/}
        {/*      <View>*/}
        {/*        <CommonAvatar*/}
        {/*          hasBorder={false}*/}
        {/*          style={styles.icon}*/}
        {/*          svgName="check-circle"*/}
        {/*          avatarSize={pTd(24)}*/}
        {/*          height={pTd(24)}*/}
        {/*          width={pTd(24)}*/}
        {/*          color={darkColors.textBase4}*/}
        {/*        />*/}
        {/*      </View>*/}
        {/*    )}*/}
        {/*  </View>*/}
        {/*</TouchOrView>*/}
        {/*<View style={addressCardStyles.divider} />*/}
      </View>
    </View>
  );
};
