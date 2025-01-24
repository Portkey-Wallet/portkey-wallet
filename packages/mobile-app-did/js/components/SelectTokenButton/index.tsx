import React, { memo } from 'react';
import { Text, View } from 'react-native';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import { getButtonStyles } from './style';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { TCurrency } from '@portkey-wallet/types/awaken';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';

interface ISelectTokenButtonProps {
  token?: TCurrency;
  onShowCryptoAssetList: () => void;
}

const SelectTokenButton: React.FC<ISelectTokenButtonProps> = ({ token, onShowCryptoAssetList }) => {
  const styles = getButtonStyles();

  return (
    <Touchable style={styles.selectTokenButton} onPress={() => onShowCryptoAssetList()}>
      <View style={styles.iconWrap}>
        <CommonAvatar style={styles.tokenIcon} title={token?.symbol} avatarSize={pTd(25)} imageUrl={token?.imageUrl} />
        <CommonAvatar
          hasBorder
          style={styles.chainIcon}
          title={token?.displayChainName}
          avatarSize={pTd(16)}
          imageUrl={token?.chainImageUrl}
        />
      </View>
      <Text style={styles.symbolText}>{formatNameWithNoUnderline(token?.label || token?.symbol || '')}</Text>
      <Svg icon={'down-arrow'} size={pTd(16)} />
    </Touchable>
  );
};

export default memo(SelectTokenButton);
