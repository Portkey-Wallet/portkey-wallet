import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import CommonHeader from 'components/CommonHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocationState, useNavigateState } from 'hooks/router';
import { FreeMintStepEnum, NOTICE, freeMintTip } from './constants';
import BaseDrawer from 'components/BaseDrawer';
import BaseModal from 'components/BaseModal';
import CommonCloseHeader from 'components/CommonCloseHeader';
import {
  useFreeMintInfo,
  useConfirmMint,
  useLoopMintStatus,
  useGetMintItemInfo,
} from '@portkey-wallet/hooks/hooks-ca/freeMint';
import { useEffectOnce } from '@portkey-wallet/hooks';
import CustomSvg from 'components/CustomSvg';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useSetUserAvatar } from '@portkey-wallet/hooks/hooks-ca/wallet';
import Edit from './component/Edit';
import Preview from './component/Preview';
import Result from './component/Result';
import { FreeMintStatus, ICollectionData, IMintNFTItemInfo } from '@portkey-wallet/types/types-ca/freeMint';
import { TFreeMintLocationState } from 'types/router';
import './index.less';

export default function FreeMint() {
  const navigate = useNavigateState();
  const { state } = useLocationState<TFreeMintLocationState | undefined>();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const [open, setOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState('');
  const [newAvatarS3File, setNewAvatarS3File] = useState('');
  const [step, setStep] = useState<FreeMintStepEnum>(FreeMintStepEnum.edit);
  const [status, setStatus] = useState<FreeMintStatus>(FreeMintStatus.NONE);
  const fetchMintInfo = useFreeMintInfo();
  const { confirm: confirmMint } = useConfirmMint();
  const loopStatus = useLoopMintStatus();
  const getMintItemInfo = useGetMintItemInfo();
  const [mintInfo, setMintInfo] = useState<ICollectionData | undefined>(undefined);
  const [nftName, setNftName] = useState<string>('');
  const [desc, setDesc] = useState('');
  const setUserAvatar = useSetUserAvatar();
  const targetNftItemRef = useRef<IMintNFTItemInfo | undefined>();

  useEffectOnce(() => {
    (async () => {
      const res = await fetchMintInfo();
      setMintInfo(res);
      if (state?.itemId) {
        try {
          const targetNftItem: IMintNFTItemInfo = await getMintItemInfo(state.itemId);
          setNewAvatarS3File(targetNftItem.imageUrl);
          setNftName(targetNftItem.name);
          setDesc(targetNftItem.description);
          setPreviewFile(targetNftItem.imageUrl);
          if (targetNftItem.status === FreeMintStatus.SUCCESS) {
            setOpen(true);
            setStep(FreeMintStepEnum.result);
            setStatus(FreeMintStatus.SUCCESS);
            return;
          }
          if (targetNftItem.status === FreeMintStatus.PENDING) {
            setOpen(true);
            setStep(FreeMintStepEnum.result);
            setStatus(FreeMintStatus.PENDING);
            try {
              const _status: FreeMintStatus = await loopStatus(state.itemId);
              setStatus(_status);
            } catch (error) {
              setStatus(FreeMintStatus.FAIL);
            }
            return;
          }
          if (targetNftItem.status === FreeMintStatus.FAIL) {
            setOpen(true);
            setStep(FreeMintStepEnum.edit);
            setStatus(FreeMintStatus.NONE);
            return;
          }
        } catch (error) {
          console.log('===getTargetMintItem error', error);
          singleMessage.error(handleErrorMessage(error) ?? 'getTargetMintItem error');
        }
      }
    })();
  });

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setPreviewFile('');
    setNftName('');
    setDesc('');
    setStep(FreeMintStepEnum.edit);
    setStatus(FreeMintStatus.NONE);
    setNewAvatarS3File('');
    targetNftItemRef.current = undefined;
  }, []);

  const modalTitle = useMemo(() => {
    if (step === FreeMintStepEnum.edit) {
      return 'Mint NFT';
    }
    if (step === FreeMintStepEnum.preview) {
      return 'Confirm Mint';
    }
    return '';
  }, [step]);
  const handleSetAvatar = useCallback(async () => {
    try {
      if (!newAvatarS3File) return;
      await setUserAvatar(newAvatarS3File);
      singleMessage.success('Set Avatar Success');
      handleCloseModal();
    } catch (error) {
      console.log('===handleSetAvatar error', error);
      singleMessage.error('Set Avatar Failed');
    }
  }, [handleCloseModal, newAvatarS3File, setUserAvatar]);
  const handleMintConfirm = useCallback(async () => {
    try {
      setStep(FreeMintStepEnum.result);
      setStatus(FreeMintStatus.PENDING);
      const params = {
        imageUrl: newAvatarS3File,
        name: nftName.trim(),
        tokenId: targetNftItemRef.current ? targetNftItemRef.current.tokenId : `${mintInfo?.tokenId}`,
        description: desc?.trim(),
      };
      const confirmMintRes = await confirmMint(params);
      const _status: FreeMintStatus = await loopStatus(confirmMintRes);
      setStatus(_status);
    } catch (error) {
      console.log('===handleMintConfirm error', error);
      setStatus(FreeMintStatus.FAIL);
    }
  }, [confirmMint, desc, loopStatus, mintInfo?.tokenId, newAvatarS3File, nftName]);

  const renderModalContent = useCallback(() => {
    if (step === FreeMintStepEnum.edit) {
      const props = {
        getPreviewFile: setPreviewFile,
        setNewAvatarS3File,
        previewFile,
        nftName,
        onNftNameChange: setNftName,
        desc,
        onDescChange: setDesc,
        btnDisabled: !(nftName.trim() && newAvatarS3File),
        onClickNext: () => {
          setStep(FreeMintStepEnum.preview);
        },
      };
      return <Edit {...props} />;
    }
    if (step === FreeMintStepEnum.preview) {
      const props = {
        previewFile,
        nftName: nftName.trim(),
        desc: desc?.trim(),
        mintInfo,
        onClickCancel: handleCloseModal,
        onClickMint: handleMintConfirm,
      };
      return <Preview {...props} />;
    }
    if (step === FreeMintStepEnum.result) {
      const props = {
        previewFile,
        status,
        onClickClose: () => navigate('/'),
        onSetAvatar: handleSetAvatar,
        onClickViewInWallet: () => navigate('/'),
        onClickTryAgain: () => {
          setStep(FreeMintStepEnum.edit);
          setStatus(FreeMintStatus.NONE);
        },
      };
      return <Result {...props} />;
    }
    return null;
  }, [
    step,
    nftName,
    newAvatarS3File,
    previewFile,
    desc,
    mintInfo,
    handleCloseModal,
    handleMintConfirm,
    status,
    handleSetAvatar,
    navigate,
  ]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['free-mint-page flex-column', isPrompt && 'detail-page-prompt'])}>
        <CommonHeader onLeftBack={() => navigate('/')} />
        <div className="free-mint-body flex-column-center">
          <div className="free-mint-title">NFT Free Mint</div>
          <div className="free-mint-logo">
            <CustomSvg type="FreeMintLogo" />
          </div>
          <div className="free-mint-btn flex-center">
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}>
              Get Started
            </Button>
          </div>
          <div className="free-mint-tip flex-column">
            {freeMintTip.map((item, index) => (
              <div key={index} className="flex free-mint-tip-item">
                <div className="tip-item-number flex-center">{index + 1}</div>
                <div>
                  <div className="tip-item-title">{item.title}</div>
                  <div className="tip-item-content">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex free-mint-notice">
            <CustomSvg type="InfoOutlined" />
            <div>{NOTICE}</div>
          </div>
        </div>
      </div>
    );
  }, [isPrompt, navigate]);

  const handleCloseModalOrDrawer = useCallback(() => {
    if (status === FreeMintStatus.PENDING || status === FreeMintStatus.FAIL) {
      navigate('/');
    } else {
      handleCloseModal();
    }
  }, [handleCloseModal, navigate, status]);

  return (
    <>
      {isPrompt ? <PromptFrame content={mainContent()} className="free-mint-prompt" /> : mainContent()}
      {isNotLessThan768 ? (
        <BaseModal
          open={open}
          destroyOnClose
          footer={false}
          centered
          closable={false}
          className="free-mint-modal"
          maskClosable>
          <CommonCloseHeader title={modalTitle} onClose={handleCloseModalOrDrawer} />
          {renderModalContent()}
        </BaseModal>
      ) : (
        <BaseDrawer
          open={open}
          destroyOnClose
          className="common-drawer free-mint-drawer"
          height="580"
          maskClosable
          placement="bottom">
          <CommonCloseHeader title={modalTitle} onClose={handleCloseModalOrDrawer} />
          {renderModalContent()}
        </BaseDrawer>
      )}
    </>
  );
}
