/**
 * 將信心度數值格式化為百分比字串
 * @param {number} confidence - 信心度數值 (0-1)
 * @returns {string} 格式化後的百分比字串，例如 "85.29%"，如果 confidence 為 null 或 undefined 則回傳 "無"
 */
export function formatConf(confidence) {
  return confidence != null
    ? `${(confidence * 100).toFixed(2)}%`
    : "無";
}