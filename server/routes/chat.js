const express = require("express");
const { AzureOpenAI } = require("openai");

const router = express.Router();

// Initialize Azure OpenAI client
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
});

// System prompt for NightMind AI
const SYSTEM_PROMPT = `You are NightMind, an empathetic AI companion designed to help people process anxiety and late-night thoughts. You are:

- Warm, understanding, and non-judgmental
- Skilled at asking clarifying questions to help users explore their thoughts
- Focused on providing emotional support and practical coping strategies
- Able to recognize anxiety patterns and gently guide users toward healthier perspectives
- Conversational and friendly, avoiding clinical or robotic language

Remember to:
- Validate the user's feelings
- Ask open-ended questions to encourage reflection
- Suggest practical coping techniques when appropriate
- Be supportive but not prescriptive
- Encourage professional help for serious mental health concerns`;

// Chat completion endpoint
router.post("/complete", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;

    // Customize system prompt based on user's communication style preference
    let systemPrompt = SYSTEM_PROMPT;
    if (userProfile?.preferredCommunicationStyle) {
      switch (userProfile.preferredCommunicationStyle) {
        case "direct":
          systemPrompt +=
            "\n\nCommunication style: Be direct and solution-focused.";
          break;
        case "analytical":
          systemPrompt +=
            "\n\nCommunication style: Use logical analysis and structured thinking.";
          break;
        case "empathetic":
        default:
          systemPrompt +=
            "\n\nCommunication style: Be especially warm and emotionally supportive.";
      }
    }

    // Prepare messages for Azure OpenAI
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    // Get completion from Azure OpenAI
    const completion = await client.chat.completions.create({
      messages: chatMessages,
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      content: aiResponse,
      timestamp: new Date(),
      tags: extractTags(aiResponse),
    });
  } catch (error) {
    console.error("Chat completion error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      message: error.message,
    });
  }
});

// Analyze conversation endpoint
router.post("/analyze", async (req, res) => {
  try {
    const { conversation } = req.body;

    // Create analysis prompt
    const analysisPrompt = `Analyze this anxiety conversation and provide:
1. Main themes and patterns
2. Potential triggers identified
3. Progress or improvements noted
4. Suggested coping strategies

Conversation:
${conversation.messages.map((m) => `${m.sender}: ${m.content}`).join("\n")}`;

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI therapist analyzing conversations for patterns and insights.",
        },
        { role: "user", content: analysisPrompt },
      ],
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      temperature: 0.3,
      max_tokens: 300,
    });

    const analysis = completion.choices[0].message.content;

    res.json({
      summary: analysis,
      mood: detectOverallMood(conversation.messages),
      tags: extractAllTags(conversation.messages),
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze conversation",
      message: error.message,
    });
  }
});

// Helper functions
function extractTags(content) {
  const keywords = [
    "anxiety",
    "stress",
    "work",
    "sleep",
    "relationship",
    "family",
    "health",
    "decision",
    "future",
    "money",
    "career",
    "self-doubt",
    "confidence",
    "fear",
    "anger",
    "sadness",
    "joy",
    "hope",
    "startup",
    "business",
    "technology",
    "coding",
    "innovation",
  ];

  return keywords.filter((keyword) =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );
}

function extractAllTags(messages) {
  const allTags = messages.flatMap((msg) => extractTags(msg.content));
  return [...new Set(allTags)];
}

function detectOverallMood(messages) {
  const positiveWords = [
    "better",
    "good",
    "happy",
    "calm",
    "peaceful",
    "hopeful",
    "confident",
  ];
  const negativeWords = [
    "anxious",
    "worried",
    "scared",
    "stressed",
    "overwhelmed",
    "sad",
    "angry",
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  messages.forEach((msg) => {
    const content = msg.content.toLowerCase();
    positiveWords.forEach((word) => {
      if (content.includes(word)) positiveCount++;
    });
    negativeWords.forEach((word) => {
      if (content.includes(word)) negativeCount++;
    });
  });

  if (positiveCount > negativeCount * 1.5) return "positive";
  if (negativeCount > positiveCount * 1.5) return "negative";
  return "neutral";
}

module.exports = router;
