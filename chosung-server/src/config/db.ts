import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const connectDB = async () => {
  console.log(" 서버 실행 위치:", process.cwd());
  console.log(
    "읽어온 URI:",
    process.env.MONGODB_URI ? "성공적으로 읽음" : "여전히 undefined",
  );

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI가 없습니다.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB 연결 성공!");
  } catch (err) {
    console.error("연결 에러:", err);
  }
};
