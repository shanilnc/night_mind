import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Tag,
  Clock,
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Heart,
  BarChart3,
  Lightbulb,
  Smile,
  Frown,
  Meh,
  Target,
  BookOpen,
  Filter,
  X,
  MessageSquare,
} from "lucide-react";
import { useJournal } from "../../hooks/useJournal";

type JournalViewMode =
  | "entries"
  | "mood"
  | "insights"
  | "stats"
  | "new-entry"
  | "edit-entry";

export function JournalView() {
  const [mode, setMode] = useState<JournalViewMode>("entries");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentEntry, setCurrentEntry] = useState<any>(null);

  const {
    entries,
    moodEntries,
    insights,
    stats,
    loading,
    error,
    loadEntries,
    loadMoodEntries,
    loadInsights,
    loadStats,
    createEntry,
    updateEntry,
    deleteEntry,
    createMoodEntry,
    createJournalFromConversation,
    clearError,
  } = useJournal();

  // Form states
  const [entryForm, setEntryForm] = useState({
    title: "",
    content: "",
    mood: 5,
    tags: [] as string[],
    anxietyLevel: 5,
    gratitude: "",
    goals: "",
  });

  const [moodForm, setMoodForm] = useState({
    mood: 5,
    emotions: [] as string[],
    triggers: [] as string[],
    physicalSymptoms: [] as string[],
    notes: "",
  });

  const [newTag, setNewTag] = useState("");
  const [newEmotion, setNewEmotion] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newSymptom, setNewSymptom] = useState("");

  useEffect(() => {
    loadData();
  }, [mode]);

  const loadData = async () => {
    switch (mode) {
      case "entries":
        await loadEntries({ search: searchTerm });
        break;
      case "mood":
        await loadMoodEntries();
        break;
      case "insights":
        await loadInsights();
        break;
      case "stats":
        await loadStats();
        break;
    }
  };

  const handleCreateEntry = async () => {
    try {
      await createEntry(entryForm);
      setEntryForm({
        title: "",
        content: "",
        mood: 5,
        tags: [],
        anxietyLevel: 5,
        gratitude: "",
        goals: "",
      });
      setMode("entries");
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  };

  const handleCreateMoodEntry = async () => {
    try {
      await createMoodEntry(moodForm);
      setMoodForm({
        mood: 5,
        emotions: [],
        triggers: [],
        physicalSymptoms: [],
        notes: "",
      });
      setMode("mood");
    } catch (error) {
      console.error("Failed to create mood entry:", error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteEntry(id);
      } catch (error) {
        console.error("Failed to delete entry:", error);
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !entryForm.tags.includes(newTag.trim())) {
      setEntryForm((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEntryForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addEmotion = () => {
    if (newEmotion.trim() && !moodForm.emotions.includes(newEmotion.trim())) {
      setMoodForm((prev) => ({
        ...prev,
        emotions: [...prev.emotions, newEmotion.trim()],
      }));
      setNewEmotion("");
    }
  };

  const removeEmotion = (emotionToRemove: string) => {
    setMoodForm((prev) => ({
      ...prev,
      emotions: prev.emotions.filter((emotion) => emotion !== emotionToRemove),
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="text-green-400" size={16} />;
    if (mood >= 4) return <Meh className="text-yellow-400" size={16} />;
    return <Frown className="text-red-400" size={16} />;
  };

  // Test function to demonstrate conversation-to-journal feature
  const testConversationToJournal = async () => {
    const testConversation = {
      id: generateId(),
      title: "Test Conversation",
      messages: [
        {
          id: "1",
          content:
            "I'm feeling really anxious about my startup funding round. The investors are asking tough questions and I'm worried about the pitch.",
          sender: "user",
          timestamp: new Date(),
        },
        {
          id: "2",
          content:
            "I understand this is a stressful time. Let's break down what's causing the most anxiety about the funding round.",
          sender: "ai",
          timestamp: new Date(),
        },
        {
          id: "3",
          content:
            "I think it's the fear of rejection and the pressure to succeed. My team is counting on me and I don't want to let them down.",
          sender: "user",
          timestamp: new Date(),
        },
      ],
      startTime: new Date(),
      endTime: new Date(),
      tags: ["anxiety", "business", "startup"],
    };

    try {
      await createJournalFromConversation(testConversation);
      alert(
        "Test conversation converted to journal entry! Check the entries tab."
      );
    } catch (error) {
      console.error("Failed to create test journal entry:", error);
    }
  };

  // Helper function to generate unique IDs
  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Error display
  if (error) {
    return (
      <div className="h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Error</div>
          <div className="text-slate-400 mb-4">{error}</div>
          <button
            onClick={clearError}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderEntries = () => (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">
            No journal entries yet
          </h3>
          <p className="text-slate-500 mb-4">
            Your conversations will automatically become journal entries. Start
            chatting to see your thoughts documented.
          </p>
          <button
            onClick={() => setMode("new-entry")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="inline mr-2" />
            Manual Entry
          </button>
        </div>
      ) : (
        entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors ${
              entry.isFromConversation
                ? "border-l-4 border-blue-500"
                : "border-l-4 border-green-500"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-slate-400 text-sm">
                  {formatDate(entry.timestamp)}
                </span>
                {entry.mood && getMoodIcon(entry.mood)}
                {entry.isFromConversation && (
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                    Auto-generated
                  </span>
                )}
                {!entry.isFromConversation && (
                  <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs">
                    Manual Entry
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!entry.isFromConversation && (
                  <button
                    onClick={() => {
                      setCurrentEntry(entry);
                      setEntryForm({
                        title: entry.title,
                        content: entry.content,
                        mood: entry.mood || 5,
                        tags: entry.tags,
                        anxietyLevel: entry.anxietyLevel || 5,
                        gratitude: entry.gratitude || "",
                        goals: entry.goals || "",
                      });
                      setMode("edit-entry");
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-white font-medium mb-2">{entry.title}</h3>
            <p className="text-slate-300 text-sm mb-3 leading-relaxed">
              {entry.content.length > 200
                ? entry.content.substring(0, 200) + "..."
                : entry.content}
            </p>

            {entry.isFromConversation && entry.messageCount && (
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                <span>📝 {entry.messageCount} messages</span>
                <span>👤 {entry.userMessageCount} from you</span>
                <span>🤖 {entry.aiMessageCount} from AI</span>
              </div>
            )}

            {entry.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Tag size={14} className="text-slate-500" />
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {entry.anxietyLevel && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp size={14} />
                <span>Anxiety Level: {entry.anxietyLevel}/10</span>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );

  const renderMoodEntries = () => (
    <div className="space-y-4">
      {moodEntries.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">
            No mood entries yet
          </h3>
          <p className="text-slate-500">
            Start tracking your mood to gain insights into your emotional
            patterns
          </p>
        </div>
      ) : (
        moodEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-slate-400 text-sm">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getMoodIcon(entry.mood)}
                <span className="text-white font-medium">{entry.mood}/10</span>
              </div>
            </div>

            {entry.emotions.length > 0 && (
              <div className="mb-3">
                <span className="text-slate-400 text-sm">Emotions: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.notes && (
              <p className="text-slate-300 text-sm">{entry.notes}</p>
            )}
          </motion.div>
        ))
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-4">
      {insights.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="mx-auto w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">
            No insights yet
          </h3>
          <p className="text-slate-500">
            Continue journaling to unlock personalized insights about your
            patterns
          </p>
        </div>
      ) : (
        insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Lightbulb size={20} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                <p className="text-slate-300 text-sm mb-2">
                  {insight.description}
                </p>
                {insight.actionable && (
                  <div className="bg-slate-700/50 rounded p-2">
                    <span className="text-slate-400 text-xs">
                      Suggested Action:
                    </span>
                    <p className="text-slate-200 text-sm mt-1">
                      {insight.actionable}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      {stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={20} className="text-blue-400" />
                <span className="text-slate-400 text-sm">Total Entries</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.totalEntries}
              </span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={20} className="text-blue-400" />
                <span className="text-slate-400 text-sm">
                  From Conversations
                </span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.conversationEntries}
              </span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 size={20} className="text-green-400" />
                <span className="text-slate-400 text-sm">Manual Entries</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.manualEntries}
              </span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={20} className="text-pink-400" />
                <span className="text-slate-400 text-sm">Mood Entries</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.totalMoodEntries}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Smile size={20} className="text-green-400" />
                <span className="text-slate-400 text-sm">Avg Mood</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.averageMood}/10
              </span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={20} className="text-yellow-400" />
                <span className="text-slate-400 text-sm">Insights</span>
              </div>
              <span className="text-2xl font-bold text-white">
                {stats.insights}
              </span>
            </div>
          </div>

          {stats.topTags.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">
                Most Common Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map(({ tag, count }) => (
                  <span
                    key={tag}
                    className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {stats.moodByDate.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">
                Mood Trends (Last 7 Days)
              </h3>
              <div className="space-y-2">
                {stats.moodByDate.map(({ date, averageMood }) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">
                      {new Date(date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {getMoodIcon(Math.round(averageMood))}
                      <span className="text-white">
                        {averageMood.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-2">
            No statistics available
          </h3>
          <p className="text-slate-500">
            Start chatting to see your conversation statistics and insights
          </p>
        </div>
      )}
    </div>
  );

  const renderNewEntryForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-medium text-white mb-4">
          New Journal Entry
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Title</label>
            <input
              type="text"
              value={entryForm.title}
              onChange={(e) =>
                setEntryForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entry title (optional)"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Content *
            </label>
            <textarea
              value={entryForm.content}
              onChange={(e) =>
                setEntryForm((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="Write your thoughts, feelings, or experiences..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Mood (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={entryForm.mood}
                onChange={(e) =>
                  setEntryForm((prev) => ({
                    ...prev,
                    mood: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>😢</span>
                <span>😐</span>
                <span>😊</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">
                Anxiety Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={entryForm.anxietyLevel}
                onChange={(e) =>
                  setEntryForm((prev) => ({
                    ...prev,
                    anxietyLevel: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Calm</span>
                <span>Anxious</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {entryForm.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Gratitude
            </label>
            <textarea
              value={entryForm.gratitude}
              onChange={(e) =>
                setEntryForm((prev) => ({ ...prev, gratitude: e.target.value }))
              }
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="What are you grateful for today?"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Goals</label>
            <textarea
              value={entryForm.goals}
              onChange={(e) =>
                setEntryForm((prev) => ({ ...prev, goals: e.target.value }))
              }
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="What are your goals or intentions?"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setMode("entries")}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEntry}
            disabled={!entryForm.content.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );

  const renderMoodForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-medium text-white mb-4">Track Your Mood</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              How are you feeling? (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moodForm.mood}
              onChange={(e) =>
                setMoodForm((prev) => ({
                  ...prev,
                  mood: parseInt(e.target.value),
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>😢 Terrible</span>
              <span>😐 Okay</span>
              <span>😊 Great</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">
              Emotions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addEmotion()}
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add an emotion..."
              />
              <button
                onClick={addEmotion}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {moodForm.emotions.map((emotion) => (
                <span
                  key={emotion}
                  className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {emotion}
                  <button
                    onClick={() => removeEmotion(emotion)}
                    className="hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Notes</label>
            <textarea
              value={moodForm.notes}
              onChange={(e) =>
                setMoodForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="Any additional thoughts about your mood..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setMode("mood")}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateMoodEntry}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Save Mood Entry
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light text-white">Journal & Insights</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("new-entry")}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Manual Entry
            </button>
            <button
              onClick={() => setMode("mood")}
              className="bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <Heart size={16} />
              Track Mood
            </button>
            <button
              onClick={testConversationToJournal}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Test Auto-Journal
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          {[
            { id: "entries", label: "Entries", icon: BookOpen },
            { id: "mood", label: "Mood", icon: Heart },
            { id: "insights", label: "Insights", icon: Lightbulb },
            { id: "stats", label: "Stats", icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id as JournalViewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                mode === id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        {mode === "entries" && (
          <div className="mt-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-400 mt-2">Loading...</p>
              </div>
            ) : (
              <>
                {mode === "entries" && renderEntries()}
                {mode === "mood" && renderMoodEntries()}
                {mode === "insights" && renderInsights()}
                {mode === "stats" && renderStats()}
                {mode === "new-entry" && renderNewEntryForm()}
                {mode === "edit-entry" && renderNewEntryForm()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
