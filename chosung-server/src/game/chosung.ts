const HANGLE_START = 0xac00;
const HANGLE_END = 0xd7a3;

export const CHOSUNG_LIST = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

export const GAME_CHOSUNG_LIST = CHOSUNG_LIST.filter(
  (c) => !["ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"].includes(c)
);

export function getRandomChosungPair(): [string, string] {
  const first =  GAME_CHOSUNG_LIST[Math.floor(Math.random() *  GAME_CHOSUNG_LIST.length)];
  const second =  GAME_CHOSUNG_LIST[Math.floor(Math.random() *  GAME_CHOSUNG_LIST.length)];
  return [first, second];
}

export function extractTwoChosungs(word: string): [string, string] | null {
  const result: string[] = [];

  for (const char of word) {
    const code = char.charCodeAt(0);
    if (code < HANGLE_START || code > HANGLE_END) continue;

    const index = Math.floor((code - HANGLE_START) / 588);
    result.push(CHOSUNG_LIST[index]);

    if (result.length === 2) break;
  }
  return result.length === 2 ? [result[0], result[1]] : null;
}
