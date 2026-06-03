import "dotenv/config";

const endpoint   = process.env.ENDPOINT;
const apiKey     = process.env.API_KEY;
const Translator_API_VERSION = "2025-10-01-preview";
export async function translateText(txt, targetLanguage = "en") {
  const url = `${endpoint}/translator/text/translate?api-version=${Translator_API_VERSION}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            text: txt,
            targets: [{ language: targetLanguage }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`翻譯失敗 ${response.status}: ${error}`);
    }

    const result = await response.json();
    return result.value[0].translations[0].text;

  } catch (error) {
    console.error(`Translation failed: ${error.message}`);
    throw error;
  }
}


