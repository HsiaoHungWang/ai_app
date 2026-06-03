import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";
const endpoint = process.env.ENDPOINT;
//https://s41-8151-resource.services.ai.azure.com/
const agentApiUrl = `${endpoint}api/projects/s41-8151`;

const agentName = "advisor-agent";

// 紀錄聊天者是誰，以及他們的聊天室 ID 是什麼
const sessionStore = new Map();


export async function handleAgentChat(sessionId, message) {
  const credential = new DefaultAzureCredential();
  const client = new AIProjectClient(agentApiUrl, credential);
  const openAIClient = client.getOpenAIClient();
  let conversationId;
  
  if (sessionStore.has(sessionId)) {
    conversationId = sessionStore.get(sessionId);
    console.log(`\n使用者 ${sessionId} 進入既有聊天室: ${conversationId}`);
  } else {
    const conversation = await openAIClient.conversations.create();
    conversationId = conversation.id;
    sessionStore.set(sessionId, conversationId);
    console.log(`\n幫使用者 ${sessionId} 建立雲端聊天室: ${conversationId}`);
  }

  //將問題傳送到聊天室
  await openAIClient.conversations.items.create(conversationId, {
    items: [{ type: "message", role: "user", content: message }],
  });

  //叫Agent回覆
  const response = await openAIClient.responses.create(
    { conversation: conversationId },
    { body: { agent_reference: { name: agentName, type: "agent_reference" } } }
  );

  //回覆的結果
  const aiReply = response.output_text;

  //當使用者輸入包含「再見」時
  if (message.trim().includes("再見")) {
    console.log(`\n使用者 ${sessionId} 說了再見。開始清除聊天室...`);
    
    // 清除聊天室
    await openAIClient.conversations.delete(conversationId);
    sessionStore.delete(sessionId);
    
    console.log(`聊天室 ${conversationId} 已刪除。`);
    
    return {
      status: "conversation_closed",
      agentReply: aiReply + "（提示：對話已結束，聊天室已銷毀）"
    };
  }

  //訊息回傳
  return {
    conversationId,
    status: "active",
    agentReply: aiReply
  };
}