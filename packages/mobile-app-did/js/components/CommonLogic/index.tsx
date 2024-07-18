import { useAppCommonDispatch, useEffectOnce } from '@portkey-wallet/hooks';
import { useActivityModalConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { parseLink } from '@portkey-wallet/hooks/hooks-ca/cms/util';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { setActivityModalCurrentTimeShowed, setActivityModalShowed } from '@portkey-wallet/store/store-ca/cms/actions';
import { ActivityModalConfig, TimingType } from '@portkey-wallet/types/types-ca/cms';
import { useRoute } from '@react-navigation/native';
import ActionSheet from 'components/ActionSheet';
import { ButtonRowProps } from 'components/ButtonRow';
import useJump from 'hooks/useJump';
import { memo, useCallback } from 'react';

const CommonLogic = (props: { timingTypeArray: TimingType[] }) => {
  const { timingTypeArray } = props;
  const { name } = useRoute();
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const jump = useJump();
  const getModalConfig = useActivityModalConfig();
  const showModal = useCallback(
    async (configItem: ActivityModalConfig): Promise<boolean> => {
      return new Promise(resolve => {
        if (configItem.showed) {
          resolve(true);
        } else {
          const buttons: ButtonRowProps['buttons'] = [];
          if (configItem.positiveTitle) {
            buttons.push({
              title: configItem.positiveTitle,
              onPress: () => {
                const link = parseLink(configItem.positiveAction, '');
                console.log('link', link);
                if (link.location) {
                  jump(link);
                }
              },
            });
          }
          if (configItem.negtiveTitle) {
            buttons.push({
              title: configItem.negtiveTitle,
            });
          }
          const onDismiss = () => {
            resolve(true);
          };
          ActionSheet.alert({
            isCloseShow: configItem.showClose,
            bgImage: configItem.headerImg ? { uri: configItem.headerImg } : undefined,
            title: configItem.title,
            message: configItem.description,
            buttons,
            onDismiss,
          });
          if (configItem.timingType !== TimingType.AppOpen) {
            dispatch(
              setActivityModalShowed({
                network: networkType,
                id: configItem.id || 0,
              }),
            );
          }
          dispatch(
            setActivityModalCurrentTimeShowed({
              network: networkType,
              id: configItem.id || 0,
            }),
          );
        }
      });
    },
    [dispatch, jump, networkType],
  );
  const renderActivityModal = useCallback(
    (config: ActivityModalConfig[], index: number) => {
      if (index >= config.length) {
        return;
      }
      showModal(config[index]).then(value => {
        if (value) {
          renderActivityModal(config, index + 1);
        }
      });
    },
    [showModal],
  );
  useEffectOnce(() => {
    getModalConfig(timingTypeArray, name, config => {
      renderActivityModal(config, 0);
    });
  });
  return null;
};
export default memo(CommonLogic, () => true);
