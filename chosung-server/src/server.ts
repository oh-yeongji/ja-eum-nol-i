import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";
import gameRouter from "./routes/game.routes";
import { getRandomChosungPair } from "./game/chosung";
import { validateWord } from "./game/gameService";
import type { Room, Player } from "./types";

const app = express();

//express cors
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chosung-client.vercel.app"],
  }),
);
app.use(express.json());

app.use("/api", gameRouter);

const httpServer = createServer(app);

//socket cors
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://chosung-client.vercel.app"],
    methods: ["GET", "POST"],
  },
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
    usedWords: new Set(),
    countdownTimer: undefined,
    gameTimer: undefined,
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

/* =============================================================================
   


        Socket.IO 적용



================================================================================ */
io.on("connection", (socket: Socket) => {
  console.log("🟢 socket connected:", socket.id);
  /* ---------- 방 참가 ---------- */
  socket.on("join-room", ({ nickname }: { nickname: string }) => {
    console.log("join-room 이벤트 들어옴:", nickname);
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
    room.players.set(socket.id, {
      socketId: socket.id,
      nickname,
      roomId, //지금구조에서 역추적 불가해서 여기 저장
    });

    socket.join(roomId);
    console.log(`플레이어 ${nickname} 입장 - roomId: ${roomId}`);
    console.log(`플레이어 ${nickname}입장 - roomId:${roomId}`);

    // 5. 인원 다 차면 COUNTDOWN
    if (room.players.size === 2) {
      room.status = "COUNTDOWN";
      io.to(roomId).emit("countdown-start", { seconds: 5 });

      room.countdownTimer = setTimeout(() => {
        room.status = "PLAY";
        room.countdownTimer = undefined;

        room.chosungPair = getRandomChosungPair();

        /////// timer

        const durationMs = 60000;
        const endAt = Date.now() + durationMs;

        io.to(roomId).emit("game-start", {
          chosungPair: room.chosungPair,
          endAt,
        });

        room.gameTimer = setTimeout(() => {
          if (room.status !== "PLAY") return;

          room.status = "END";
          room.gameTimer = undefined;

          /*--------게임종료-----------*/
          io.to(roomId).emit("game-end", {
            words: Array.from(room.usedWords),
          });
        }, durationMs);
      }, 5000);
    }
  });

  /*---------초성 보내기---------------*/

  socket.on("submit-word", async ({ word }) => {
    console.log("📩 submit-word", {
      socketId: socket.id,
      word,
    });
    const resultData = getRoomBySocket(socket.id);
    if (!resultData) {
      console.log(" room 못 찾음");
      return;
    }

    const { room, roomId } = resultData;
    console.log("room.status:", room.status);
    if (room.status !== "PLAY") {
      return;
    }
    console.log("chosungPair (server):", room.chosungPair);
    console.log("submitted word:", word);

    //2.validate
    const result = await validateWord({
      chosungPair: room.chosungPair,
      word,
      usedWords: room.usedWords,
    });

    console.log("typeof result:", typeof result);
    console.log("isPromise:", result instanceof Promise);

    if (result.valid) {
      const trimmed = word.trim();
      room.usedWords.add(trimmed);
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

  socket.on("disconnect", () => {
    const resultData = getRoomBySocket(socket.id);
    if (!resultData) return;

    const { roomId, room } = resultData;
    room.players.delete(socket.id);

    //카툰트다운중 이탈 -> 취소
    if (room.status === "COUNTDOWN" && room.countdownTimer) {
      clearTimeout(room.countdownTimer);
      room.countdownTimer = undefined;
      room.status = "WAIT";
      io.to(roomId).emit("room-wait");
    }

    // 방이 비었으면 삭제
    if (room.players.size === 0) {
      rooms.delete(roomId);
    }
  });
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
