import React, { useCallback, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, Text } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import Svg, { IconName } from 'components/Svg';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import { TextTitle } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import { makeStyles } from '@rneui/themed';
import CheckBox from 'components/CheckBox';
import { useCheckSecurityLock } from 'hooks/securityLock';
import navigationService from 'utils/navigationService';
import { TWalletInfo, TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

const getNotes = (
  type: IModalType,
): {
  icon: IconName;
  text: string;
}[] => {
  return [
    {
      icon: 'recovery phrase',
      text: `Your ${type} is essential for wallet recovery.`,
    },
    {
      icon: 'disabled_visible',
      text: `Losing your ${type} could mean losing access to your wallet and assets.`,
    },
    {
      icon: 'visibility_lock',
      text: `DO NOT share your ${type} with anyone, as this could result in wallet and asset loss.`,
    },
  ];
};

type IModalType = 'seed phrase' | 'private key';
interface ISelectModalProps {
  type: IModalType;
  walletToBeBackup: TWalletInfo;
  accountToBeBackup: TAccountInfo;
}

const SelectModal = ({ type = 'private key', walletToBeBackup, accountToBeBackup }: ISelectModalProps) => {
  const styles = getStyles();
  const checkSecurityLock = useCheckSecurityLock();

  const [isChecked, setIsChecked] = useState(false);
  const onClickCheckBox = useCallback(() => {
    setIsChecked(!isChecked);
  }, [isChecked]);

  return (
    <ModalBody
      modalBodyType="bottom"
      leftTitleDom={
        <Svg iconStyle={styles.marginHorizontal} size={pTd(32)} icon="error" color={defaultColors.iconBase1} />
      }>
      <KeyboardSafeArea containerStyle={styles.container}>
        <TextTitle>Show {type}</TextTitle>

        <View style={styles.noteCardsContainer}>
          {getNotes(type).map((note, index) => {
            return (
              <View key={index} style={styles.noteCard}>
                <View style={styles.iconContainer}>
                  <Svg size={pTd(20)} icon={note.icon} color={defaultColors.iconDanger2} />
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.understandContainer}>
          <View>
            <CheckBox checked={isChecked} onChange={() => onClickCheckBox()} boxStyle={styles.checkBox} />
          </View>
          <Text style={styles.understandText}>
            I will never share my private key with anyone, including the aelf wallet team.
          </Text>
        </View>

        <View>
          <CommonButton
            style={{
              marginTop: pTd(24),
              marginBottom: pTd(16),
            }}
            disabled={!isChecked}
            title={'Continue'}
            type="primary"
            onPress={() => {
              OverlayModal.hide();
              if (type === 'private key') {
                console.log(2222);
                checkSecurityLock(() => {
                  navigationService.push('AddressBackup', {
                    walletToBeBackup,
                    accountToBeBackup,
                    backupType: 'Private key',
                  });
                });
              } else {
                checkSecurityLock(() => {
                  navigationService.push('AddressBackup', {
                    walletToBeBackup,
                    accountToBeBackup,
                    backupType: 'Seed phrase',
                  });
                });
                console.log(1111);
              }
            }}
          />
        </View>
      </KeyboardSafeArea>
    </ModalBody>
  );
};

export const showModal = (props: ISelectModalProps) => {
  OverlayModal.show(<SelectModal {...props} />, {
    position: 'bottom',
  });
};

export const getStyles = makeStyles(theme => ({
  marginHorizontal: {
    marginHorizontal: pTd(16),
  },
  container: {
    marginHorizontal: pTd(16),
    flexDirection: 'column',
  },
  noteCardsContainer: {
    marginVertical: pTd(16),
    flexDirection: 'column',
  },
  noteCard: {
    flexDirection: 'row',
    marginVertical: pTd(8),
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  noteText: {
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    flex: 1,
  },
  iconContainer: {
    borderRadius: pTd(999),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: pTd(40),
    width: pTd(40),
    marginRight: pTd(16),
    backgroundColor: theme.colors.bgDanger2,
  },
  understandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    backgroundColor: theme.colors.bgBase1, // #8B64E7
    marginRight: pTd(12),
  },
  understandText: {
    flex: 1,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
  },
}));
