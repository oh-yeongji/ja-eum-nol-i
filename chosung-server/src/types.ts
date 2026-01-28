export interface Room {
  status: "WAIT" | "COUNTDOWN" | "PLAY" | "END";
  players: Map<string, Player>;
  chosungPair: [string, string];
  usedWords: Set<string>;
  countdownTimer?: NodeJS.Timeout| undefined;
  gameTimer?: NodeJS.Timeout| undefined;
  endAt?: number;
}

export interface Player {
  socketId: string;
  nickname: string;
  roomId: string;
}

//gameService
export interface Room {
  chosungPair: [string, string];
  usedWords: Set<string>;
}
