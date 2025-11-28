import express from "express";
const router = express.Router();

router.get("/hello", (req, res) => {
  res.send("Hello from route!");
});

router.get("/api/dict", (req, res) => {
  const data = { firstCho: "ㄱ", secondCho: "ㅏ" };
  res.json(data);
});

export default router;
