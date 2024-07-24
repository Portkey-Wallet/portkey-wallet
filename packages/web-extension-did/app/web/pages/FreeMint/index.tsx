import { Button } from 'antd';
import PromptFrame from 'pages/components/PromptFrame';
import CommonHeader from 'components/CommonHeader';
import { useCommonState } from 'store/Provider/hooks';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
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
import { useNFTItemDetail } from '@portkey-wallet/hooks/hooks-ca/assets';
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
  const [tokenId, setTokenId] = useState<string>('');
  const [itemId, setItemId] = useState(state?.itemId);
  const [symbol, setSymbol] = useState('');
  const fetchNFTItemDetail = useNFTItemDetail();

  const updateMintInfo = useCallback(async () => {
    const res = await fetchMintInfo();
    setMintInfo(res);
  }, [fetchMintInfo]);

  useEffectOnce(() => {
    (async () => {
      updateMintInfo();
      if (state?.itemId) {
        try {
          const targetNftItem: IMintNFTItemInfo = await getMintItemInfo(state.itemId);
          setNewAvatarS3File(targetNftItem.imageUrl);
          setNftName(targetNftItem.name);
          setDesc(targetNftItem.description);
          setPreviewFile(targetNftItem.imageUrl);
          setTokenId(targetNftItem.tokenId);
          setSymbol(targetNftItem.symbol);
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
    updateMintInfo();
    setOpen(false);
    setPreviewFile('');
    setNftName('');
    setDesc('');
    setStep(FreeMintStepEnum.edit);
    setStatus(FreeMintStatus.NONE);
    setNewAvatarS3File('');
    setTokenId('');
    setItemId('');
    setSymbol('');
  }, [updateMintInfo]);

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
        name: nftName?.trim(),
        description: desc?.trim(),
        itemId: itemId,
      };
      const confirmMintRes = await confirmMint(params);
      setTokenId(confirmMintRes.tokenId);
      setSymbol(confirmMintRes.symbol);
      updateMintInfo();
      const _status: FreeMintStatus = await loopStatus(confirmMintRes.itemId);
      setStatus(_status);
      if (_status === FreeMintStatus.SUCCESS) {
        setItemId('');
      }
    } catch (error) {
      console.log('===handleMintConfirm error', error);
      setStatus(FreeMintStatus.FAIL);
    }
  }, [confirmMint, desc, itemId, loopStatus, newAvatarS3File, nftName, updateMintInfo]);
  const goToNFTDetail = useCallback(async () => {
    try {
      const detail = await fetchNFTItemDetail({ symbol, chainId: mintInfo?.collectionInfo.chainId ?? 'AELF' });
      navigate('/nft', {
        state: {
          ...detail,
          collectionName: mintInfo?.collectionInfo.collectionName,
          collectionImageUrl: mintInfo?.collectionInfo.imageUrl,
        },
      });
    } catch (error) {
      console.log('===goToNFTDetail error', error);
      singleMessage.error(handleErrorMessage(error) ?? 'get NFT detail error, try again');
    }
  }, [fetchNFTItemDetail, mintInfo, navigate, symbol]);
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
        tokenId,
        nftName,
        onClickClose: () => navigate('/'),
        onSetAvatar: handleSetAvatar,
        onClickViewInWallet: goToNFTDetail,
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
    previewFile,
    nftName,
    desc,
    newAvatarS3File,
    mintInfo,
    handleCloseModal,
    handleMintConfirm,
    status,
    tokenId,
    handleSetAvatar,
    goToNFTDetail,
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
                if (mintInfo?.isLimitExceed) {
                  singleMessage.error(
                    `You have reached the daily limit of ${mintInfo?.limitCount} free mint NFTs. Take a rest and come back tomorrow!`,
                  );
                  return;
                } else {
                  setOpen(true);
                }
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
  }, [isPrompt, mintInfo?.isLimitExceed, mintInfo?.limitCount, navigate]);

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
