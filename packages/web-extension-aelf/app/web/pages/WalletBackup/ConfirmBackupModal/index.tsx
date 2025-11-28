import { useCallback } from 'react';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import CustomModal from 'pages/components/CustomModal';
import { Button, Alert } from 'antd';
import './index.less';

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ConfirmBackupModalContent: React.FC<{
  mnemonics: string[];
  onSuccess: () => void;
  destroy: () => void;
}> = ({ mnemonics, onSuccess, destroy }) => {
  const testedIndexes = useRef<number[]>([]);
  const checkedIndexes = useRef<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);

  // 生成当前题目的选项
  const showWords = useMemo(() => {
    if (!mnemonics.length) return [];
    const filteredWords = mnemonics.filter((_, idx) => idx !== currentIndex);
    const shuffledWords = shuffleArray(filteredWords).slice(0, 3);
    return shuffleArray([...shuffledWords, mnemonics[currentIndex]]);
  }, [mnemonics, currentIndex]);

  // 随机选择下一个索引
  const selectRandomIndex = useCallback((): number => {
    if (testedIndexes.current.length === mnemonics.length) {
      testedIndexes.current = checkedIndexes.current.slice();
    }
    const randomIndex = Math.floor(Math.random() * mnemonics.length);
    if (testedIndexes.current.includes(randomIndex)) {
      return selectRandomIndex();
    } else {
      return randomIndex;
    }
  }, [mnemonics.length]);

  // 选词逻辑
  const onPressWord = useCallback(
    (word: string) => {
      testedIndexes.current.push(currentIndex);
      if (word === mnemonics[currentIndex]) {
        checkedIndexes.current.push(currentIndex);
        if (checkedIndexes.current.length === 2) {
          destroy();
          onSuccess();
        } else {
          setCurrentIndex(selectRandomIndex());
          setShowError(false);
        }
      } else {
        setShowError(true);
        setTimeout(() => {
          setCurrentIndex(selectRandomIndex());
          setShowError(false);
        }, 1500);
      }
    },
    [currentIndex, mnemonics, selectRandomIndex, onSuccess, destroy],
  );

  // 初始化第一个索引
  useEffect(() => {
    if (mnemonics.length) setCurrentIndex(selectRandomIndex());
    // eslint-disable-next-line
  }, [mnemonics.length]);

  return (
    <div className="confirm-backup-modal-container">
      <div className="confirm-backup-modal-title">Verify seed phrase</div>
      <div className="confirm-backup-modal-desc">
        Verify your seed phrase by selecting the words in the correct order.
      </div>
      <div className="confirm-backup-modal-index-title"># {currentIndex + 1} word</div>
      <div className="confirm-backup-modal-index-desc">
        Please select the #{currentIndex + 1} word in your seed phrase.
      </div>
      <div className="confirm-backup-modal-words-wrap">
        {showWords.map((word, idx) => (
          <Button
            key={idx}
            className="confirm-backup-modal-word-btn"
            disabled={showError}
            onClick={() => onPressWord(word)}
            block>
            {word}
          </Button>
        ))}
      </div>
      {showError && <Alert className="confirm-backup-modal-error" message="Incorrect" type="error" showIcon />}
    </div>
  );
};

export const useConfirmBackupModal = () => {
  const showConfirmBackupModal = useCallback(
    ({ mnemonics, onSuccess }: { mnemonics: string[]; onSuccess: () => void }) => {
      const modal = CustomModal({
        type: 'info',
        className: 'confirm-backup-modal',
        icon: null,
        closable: true,
        maskClosable: true,
        content: (
          <ConfirmBackupModalContent mnemonics={mnemonics} onSuccess={onSuccess} destroy={() => modal.destroy()} />
        ),
        okButtonProps: { style: { display: 'none' } },
        onCancel: () => {
          modal.destroy();
        },
      });
    },
    [],
  );

  return { showConfirmBackupModal };
};
