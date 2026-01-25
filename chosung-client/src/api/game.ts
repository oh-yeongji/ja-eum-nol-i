export type CheckWordResponse = {
  valid: boolean;
  reason?: string;
};

export const checkWord = async (word: string): Promise<CheckWordResponse> => {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/check-word?word=${encodeURIComponent(word)}`
  );
  if (!res.ok) throw new Error("checkWord failed");
  return res.json();
};
