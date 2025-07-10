import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { Button, Alert } from 'antd';
// import { CommonButton } from '@portkey/did-ui-react';
import './ConfirmBackup.less';

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ConfirmBackup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mnemonics: string[] = location.state?.mnemonics || [];
  // const mnemonics: string[] = 'seed sock milk update focus rotate barely fade car face mechanic mercy'.split(' ');

  // 记录已测试和已通过的索引
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
          navigate('/wallet-backup/manualbackup/success');
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
    [currentIndex, mnemonics, selectRandomIndex, navigate],
  );

  // 初始化第一个索引
  useEffect(() => {
    if (mnemonics.length) setCurrentIndex(selectRandomIndex());
    // eslint-disable-next-line
  }, [mnemonics.length]);

  return (
    <div className="manual-backup-confirm-container">
      <div className="manual-backup-confirm-title">Verify seed phrase</div>
      <div className="manual-backup-confirm-desc">
        Verify your seed phrase by selecting the words in the correct order.
      </div>
      <div className="manual-backup-confirm-index-title"># {currentIndex + 1} word</div>
      <div className="manual-backup-confirm-index-desc">
        Please select the #{currentIndex + 1} word in your seed phrase.
      </div>
      <div className="manual-backup-confirm-words-wrap">
        {showWords.map((word, idx) => (
          <Button
            key={idx}
            className="manual-backup-confirm-word-btn"
            disabled={showError}
            onClick={() => onPressWord(word)}
            block>
            {word}
          </Button>
        ))}
      </div>
      {showError && <Alert className="manual-backup-confirm-error" message="Incorrect" type="error" showIcon />}
    </div>
  );
};
