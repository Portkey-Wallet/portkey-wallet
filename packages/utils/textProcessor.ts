type PatternItem = {
  pattern?: string | RegExp;
  message?: string;
  callBack?: (value: RegExpExecArray | null | string) => string;
};

type ReplaceItem = {
  from: string;
  to: string;
};

class TextProcessor {
  protected patternList: PatternItem[];
  protected replaceList: ReplaceItem[];
  constructor(patternList: PatternItem[], replaceList: ReplaceItem[]) {
    this.patternList = patternList;
    this.replaceList = replaceList;
  }
  format(value: string) {
    if (typeof value !== 'string') return;
    this.replaceList.forEach(({ from, to }) => {
      value = value.replace(from, to);
    });
    for (const element of this.patternList) {
      const { pattern, message, callBack } = element;
      if (!pattern) continue;
      if (typeof pattern === 'string') {
        if (pattern.trim() !== value?.trim()) continue;
        value = callBack ? callBack(value) : message || '';
        break;
      } else {
        const matches = pattern.exec(value);
        if (!matches) continue;
        const previousText = value.substring(matches.index, matches[0].length);
        value = value.replace(previousText, callBack ? callBack(matches) : message || '');
        break;
      }
    }
    return value;
  }
}

const replaceList: ReplaceItem[] = [
  { from: 'AElf.Sdk.CSharp.AssertionException: ', to: '' },
  {
    from: 'JudgementStrategy validate failed',
    to: 'The allowance should exceed the combined total of the transfer amount and transaction fee. Please set a higher value.',
  },
  {
    from: 'Processing on the chain...',
    to: 'This operation cannot be done before guardian info syncing is completed. Please try again later.',
  },
];

const patternList: PatternItem[] = [
  // {
  //   pattern: /\[TransferFrom\]Insufficient allowance\. Token: (\w+);\s*(\d+)\/(\d+)./,
  //   callBack: matches => {
  //     if (typeof matches !== 'string' && matches) {
  //       return `your ${matches[1]} allowance is ${matches[2]}, net limit is ${matches[3]}.`;
  //     }
  //     return '';
  //   },
  // },
];

export const textProcessor = new TextProcessor(patternList, replaceList);
