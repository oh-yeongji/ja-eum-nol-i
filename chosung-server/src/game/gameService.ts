import { extractFirstTwoChosungs } from "./chosung";

export interface Room {
  chosungPair: [string, string];
}


export function validateWordByChosung(
  word: string,
  room: Room
): {
  valid: boolean;
  reason?: string;
} {
  const chosung = extractFirstTwoChosungs(word);



  if (!chosung) {
    return { valid: false, reason: "초성이 추출되지않음." };
  }

  if (
    chosung[0] !== room.chosungPair[0] ||
    chosung[1] !== room.chosungPair[1]
  ) {
    return {
      valid: false,
      reason: "입력한 단어와 초성이 일치하지않습니다.",
    };
  }
  return { valid: true };
}
