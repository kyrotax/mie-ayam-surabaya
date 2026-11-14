import { AutoReplyTemplate, Faq, ChatLog } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAutoReplyService(): Promise<AutoReplyTemplate> {
  await delay();
  return getDummyState().autoReply;
}

export async function updateAutoReplyService(template: AutoReplyTemplate): Promise<AutoReplyTemplate> {
  await delay();
  const state = getDummyState();
  saveDummyState({ ...state, autoReply: template });
  return template;
}

export async function getFaqListService(): Promise<Faq[]> {
  await delay();
  return getDummyState().faqs;
}

export async function createFaqService(faq: Omit<Faq, "id">): Promise<Faq> {
  await delay();
  const state = getDummyState();
  const newFaq: Faq = { ...faq, id: `faq_${Date.now()}` };
  saveDummyState({ ...state, faqs: [...state.faqs, newFaq] });
  return newFaq;
}

export async function updateFaqService(id: string, updates: Partial<Faq>): Promise<Faq> {
  await delay();
  const state = getDummyState();
  const existing = state.faqs.find((f) => f.id === id);
  if (!existing) throw new Error("FAQ tidak ditemukan");
  const updated: Faq = { ...existing, ...updates };
  saveDummyState({
    ...state,
    faqs: state.faqs.map((f) => (f.id === id ? updated : f)),
  });
  return updated;
}

export async function deleteFaqService(id: string): Promise<boolean> {
  await delay();
  const state = getDummyState();
  saveDummyState({
    ...state,
    faqs: state.faqs.filter((f) => f.id !== id),
  });
  return true;
}

export async function getChatLogsService(): Promise<ChatLog[]> {
  await delay();
  return getDummyState().chatLogs;
}

