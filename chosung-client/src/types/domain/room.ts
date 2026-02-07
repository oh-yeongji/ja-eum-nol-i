//클릭도 있고 5초뒤 카운트다운이니까 상태 고민
export type RoomStatus = "WAIT" | "READY" | "PLAY" | "END";

export interface PlayerSnapshot {
  socketId: string;
  nickname: string;
}

export interface GameEndData {
  words: { word: string; definitions: string[]; senderId: string }[];
  scores: {
    socketId: string;
    nickname: string;
    score: number;
    isLeaver?: boolean;
  }[];
}
