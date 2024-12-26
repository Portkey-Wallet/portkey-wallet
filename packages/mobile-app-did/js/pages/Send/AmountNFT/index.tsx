import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useInputFocus } from 'hooks/useInputFocus';
import { IToSendAssetParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { parseInputNumberChange } from '@portkey-wallet/utils/input';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { FloatTip } from 'components/FloatTip';
import Svg from 'components/Svg';

interface AmountNFT {
  warningTip?: string;
  sendNumber: string;
  setSendNumber: any;
  assetInfo: IToSendAssetParamsType;
}

export default function AmountNFT(props: AmountNFT) {
  const { warningTip, sendNumber, setSendNumber, assetInfo } = props;
  const styles = getStyles();
  const iptRef = useRef<TextInput>(null);
  const [warningClick, setWarningClick] = useState(false);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const [wrapperLayoutProps, setWrapperLayoutProps] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  useInputFocus(iptRef);

  const onChangeText = useCallback(
    (value: string) => {
      setSendNumber(parseInputNumberChange(value, Infinity, Number(assetInfo?.decimals)));
    },
    [assetInfo?.decimals, setSendNumber],
  );
  const clickWarning = useCallback(() => {
    setWarningClick(true);
    warningRef.current = setTimeout(() => {
      setWarningClick(false);
      warningRef.current = null;
    }, 2000);
  }, []);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (wrapperLayoutProps.width === width && wrapperLayoutProps.height === height) {
        return;
      }
      setWrapperLayoutProps({ width, height });
    },
    [wrapperLayoutProps],
  );
  return (
    <View style={styles.wrap}>
      <TextInput
        autoFocus
        ref={iptRef}
        style={[styles.inputStyle, sendNumber === '0' && styles.placeholderTextColor]}
        keyboardType="numeric"
        maxLength={18}
        placeholder="0"
        placeholderTextColor={styles.placeholderTextColor.color}
        value={sendNumber}
        onChangeText={onChangeText}
      />
      {warningTip && (
        <TouchableOpacity
          onPress={clickWarning}
          onLayout={onLayout}
          disabled={warningClick}
          style={styles.warningIconWrap}>
          <FloatTip
            wrapperLayoutProps={wrapperLayoutProps}
            textStyle={{
              color: defaultColors.textBase2,
            }}
            containerStyle={styles.tipContainerStyle}
            content={warningTip}
            display={warningClick}
          />
          <Svg icon="warning" iconStyle={{ marginLeft: pTd(6) }} color={defaultColors.iconDanger1} size={pTd(24)} />
        </TouchableOpacity>
      )}
    </View>
  );
}
export const getStyles = makeStyles(theme => ({
  wrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(16),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    color: defaultColors.font3,
  },
  bottom: {
    marginTop: pTd(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomLeft: {
    minWidth: pTd(114),
    height: pTd(40),
    backgroundColor: defaultColors.bg4,
    borderRadius: pTd(6),
    ...GStyles.paddingArg(6, 10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolName: {
    flex: 1,
    textAlign: 'center',
  },
  bottomRight: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomColor: defaultColors.border6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerStyle: {
    width: '100%',
    minWidth: pTd(143),
    maxWidth: pTd(183),
    height: pTd(40),
    overflow: 'hidden',
  },
  iptWrap: {
    width: 'auto',
    marginTop: pTd(21),
    backgroundColor: 'blue',
    maxWidth: '80%',
    textAlign: 'right',
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  inputStyle: {
    width: 'auto',
    minHeight: pTd(38),
    textAlign: 'left',
    color: theme.colors.textBase1,
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
    maxWidth: '80%',
  },
  usdtNumSent: {
    position: 'absolute',
    right: 0,
    bottom: pTd(5),
    borderBottomColor: defaultColors.border6,
    color: defaultColors.font3,
  },
  placeholderTextColor: {
    color: theme.colors.textBase3,
  },
  warningIconWrap: {
    flexDirection: 'row',
  },
  tipContainerStyle: {
    width: pTd(189),
  },
}));
