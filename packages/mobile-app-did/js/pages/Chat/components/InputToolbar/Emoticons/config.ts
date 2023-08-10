import emoticonData from './emoticonData.json';
export type EmojiItem = { name: string; code: string };
const emojiList: EmojiItem[] = [];
for (const key in emoticonData) {
  emojiList.push({ name: key, code: (emoticonData as { [key: string]: string })[key] });
}
export { emojiList };
