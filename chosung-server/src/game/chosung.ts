const HANGLE_START = 0xac00;
const HANGLE_END = 0xd7a3;

const CHOSUNG_LIST = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const BLACKLIST = new Set([
  "ㄹㄷ",
  "ㄹㅋ",
  "ㄹㅌ",
  "ㄹㅍ",
  "ㄹㅎ",
  "ㄹㅊ",
  "ㄴㄹ",
  "ㄷㄹ",
  "ㅂㄹ",
  "ㄷㅋ",
  "ㅈㅋ",
  "ㅇㅋ",
  "ㅁㅋ",
  "ㅂㅋ",
  "ㅎㅋ",
  "ㅁㅌ",
  "ㅂㅌ",
  "ㅈㅌ",
  "ㅎㅌ",
  "ㅇㅍ",
  "ㅎㅍ",
  "ㅊㅍ",
  "ㅁㅍ",
  "ㄴㅎ",
  "ㄹㅎ",
  "ㅁㅎ",
  "ㅂㅎ",
]);
export function getRandomChosungPair(): [string, string] {
  let first: string;
  let second: string;
  let pair: string;

  do {
    first = CHOSUNG_LIST[Math.floor(Math.random() * CHOSUNG_LIST.length)];
    second = CHOSUNG_LIST[Math.floor(Math.random() * CHOSUNG_LIST.length)];
    pair = first + second;
  } while (BLACKLIST.has(pair) || first === second);
  return [first, second];
}

const ALL_CHOSUNG = [
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

export function extractTwoChosungs(word: string): [string, string] | null {
  const result: string[] = [];

  for (const char of word) {
    const code = char.charCodeAt(0);
    if (code < HANGLE_START || code > HANGLE_END) continue;

    const index = Math.floor((code - HANGLE_START) / 588);
    result.push(ALL_CHOSUNG[index]);

    if (result.length === 2) break;
  }
  return result.length === 2 ? [result[0], result[1]] : null;
}
