import fs from 'fs/promises';

/**
 * 讀取圖片並轉為 Buffer (二進位)
 * @param {string} filePath - 檔案路徑
 * @returns {Promise<Buffer>}
 */
export async function imageToBuffer(filePath) {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    console.error("圖片轉二進位失敗:", error);
    throw error;
  }
}

/**
 * 讀取圖片並轉為 Base64 字串
 * @param {string} filePath - 檔案路徑
 * @returns {Promise<string>}
 */
export async function imageToBase64(filePath) {
  try {
    // 直接複用上面的 imageToBuffer 函式
    const buffer = await imageToBuffer(filePath);
    return buffer.toString("base64");
  } catch (error) {
    console.error("圖片轉 Base64 失敗:", error);
    throw error;
  }
}
