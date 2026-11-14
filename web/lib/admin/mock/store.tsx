"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  StoreStatus,
  StatusLogEntry,
  StoreHour,
  MenuItem,
  Order,
  ExtractionJob,
  ChatLog,
  Faq,
  AutoReplyTemplate,
  SiteContent,
} from "../types";
import { generateSeedData } from "./seed";

export const DUMMY_STORAGE_KEY = "mm_dummy_state_v1";

export type DummyState = {
  users: User[];
  menu: MenuItem[];
  storeStatus: StoreStatus;
  statusLogs: StatusLogEntry[];
  hours: StoreHour[];
  faqs: Faq[];
  autoReply: AutoReplyTemplate;
  siteContent: SiteContent;
  extractionJobs: ExtractionJob[];
  orders: Order[];
  chatLogs: ChatLog[];
};

let memoryState: DummyState | null = null;
const listeners = new Set<() => void>();

export function subscribeToStore(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function getDummyState(): DummyState {
  if (typeof window === "undefined") {
    if (!memoryState) {
      memoryState = generateSeedData();
    }
    return memoryState;
  }

  try {
    const raw = localStorage.getItem(DUMMY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryState = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Failed reading localStorage:", err);
  }

  if (!memoryState) {
    memoryState = generateSeedData();
    try {
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(memoryState));
    } catch (e) {
      console.warn("Failed saving seed to localStorage:", e);
    }
  }
  return memoryState;
}

export function saveDummyState(newState: DummyState) {
  memoryState = newState;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("localStorage quota exceeded or write failed; keeping in memory", e);
    }
  }
  notifyListeners();
}

export function resetDummyState() {
  const seed = generateSeedData();
  saveDummyState(seed);
}

const DummyStoreContext = createContext<{
  isReady: boolean;
  resetToSeed: () => void;
}>({
  isReady: false,
  resetToSeed: () => {},
});

export function DummyStoreProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getDummyState();
    setIsReady(true);
  }, []);

  return (
    <DummyStoreContext.Provider
      value={{
        isReady,
        resetToSeed: resetDummyState,
      }}
    >
      {children}
    </DummyStoreContext.Provider>
  );
}

export function useDummyStore() {
  return useContext(DummyStoreContext);
}
