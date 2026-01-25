import { extractTwoChosungs } from "./chosung";
import { Room } from "../types";
import { checkWordDetail } from "../lib/dict";

interface ValidateParams {
  chosungPair: [string, string];
  word: string;
  usedWords: Set<string>;
}

export async function validateWord({
  chosungPair,
  word,
  usedWords,
}: ValidateParams) {
  console.log(" NEW VALIDATEWORD CALLED!!!!!");
  const trimmed = word.trim();

  if (!trimmed || trimmed === "") {
    return {
      valid: false,
      reason: "단어를 입력하세요.",
    };
  }

  if (usedWords.has(trimmed)) {
    return {
      valid: false,
      reason: "이미 사용한 단어입니다.",
    };
  }
  //word는입력값 유저가 보낸 단어에서 초성을 추출
  const extracted = extractTwoChosungs(trimmed);

  if (!extracted) {
    return { valid: false, reason: "초성이 추출되지않음." };
  }

  if (extracted[0] !== chosungPair[0] || extracted[1] !== chosungPair[1]) {
    return { valid: false, reason: "입력한 단어와 초성이 일치하지않습니다." };
  }

  const dictResult = await checkWordDetail(trimmed);
  console.log("DICT RESULT RAW:", dictResult);
  const { exist, isNoun } = dictResult;
  console.log("exist:", exist, "isNoun:", isNoun);
  if (!exist) {
    return {
      valid: false,
      reason: "사전에 없는 단어입니다.",
    };
  }

  if (!isNoun) {
    return {
      valid: false,
      reason: "명사가 아닙니다.",
    };
  }


  return { valid: true, word: trimmed };
}
