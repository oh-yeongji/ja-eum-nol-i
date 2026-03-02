export const MAX_TIME_CHANGE_COUNT = 3;
export interface Room {
  status: "WAIT" | "READY_NOTICE" | "COUNTDOWN" | "PLAY" | "END";
  players: Map<string, Player>;
  chosungPair: [string, string];
  usedWords: Set<UsedWord>;
  readyNoticeTimer: NodeJS.Timeout | undefined;
  startTimer?: NodeJS.Timeout | undefined;
  gameDurationTimer?: NodeJS.Timeout | undefined;
  timeLimit: number;
  usedTimeChangeCount: number;
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
