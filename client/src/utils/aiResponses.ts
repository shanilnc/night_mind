import { Message } from '../types';

const responses = {
  anxiety: [
    "I can hear that you're feeling overwhelmed right now. Let's take a moment to break this down together. What's the most pressing concern on your mind?",
    "It sounds like your mind is racing. That's completely normal when we're processing big decisions. Can you tell me what specific outcome you're worried about?",
    "I notice you're carrying a lot right now. Let's focus on one thing at a time. What feels most urgent to address first?",
  ],
  startup: [
    "Building something new always comes with uncertainty. What aspect of your startup strategy is keeping you up tonight?",
    "Every successful founder faces these moments of doubt. What's your biggest concern about your go-to-market approach?",
    "It's natural to question your decisions when you're pioneering something new. Walk me through what's troubling you about your business direction.",
  ],
  decision: [
    "Big decisions can feel paralyzing, especially late at night when our minds amplify concerns. What are the key factors you're weighing?",
    "Let's create some clarity around this decision. What would need to be true for you to feel confident moving forward?",
    "Decision fatigue is real. What's the core question you need to answer to move forward?",
  ],
  general: [
    "I'm here to listen and help you work through whatever's on your mind. What's keeping you awake tonight?",
    "Sometimes talking through our thoughts helps organize them. What's been circling in your mind?",
    "I can sense you need to process something. Take your time and share what feels most important right now.",
  ],
};

export async function generateAIResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
  const lowerMessage = userMessage.toLowerCase();
  
  // Analyze the user's message for context
  let category = 'general';
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    category = 'anxiety';
  } else if (lowerMessage.includes('startup') || lowerMessage.includes('business') || lowerMessage.includes('product')) {
    category = 'startup';
  } else if (lowerMessage.includes('decision') || lowerMessage.includes('choose') || lowerMessage.includes('should i')) {
    category = 'decision';
  }

  // Get a random response from the appropriate category
  const categoryResponses = responses[category as keyof typeof responses];
  const baseResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

  // Add personalization based on conversation history
  if (conversationHistory.length > 2) {
    const previousTopics = conversationHistory
      .filter(msg => msg.sender === 'user')
      .flatMap(msg => msg.tags || [])
      .filter((tag, index, array) => array.indexOf(tag) === index);

    if (previousTopics.length > 0) {
      const contextualAddition = ` I remember we've touched on ${previousTopics.slice(0, 2).join(' and ')} before. How does this connect to what you're thinking about now?`;
      return baseResponse + contextualAddition;
    }
  }

  return baseResponse;
}