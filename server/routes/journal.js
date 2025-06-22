const express = require("express");
const router = express.Router();

// In-memory storage (in production, use a database)
let journalEntries = [];
let moodEntries = [];
let insights = [];

// Helper function to generate unique IDs
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Helper function to analyze conversation and extract insights
const analyzeConversation = (conversation) => {
  const userMessages = conversation.messages.filter(
    (msg) => msg.sender === "user"
  );
  const aiMessages = conversation.messages.filter((msg) => msg.sender === "ai");

  // Extract key themes and topics
  const allText = userMessages.map((msg) => msg.content).join(" ");
  const words = allText.toLowerCase().split(/\s+/);

  // Common anxiety and business-related keywords
  const anxietyKeywords = [
    "anxiety",
    "stress",
    "worry",
    "fear",
    "overwhelm",
    "panic",
    "nervous",
    "concerned",
  ];
  const businessKeywords = [
    "startup",
    "business",
    "strategy",
    "funding",
    "product",
    "market",
    "growth",
    "revenue",
  ];
  const technicalKeywords = [
    "code",
    "technical",
    "development",
    "engineering",
    "architecture",
    "system",
  ];
  const lifeKeywords = [
    "decision",
    "life",
    "future",
    "career",
    "relationship",
    "family",
    "personal",
  ];

  const tags = [];
  const anxietyCount = anxietyKeywords.filter((word) =>
    words.includes(word)
  ).length;
  const businessCount = businessKeywords.filter((word) =>
    words.includes(word)
  ).length;
  const technicalCount = technicalKeywords.filter((word) =>
    words.includes(word)
  ).length;
  const lifeCount = lifeKeywords.filter((word) => words.includes(word)).length;

  if (anxietyCount > 0) tags.push("anxiety");
  if (businessCount > 0) tags.push("business");
  if (technicalCount > 0) tags.push("technical");
  if (lifeCount > 0) tags.push("life-planning");

  // Estimate mood based on conversation content
  let mood = 5; // neutral
  if (anxietyCount > 2) mood = 3; // low mood
  if (businessCount > 2 && anxietyCount < 2) mood = 7; // positive about business

  // Generate title from first user message
  const firstMessage = userMessages[0]?.content || "";
  const title =
    firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage || "Night Conversation";

  // Generate summary
  const summary = `Conversation about ${tags.join(", ")}. ${
    userMessages.length
  } messages exchanged.`;

  return {
    tags,
    mood,
    title,
    summary,
    anxietyLevel: anxietyCount > 2 ? 8 : 5,
    messageCount: conversation.messages.length,
    userMessageCount: userMessages.length,
    aiMessageCount: aiMessages.length,
  };
};

// POST /api/journal/from-conversation - Create journal entry from conversation
router.post("/from-conversation", (req, res) => {
  try {
    const { conversation } = req.body;

    if (
      !conversation ||
      !conversation.messages ||
      conversation.messages.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Valid conversation with messages is required" });
    }

    const analysis = analyzeConversation(conversation);

    const newEntry = {
      id: generateId(),
      title: analysis.title,
      content: `Conversation Summary: ${
        analysis.summary
      }\n\nKey Topics: ${analysis.tags.join(", ")}\nMessages: ${
        analysis.messageCount
      } total (${analysis.userMessageCount} from you, ${
        analysis.aiMessageCount
      } from AI)`,
      mood: analysis.mood,
      tags: analysis.tags,
      anxietyLevel: analysis.anxietyLevel,
      gratitude: null,
      goals: null,
      timestamp: new Date(conversation.startTime || new Date()),
      updatedAt: new Date(),
      conversationId: conversation.id,
      messageCount: analysis.messageCount,
      userMessageCount: analysis.userMessageCount,
      aiMessageCount: analysis.aiMessageCount,
      isFromConversation: true,
    };

    journalEntries.unshift(newEntry);

    // Generate insights if this is a recurring pattern
    generateInsightsFromEntry(newEntry);

    res.status(201).json(newEntry);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to create journal entry from conversation",
        message: error.message,
      });
  }
});

// Helper function to generate insights from journal entries
const generateInsightsFromEntry = (entry) => {
  const similarEntries = journalEntries.filter(
    (e) => e.id !== entry.id && e.tags.some((tag) => entry.tags.includes(tag))
  );

  if (similarEntries.length >= 2) {
    // Check for patterns
    const anxietyEntries = journalEntries.filter((e) =>
      e.tags.includes("anxiety")
    );
    const businessEntries = journalEntries.filter((e) =>
      e.tags.includes("business")
    );

    // Generate insights based on patterns
    if (
      anxietyEntries.length >= 3 &&
      !insights.some((i) => i.title.includes("Anxiety Pattern"))
    ) {
      const insight = {
        id: generateId(),
        type: "pattern",
        title: "Recurring Anxiety Pattern Detected",
        description: `You've had ${anxietyEntries.length} conversations about anxiety-related topics. Consider exploring these patterns during calmer moments.`,
        frequency: anxietyEntries.length,
        actionable:
          'Try scheduling dedicated "worry time" during the day to process concerns before bedtime.',
        lastOccurrence: new Date(),
      };
      insights.unshift(insight);
    }

    if (
      businessEntries.length >= 3 &&
      !insights.some((i) => i.title.includes("Business Focus"))
    ) {
      const insight = {
        id: generateId(),
        type: "achievement",
        title: "Strong Business Focus",
        description: `You've had ${businessEntries.length} conversations about business strategy and growth. Your dedication to strategic thinking is evident.`,
        frequency: businessEntries.length,
        actionable:
          "Consider documenting these insights in a separate business strategy document.",
        lastOccurrence: new Date(),
      };
      insights.unshift(insight);
    }
  }
};

// GET /api/journal/entries - Get all journal entries
router.get("/entries", (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      tags,
      startDate,
      endDate,
    } = req.query;

    let filteredEntries = [...journalEntries];

    // Filter by search term
    if (search) {
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.content.toLowerCase().includes(search.toLowerCase()) ||
          entry.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",");
      filteredEntries = filteredEntries.filter((entry) =>
        tagArray.some((tag) => entry.tags.includes(tag))
      );
    }

    // Filter by date range
    if (startDate || endDate) {
      filteredEntries = filteredEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return entryDate >= start && entryDate <= end;
      });
    }

    // Sort by timestamp (newest first)
    filteredEntries.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

    res.json({
      entries: paginatedEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredEntries.length,
        totalPages: Math.ceil(filteredEntries.length / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch journal entries",
      message: error.message,
    });
  }
});

// POST /api/journal/entries - Create a new journal entry (manual entry)
router.post("/entries", (req, res) => {
  try {
    const {
      title,
      content,
      mood,
      tags = [],
      anxietyLevel,
      gratitude,
      goals,
    } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Content is required" });
    }

    const newEntry = {
      id: generateId(),
      title: title || `Journal Entry ${new Date().toLocaleDateString()}`,
      content: content.trim(),
      mood: mood || null,
      tags: Array.isArray(tags) ? tags : [],
      anxietyLevel: anxietyLevel || null,
      gratitude: gratitude || null,
      goals: goals || null,
      timestamp: new Date(),
      updatedAt: new Date(),
      isFromConversation: false,
    };

    journalEntries.unshift(newEntry);

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create journal entry",
      message: error.message,
    });
  }
});

// GET /api/journal/entries/:id - Get a specific journal entry
router.get("/entries/:id", (req, res) => {
  try {
    const entry = journalEntries.find((e) => e.id === req.params.id);

    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json(entry);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch journal entry", message: error.message });
  }
});

// PUT /api/journal/entries/:id - Update a journal entry
router.put("/entries/:id", (req, res) => {
  try {
    const { title, content, mood, tags, anxietyLevel, gratitude, goals } =
      req.body;

    const entryIndex = journalEntries.findIndex((e) => e.id === req.params.id);

    if (entryIndex === -1) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    const updatedEntry = {
      ...journalEntries[entryIndex],
      title: title || journalEntries[entryIndex].title,
      content: content || journalEntries[entryIndex].content,
      mood: mood !== undefined ? mood : journalEntries[entryIndex].mood,
      tags: Array.isArray(tags) ? tags : journalEntries[entryIndex].tags,
      anxietyLevel:
        anxietyLevel !== undefined
          ? anxietyLevel
          : journalEntries[entryIndex].anxietyLevel,
      gratitude:
        gratitude !== undefined
          ? gratitude
          : journalEntries[entryIndex].gratitude,
      goals: goals !== undefined ? goals : journalEntries[entryIndex].goals,
      updatedAt: new Date(),
    };

    journalEntries[entryIndex] = updatedEntry;

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update journal entry",
      message: error.message,
    });
  }
});

// DELETE /api/journal/entries/:id - Delete a journal entry
router.delete("/entries/:id", (req, res) => {
  try {
    const entryIndex = journalEntries.findIndex((e) => e.id === req.params.id);

    if (entryIndex === -1) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    journalEntries.splice(entryIndex, 1);

    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete journal entry",
      message: error.message,
    });
  }
});

// GET /api/journal/mood - Get mood entries
router.get("/mood", (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filteredMoods = [...moodEntries];

    if (startDate || endDate) {
      filteredMoods = filteredMoods.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return entryDate >= start && entryDate <= end;
      });
    }

    filteredMoods.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(filteredMoods);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch mood entries", message: error.message });
  }
});

// POST /api/journal/mood - Create a mood entry
router.post("/mood", (req, res) => {
  try {
    const {
      mood,
      emotions = [],
      triggers = [],
      physicalSymptoms = [],
      notes,
    } = req.body;

    if (mood === undefined || mood < 1 || mood > 10) {
      return res
        .status(400)
        .json({ error: "Mood must be a number between 1 and 10" });
    }

    const newMoodEntry = {
      id: generateId(),
      mood: parseInt(mood),
      emotions: Array.isArray(emotions) ? emotions : [],
      triggers: Array.isArray(triggers) ? triggers : [],
      physicalSymptoms: Array.isArray(physicalSymptoms) ? physicalSymptoms : [],
      notes: notes || null,
      timestamp: new Date(),
    };

    moodEntries.unshift(newMoodEntry);

    res.status(201).json(newMoodEntry);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create mood entry", message: error.message });
  }
});

// GET /api/journal/insights - Get insights
router.get("/insights", (req, res) => {
  try {
    const { type } = req.query;

    let filteredInsights = [...insights];

    if (type) {
      filteredInsights = filteredInsights.filter(
        (insight) => insight.type === type
      );
    }

    filteredInsights.sort(
      (a, b) => new Date(b.lastOccurrence) - new Date(a.lastOccurrence)
    );

    res.json(filteredInsights);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch insights", message: error.message });
  }
});

// POST /api/journal/insights - Create an insight
router.post("/insights", (req, res) => {
  try {
    const { type, title, description, frequency = 1, actionable } = req.body;

    if (!type || !title || !description) {
      return res
        .status(400)
        .json({ error: "Type, title, and description are required" });
    }

    const newInsight = {
      id: generateId(),
      type,
      title,
      description,
      frequency: parseInt(frequency),
      actionable: actionable || null,
      lastOccurrence: new Date(),
    };

    insights.unshift(newInsight);

    res.status(201).json(newInsight);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create insight", message: error.message });
  }
});

// GET /api/journal/stats - Get journal statistics
router.get("/stats", (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filteredEntries = [...journalEntries];
    let filteredMoods = [...moodEntries];

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      filteredEntries = filteredEntries.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= start && entryDate <= end;
      });

      filteredMoods = filteredMoods.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= start && entryDate <= end;
      });
    }

    // Calculate statistics
    const totalEntries = filteredEntries.length;
    const conversationEntries = filteredEntries.filter(
      (e) => e.isFromConversation
    ).length;
    const manualEntries = filteredEntries.filter(
      (e) => !e.isFromConversation
    ).length;
    const totalMoodEntries = filteredMoods.length;
    const averageMood =
      filteredMoods.length > 0
        ? filteredMoods.reduce((sum, entry) => sum + entry.mood, 0) /
          filteredMoods.length
        : 0;

    // Most common tags
    const tagCounts = {};
    filteredEntries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Mood trends
    const moodTrends = filteredMoods.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += entry.mood;
      acc[date].count += 1;
      return acc;
    }, {});

    const moodByDate = Object.entries(moodTrends).map(([date, data]) => ({
      date,
      averageMood: data.total / data.count,
    }));

    res.json({
      totalEntries,
      conversationEntries,
      manualEntries,
      totalMoodEntries,
      averageMood: Math.round(averageMood * 10) / 10,
      topTags,
      moodByDate: moodByDate.slice(-7), // Last 7 days
      insights: insights.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch statistics", message: error.message });
  }
});

module.exports = router;
