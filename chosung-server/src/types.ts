export interface Room {
  status: "WAIT" | "COUNTDOWN" | "PLAY" | "END";
  players: Map<string, Player>;
  chosungPair: [string, string];
  usedWords: Set<UsedWord>;
  startTimer?: NodeJS.Timeout | undefined;
  gameDurationTimer?: NodeJS.Timeout | undefined;
  timeLimit: number;
  endAt?: number;
}

export interface UsedWord {
  word: string;
  senderId: string;
  definitions: string[];
}

export interface Player {
  socketId: string;
  nickname: string;
  roomId: string;
  isOwner: boolean;
  isReady: boolean;
  score: number;
}

export type PlayerSnapshot = {
  socketId: string;
  nickname: string;
  isOwner: boolean;
  isReady: boolean;
  score: number;
};
