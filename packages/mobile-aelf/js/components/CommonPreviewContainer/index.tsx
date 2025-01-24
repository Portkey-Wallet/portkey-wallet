import React, { useCallback } from 'react';
import { Text, View, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { openOutLink } from 'utils/link';
import { getStyles } from './style';
import { useTheme } from '@rneui/themed';
import { ViewStyleType } from 'types/styles';

interface ICommonPreviewContainerProps {
  footerStyle?: ViewStyleType;
  helpUrl?: string;
  poweredIcon?: React.ReactNode;
  buttonProps: Omit<CommonButtonProps, 'type' | 'loading'>;
  isLoading?: boolean;
  children: React.ReactNode;
}

const CommonPreviewContainer: React.FC<ICommonPreviewContainerProps> = ({
  footerStyle,
  helpUrl,
  poweredIcon,
  buttonProps,
  isLoading,
  children,
}) => {
  const styles = getStyles();
  const { theme } = useTheme();

  const handleButtonPress = useCallback(
    (event: GestureResponderEvent) => {
      if (isLoading) {
        return;
      }
      buttonProps.onPress?.(event);
    },
    [isLoading, buttonProps],
  );

  return (
    <PageContainer
      titleDom={'Preview'}
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      isLeftBackDisabled={isLoading}
      rightDom={
        <Touchable
          onPress={async () => {
            if (isLoading || !helpUrl) {
              return;
            }
            await openOutLink(helpUrl);
          }}>
          <Svg
            iconStyle={styles.headerHelpIcon}
            icon="help-white"
            color={isLoading ? theme.colors.iconDisabled : theme.colors.iconBase1}
            size={pTd(24)}
          />
        </Touchable>
      }
      scrollViewProps={{ disabled: true }}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback>
          <View>
            {children}
            {poweredIcon && (
              <View style={[styles.footerWrap, footerStyle]}>
                <Text style={styles.footerText}>Powered by</Text>
                {poweredIcon}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      <CommonButton {...buttonProps} type="primary" loading={isLoading} onPress={handleButtonPress} />
    </PageContainer>
  );
};

export default CommonPreviewContainer;
