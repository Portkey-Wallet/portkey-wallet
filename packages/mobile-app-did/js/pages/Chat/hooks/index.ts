import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useCallback } from 'react';
import { TextStyle } from 'react-native';

export const useParsePatterns = () => {
  const jump = useDiscoverJumpWithNetWork();

  return useCallback(
    (linkStyle: TextStyle) => [
      {
        pattern: /#(\w+)/,
        style: linkStyle,
        onPress: (tag: string) => console.log(`Pressed on hashtag: ${tag}`),
      },
      {
        pattern: /^https?:\/\/.+/,
        style: { color: 'red' },
        onPress: (tag: string) => {
          jump({
            item: {
              url: tag,
              name: tag,
            },
          });
        },
      },
    ],
    [jump],
  );
};
