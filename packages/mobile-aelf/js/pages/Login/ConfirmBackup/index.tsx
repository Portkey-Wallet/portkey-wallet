import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { shuffleArray } from '@portkey-wallet/utils';
import { makeStyles, useTheme } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';

export default function ConfirmBackup() {
  const styles = getStyles();
  const { theme } = useTheme();

  const mnemonics = [
    'seed',
    'sock',
    'milk',
    'update',
    'focus',
    'rotate',
    'barely',
    'fade',
    'car',
    'face',
    'mechanic',
    'mercy',
  ];
  const testedIndexes = useRef<number[]>([]); // store the tested indexes, user selected the word, neither correct nor incorrect
  const checkedIndexes = useRef<number[]>([]); // store the checked indexes, user selected the correct word
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const showWords = useMemo(() => {
    const filteredWords = mnemonics.filter((_, index) => index !== currentIndex);
    const shuffledWords = shuffleArray(filteredWords).slice(0, 3);
    return shuffleArray(shuffledWords.concat(mnemonics[currentIndex]));
  }, [currentIndex]);

  const selectRandomIndex = useCallback(() => {
    if (testedIndexes.current.length === mnemonics.length) {
      testedIndexes.current = checkedIndexes.current;
    }
    const randomIndex = Math.floor(Math.random() * mnemonics.length);
    if (testedIndexes.current.includes(randomIndex)) {
      return selectRandomIndex();
    } else {
      return randomIndex;
    }
  }, [testedIndexes, checkedIndexes]);

  const onPressWord = useCallback((word: string) => {
    const index = mnemonics.indexOf(word);
    testedIndexes.current.push(currentIndex);
    if (index === currentIndex) {
      // selected the correct word
      checkedIndexes.current.push(currentIndex);
      console.log('checkedIndexes : ', checkedIndexes.current);
      if (checkedIndexes.current.length === 2) {
        // all words are selected, go to next page
        // todo_wade: go to next page
      } else {
        setCurrentIndex(selectRandomIndex());
        setShowError(false);
      }
    } else {
      // selected the incorrect word
      setShowError(true);
      setTimeout(() => {
        setCurrentIndex(selectRandomIndex());
        setShowError(false);
      }, 2000);
    }
  }, [testedIndexes, currentIndex, checkedIndexes, selectRandomIndex, showError]);

  useEffect(() => {
    setCurrentIndex(selectRandomIndex());
  }, [selectRandomIndex]);

  return (
    <PageContainer
      titleDom
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <Text style={styles.title}>Confirm Backup</Text>
      <Text style={styles.desc}>Complete this quicktestto confirm you've saved everything correctly.</Text>
      <Text style={styles.indexTitle}>{`# ${currentIndex + 1} word`}</Text>
      <Text style={styles.indexDesc}>{`Please select the #${
        currentIndex + 1
      } Word in your Secret Recovery Phrase.`}</Text>
      <View style={styles.wordsWrap}>
        {showWords.map((word, index) => {
          return (
            <Touchable
              style={[styles.wordButton, index > 0 && styles.wordButtonMarginTop]}
              disabled={showError}
              onPress={() => onPressWord(word)}>
              <Text style={styles.wordText}>{word}</Text>
            </Touchable>
          );
        })}
      </View>
      {showError && (
        <View style={styles.errorWrap}>
          <Svg icon="error" color={theme.colors.iconDanger3} size={pTd(20)} />
          <Text style={styles.errorText}>Incorrect</Text>
        </View>
      )}
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
  },
  title: {
    marginTop: pTd(24),
    fontSize: pTd(32),
    ...fonts.BGMediumFont,
  },
  desc: {
    color: theme.colors.textBase2,
    marginTop: pTd(16),
    fontSize: pTd(14),
  },
  indexTitle: {
    marginTop: pTd(48),
    fontSize: pTd(20),
    ...fonts.BGMediumFont,
  },
  indexDesc: {
    color: theme.colors.textBase2,
    marginTop: pTd(8),
    fontSize: pTd(14),
  },
  wordsWrap: {
    marginTop: pTd(24),
  },
  wordButton: {
    width: '100%',
    height: pTd(48),
    borderRadius: pTd(24),
    backgroundColor: theme.colors.bgBase2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordButtonMarginTop: {
    marginTop: pTd(12),
  },
  wordText: {
    fontSize: pTd(16),
    ...fonts.BGMediumFont,
  },
  errorWrap: {
    marginTop: pTd(12),
    width: '100%',
    height: pTd(48),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: pTd(8),
    fontSize: pTd(16),
    color: theme.colors.textDanger1,
  },
}));
