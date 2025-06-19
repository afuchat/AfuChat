import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAIResponse(message: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: "You are AfuAI, an intelligent assistant integrated into AfuChat, a social media platform. You help users with content creation, analysis, coding, creative brainstorming, and various tasks. Be helpful, friendly, and concise in your responses. Keep responses engaging and relevant to social media and content creation when appropriate."
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: "user" as const,
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response. Please check your API key and try again.");
  }
}

export async function generateContentSuggestions(topic: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media content assistant. Generate 5 engaging post ideas for the given topic. Return them as a JSON array of strings. Each suggestion should be a complete post idea, not just a title."
        },
        {
          role: "user",
          content: `Generate 5 social media post ideas about: ${topic}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("OpenAI content suggestions error:", error);
    throw new Error("Failed to generate content suggestions.");
  }
}

export async function improvePost(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media writing assistant. Improve the given post to make it more engaging, clear, and shareable while maintaining the original message and tone. Keep it concise and within social media character limits."
        },
        {
          role: "user",
          content: `Improve this social media post: "${content}"`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error("OpenAI post improvement error:", error);
    throw new Error("Failed to improve post.");
  }
}