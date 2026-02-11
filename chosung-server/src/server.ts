import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import gameRouter from "./routes/game.routes";
import { getRandomChosungPair } from "./game/chosung";
import { validateWord } from "./game/gameService";
import type { Room, UsedWord, Player, PlayerSnapshot } from "./types";

const app = express();

//express cors
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chosung-game.vercel.app",
      "https://chosung-game.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", gameRouter);

const distPath = path.join(process.cwd(), "..", "chosung-client", "dist");
app.use(express.static(distPath));

const httpServer = createServer(app);

//socket cors
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chosung-game.vercel.app",
      "https://chosung-game.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
  transports: ["polling", "websocket"],
});

app.get(/.*/, (req, res) => {
  if (!req.path.startsWith("/api") && !req.path.startsWith("/socket.io")) {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        res.status(404).send("Front-end build not found.");
      }
    });
  }
});

/*==============================================================
        
         방 상태, 플레이어 설정

=======================================================*/

const rooms = new Map<string, Room>();

/*==========================================================================
        
         방 생성

============================================================================*/
const createRoom = (): { roomId: string; room: Room } => {
  const roomId = randomUUID();
  const room: Room = {
    status: "WAIT",
    players: new Map(),
    chosungPair: getRandomChosungPair(),
    usedWords: new Set<UsedWord>(),
    startTimer: undefined,
    gameDurationTimer: undefined,
    timeLimit: 60,
    endAt: undefined,
  };

  rooms.set(roomId, room);
  return { roomId, room };
};

/*===================================================================
        
       이 소켓이 속해있는 방을 찾는 함수

====================================================================*/

const getRoomBySocket = (socketId: string) => {
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.has(socketId)) {
      return { roomId, room };
    }
  }
  return null;
};

/*===================================================================
        
   게임시작하는 함수

====================================================================*/

const startGame = (roomId: string, room: Room) => {
  if (room.status === "PLAY") return;
  room.status = "PLAY";
  room.startTimer = undefined;

  room.chosungPair = getRandomChosungPair();

  room.usedWords = new Set();

  const limit = room.timeLimit || 60;
  const durationMs = limit * 1000;
  const endAt = Date.now() + durationMs;

  io.to(roomId).emit("game-start", {
    chosungPair: room.chosungPair,

    endAt,
  });

  room.gameDurationTimer = setTimeout(() => {
    if (room.status !== "PLAY") return;

    room.status = "END";

    room.gameDurationTimer = undefined;

    const finalScore = Array.from(room.players.values()).map((p) => ({
      nickname: p.nickname,

      score: p.score,

      socketId: p.socketId,

      isLeaver: false,
    }));

    io.to(roomId).emit("game-end", {
      words: Array.from(room.usedWords),

      scores: finalScore,
    });
  }, durationMs);
};
/* =============================================================================
   


        Socket.IO 적용



================================================================================ */

let tempNumber = 0;
io.on("connection", (socket: Socket) => {
  console.log(`[CONNECT] 신규 접속: ${socket.id}`);
  /* ---------- 방 참가 ---------- */
  socket.on("join-room", () => {
    console.log(`[JOIN-ROOM] 유저가 방 참가를 요청함: ${socket.id}`);
    const already = getRoomBySocket(socket.id);
    if (already) return;

    // 1. 들어갈 방(WAIT상태의 방) 있는지 확인
    // 키 값 한 쌍 => entry
    let entry = [...rooms.entries()].find(
      ([_, room]) => room.status === "WAIT" && room.players.size < 2,
    );

    let roomId: string;
    let room: Room;

    // 2. 들어갈방 없으면 새방 생성
    if (!entry) {
      const created = createRoom();

      roomId = created.roomId;
      room = created.room;
    } else {
      // 3. entry 구조분해
      [roomId, room] = entry;
    }

    // 4. 플레이어 추가
    tempNumber++;
    const tempNickname = `player${tempNumber}`;
    const firstPlayer = room.players.size === 0;

    room.players.set(socket.id, {
      socketId: socket.id,
      nickname: tempNickname,
      roomId, //지금구조에서 역추적 불가해서 여기 저장
      isOwner: firstPlayer,
      isReady: false,
      score: 0,
    });

    socket.join(roomId);

    const playerSnapshot: PlayerSnapshot[] = Array.from(
      room.players.values(),
    ).map((player) => {
      return {
        socketId: player.socketId,
        nickname: player.nickname,
        isOwner: player.isOwner,
        isReady: player.isReady,
        score: player.score,
      };
    });

    io.to(roomId).emit("room-updated", {
      players: playerSnapshot,
      status: room.status,
    });
    socket.emit("set-my-id", { you: socket.id, yourScore: 0 });
  });

  /*---------WaitingRoom 시간 설정 변경---------------*/
  socket.on("change-setting", ({ timeLimit }) => {
    const resultData = getRoomBySocket(socket.id);
    if (!resultData) return;
    const { room, roomId } = resultData;

    if (room.players.get(socket.id)?.isOwner) {
      room.timeLimit = timeLimit;
      io.to(roomId).emit("settings-updated", { timeLimit });
    }
  });

  /*---------WaitingRoom 준비/시작 버튼---------------*/

  socket.on("toggle-ready", () => {
    const resultData = getRoomBySocket(socket.id);
    if (!resultData) return;

    const { roomId, room } = resultData;
    const player = room.players.get(socket.id);
    if (!player) return;

    player.isReady = !player.isReady;

    const playerSnapshot: PlayerSnapshot[] = Array.from(
      room.players.values(),
    ).map((p) => ({
      socketId: p.socketId,
      nickname: p.nickname,
      isOwner: p.isOwner,
      isReady: p.isReady,
      score: p.score,
    }));

    io.to(roomId).emit("room-updated", { players: playerSnapshot });

    const players = Array.from(room.players.values());
    if (players.length < 2) return;

    const owner = players.find((p) => p.isOwner);
    const user = players.find((p) => !p.isOwner);

    if (owner?.isReady && user?.isReady) {
      if (room.startTimer) {
        clearTimeout(room.startTimer);
        room.startTimer = undefined;
      }
      startGame(roomId, room);
    } else if (owner?.isReady && !user?.isReady) {
      if (!room.startTimer) {
        room.status = "COUNTDOWN";
        io.to(roomId).emit("countdown-start", { seconds: 5 });
        room.startTimer = setTimeout(() => {
          startGame(roomId, room);
        }, 5000);
      }
    } else if (!owner?.isReady && room.startTimer) {
      clearTimeout(room.startTimer);
      room.startTimer = undefined;
      room.status = "WAIT";
      io.to(roomId).emit("room-wait", {
        message: "방장이 준비를 취소했습니다.",
      });
    }
  });

  /*---------초성 보내기---------------*/

  socket.on("submit-word", async (data: { word: string }) => {
    const word = data.word;
    const resultData = getRoomBySocket(socket.id);
    if (!resultData || resultData.room.status !== "PLAY") return;

    const { room, roomId } = resultData;
    const trimmed = word.trim();

    //2.validate
    const result = await validateWord({
      chosungPair: room.chosungPair,
      word: trimmed,
      usedWords: new Set(Array.from(room.usedWords).map((uw) => uw.word)),
    });

    if (result.valid) {
      room.usedWords.add({
        word: trimmed,
        senderId: socket.id,
        definitions: result.definitions || [],
      });

      const player = room.players.get(socket.id);
      if (player) {
        player.score += 10;
      }
    }

    io.to(roomId).emit("word-validated", {
      word,
      valid: result.valid,
      reason: result.reason,
      senderId: socket.id,
    });
  });

  /*=====================================================
        
       이탈, 연결끊김 시

=======================================================*/

  socket.on("disconnect", (reason) => {
    console.log(`[EXIT] 유저 퇴장함: ${socket.id}, 사유: ${reason}`);

    const resultData = getRoomBySocket(socket.id);
    if (!resultData) return;

    const { roomId, room } = resultData;
    const leaverId = socket.id;

    //카툰트다운중 이탈 -> 취소
    if (room.status === "COUNTDOWN" && room.startTimer) {
      clearTimeout(room.startTimer);
      room.startTimer = undefined;
      room.status = "WAIT";
      room.players.delete(leaverId);
      io.to(roomId).emit("room-wait", {});
    } else if (room.status === "PLAY") {
      /*--------게임중 이탈 -----------*/
      if (room.gameDurationTimer) clearTimeout(room.gameDurationTimer);
      room.status = "END";

      const finalScore = Array.from(room.players.values()).map((p) => {
        const isLeaver = p.socketId === leaverId;
        return {
          nickname: isLeaver ? `${p.nickname} (기권)` : p.nickname,
          score: p.score,
          socketId: p.socketId,
          isLeaver: isLeaver,
        };
      });

      io.to(roomId).emit("game-end", {
        words: Array.from(room.usedWords),
        scores: finalScore,
      });

      room.players.delete(leaverId);
    } else {
      room.players.delete(leaverId);
    }
    // 방이 비었으면 삭제
    if (room.players.size === 0) rooms.delete(roomId);
  });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
