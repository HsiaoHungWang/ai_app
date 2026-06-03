import "dotenv/config";
import OpenAI from "openai";
import { imageToBase64 } from "../utils/image.js";
const apiKey = process.env.API_KEY;
const endpoint = process.env.ENDPOINT;
const deploymentName = "gpt-4o";

export async function analyzeLandmark(filePath, mimeType) {
  const url = `${endpoint}/openai/v1/`;
  const openai = new OpenAI({
    baseURL: url,
    apiKey: apiKey,
  });
  console.log(`\n開始處理圖片: ${filePath}`);

  // 轉成 Base64 字串
  const imageBase64Str = await imageToBase64(filePath);

  // Data URI 格式供 AI 讀取
  const dataUri = `data:${mimeType};base64,${imageBase64Str}`;

  //把圖傳送給模型(gpt-4o)進行分析
  const completion = await openai.chat.completions.create({
    model: deploymentName,
    temperature: 0,
    response_format: { type: "json_object" }, // 強制要求回傳JSON格式
    messages: [
      {
        role: "system",
        content: `你是一個景點辨識專家。當使用者上傳照片時，請以繁體中文 JSON 格式回傳：
        {
        "landmark": "景點名稱",
        "city": "城市",
        "country": "國家",
        "description": "簡短介紹"
        }
        如果無法判斷，landmark 填 null，description 填觀察到的特徵。`,
      },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: dataUri } },
          { type: "text", text: "這是哪個景點？" },
        ],
      },
    ],
  });

  //讀取分析完的結果
  const rawContent = completion.choices[0].message.content;
  console.log(" [Service] 雲端原始回傳字串:", rawContent);

  // 解析成JSON物件後傳回給路由
  return JSON.parse(rawContent);
}
