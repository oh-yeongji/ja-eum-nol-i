export type CheckWordResponse = {
  valid: boolean;
};

export const checkWord = async (word: string): Promise<CheckWordResponse> => {
  const res = await fetch(`/api/check-word?word=${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error("checkWord failed");
  return res.json();
};
