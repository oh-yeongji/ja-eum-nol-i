import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

/*==============================================================
        
         방 상태, 플레이어 설정

=======================================================*/
type RoomStatus = "WAIT" | "COUNTDOWN" | "PLAY";

interface Player {
  socketId: string;
  userId: string;
  nickname: string;
  roomId: string;
}

interface Room {
  status: RoomStatus;
  players: Map<string, Player>;
  countdownTimer?: NodeJS.Timeout;
}

const rooms = new Map<string, Room>();

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

/*==========================================================================
        
         방 생성

============================================================================*/
const createRoom = (roomId: string): Room => {
  const room: Room = {
    status: "WAIT",
    players: new Map(),
  };
  rooms.set(roomId, room);
  return room;
};

/* =============================================================================
   


        Socket.IO 적용



================================================================================ */
io.on("connection", (socket: Socket) => {
  /* ---------- 방 참가 ---------- */
  socket.on("join-room", ({ userId, nickname }) => {
    // 1. 들어갈 방(WAIT상태의 방) 있는지 확인
    //키 값 한 쌍 => entry
    let entry = [...rooms.entries()].find(
      ([_, room]) => room.status === "WAIT" && room.players.size < 2
    );

    let roomId: string;
    let room: Room;

    // 2. 들어갈방 없으면 새방 생성
    if (!entry) {
      roomId = randomUUID();
      room = createRoom(roomId);
    } else {
      // 3. entry 구조분해
      [roomId, room] = entry;
    }

    // 4. 플레이어 추가
    room.players.set(socket.id, {
      socketId: socket.id,
      userId,
      nickname,
      roomId, //지금구조에서 역추적 불가해서 여기 저장
    });
    socket.join(roomId);
    console.log(
      `socketId=${socket.id} roomId=${roomId},players=${room.players.size},status=${room.status}`
    );

    // 5. 인원 다 차면 COUNTDOWN
    if (room.players.size === 2) {
      room.status = "COUNTDOWN";
      io.to(roomId).emit("countdown-start", { seconds: 3 });

      room.countdownTimer = setTimeout(() => {
        room.status = "PLAY";
        room.countdownTimer = undefined;
        io.to(roomId).emit("game-start");
      }, 3000);
    }
  });

  /*=====================================================
        
       이탈, 연결끊김 시

=======================================================*/

  socket.on("disconnect", () => {
    const result = getRoomBySocket(socket.id);
    if (!result) return;

    const { roomId, room } = result;
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

httpServer.listen(3000, () => {
  console.log("제대로 접속");
});
