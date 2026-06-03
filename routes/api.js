// var express = require('express');
import express from "express";
import multer from "multer"; 

var router = express.Router();
const upload = multer({ dest: "uploads/" });
import { handleAgentChat } from "../services/chat.js";
import { analyzeLandmark } from "../services/landmark.js";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('AI');
});

router.post("/chat", async (req, res) => {
  //接收前端傳來的 sessionId 和 message
  const { sessionId, message } = req.body;

  
  if (!sessionId || !message) {
    return res.status(400).json({ error: "缺少必填欄位 sessionId 或 message" });
  }

  try {
    
    const result = await handleAgentChat(sessionId, message);
    
    return res.json({
      sessionId,
      ...result // 展開運算子：自動帶入 conversationId, status, agentReply
    });

  } catch (error) {
    console.error("API 錯誤:", error);
    return res.status(500).json({ 
      error: "Agent 連線失敗", 
      details: error.message 
    });
  }
});


router.post("/landmark",upload.single("imageFile"), async (req, res) => {
  const { imagePath } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "請上傳圖片檔案，欄位名稱必須是 imageFile" });
  }

  // req.file.path 就是該檔案在伺服器上的實際暫存路徑 (例如: uploads/a3b1c2...)
  const serverFilePath = req.file.path;
  const originalMimeType = req.file.mimetype;  

  try {
    // 呼叫服務層的 analyzeLandmark 函式，傳入圖片的伺服器路徑和 MIME 類型
    const landmarkData = await analyzeLandmark(serverFilePath, originalMimeType);

    return res.json({
      success: true,
      data: landmarkData
    });

  } catch (error) {
    console.error("💥 API 圖片辨識發生慘烈錯誤:", error);
    return res.status(500).json({
      error: "圖片辨識失敗",
      details: error.message
    });
  }
});

export default router;