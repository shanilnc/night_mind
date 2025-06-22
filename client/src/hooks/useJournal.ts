import { useState, useEffect, useCallback } from "react";
import {
  api,
  JournalEntry,
  MoodEntry,
  Insight,
  JournalStats,
} from "../services/api";

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      tags?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getJournalEntries(params);
        setEntries(data.entries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load entries");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMoodEntries = useCallback(
    async (params?: { startDate?: string; endDate?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMoodEntries(params);
        setMoodEntries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load mood entries"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadInsights = useCallback(async (params?: { type?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInsights(params);
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(
    async (params?: { startDate?: string; endDate?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getJournalStats(params);
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load statistics"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createEntry = useCallback(
    async (entryData: {
      title?: string;
      content: string;
      mood?: number;
      tags?: string[];
      anxietyLevel?: number;
      gratitude?: string;
      goals?: string;
    }) => {
      setError(null);
      try {
        const newEntry = await api.createJournalEntry(entryData);
        setEntries((prev) => [newEntry, ...prev]);
        return newEntry;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create entry");
        throw err;
      }
    },
    []
  );

  const updateEntry = useCallback(
    async (
      id: string,
      entryData: {
        title?: string;
        content?: string;
        mood?: number;
        tags?: string[];
        anxietyLevel?: number;
        gratitude?: string;
        goals?: string;
      }
    ) => {
      setError(null);
      try {
        const updatedEntry = await api.updateJournalEntry(id, entryData);
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? updatedEntry : entry))
        );
        return updatedEntry;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update entry");
        throw err;
      }
    },
    []
  );

  const deleteEntry = useCallback(async (id: string) => {
    setError(null);
    try {
      await api.deleteJournalEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
      throw err;
    }
  }, []);

  const createMoodEntry = useCallback(
    async (moodData: {
      mood: number;
      emotions?: string[];
      triggers?: string[];
      physicalSymptoms?: string[];
      notes?: string;
    }) => {
      setError(null);
      try {
        const newMoodEntry = await api.createMoodEntry(moodData);
        setMoodEntries((prev) => [newMoodEntry, ...prev]);
        return newMoodEntry;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create mood entry"
        );
        throw err;
      }
    },
    []
  );

  const createInsight = useCallback(
    async (insightData: {
      type: "pattern" | "trigger" | "improvement" | "achievement";
      title: string;
      description: string;
      frequency?: number;
      actionable?: string;
    }) => {
      setError(null);
      try {
        const newInsight = await api.createInsight(insightData);
        setInsights((prev) => [newInsight, ...prev]);
        return newInsight;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create insight"
        );
        throw err;
      }
    },
    []
  );

  const createJournalFromConversation = useCallback(
    async (conversation: any) => {
      setError(null);
      try {
        const newEntry = await api.createJournalFromConversation(conversation);
        setEntries((prev) => [newEntry, ...prev]);
        return newEntry;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create journal from conversation"
        );
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    entries,
    moodEntries,
    insights,
    stats,
    loading,
    error,

    // Actions
    loadEntries,
    loadMoodEntries,
    loadInsights,
    loadStats,
    createEntry,
    updateEntry,
    deleteEntry,
    createMoodEntry,
    createInsight,
    createJournalFromConversation,
    clearError,
  };
}
