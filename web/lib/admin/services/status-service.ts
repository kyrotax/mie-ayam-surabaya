import { StoreStatus, StoreHour, StatusLogEntry } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStoreStatusService(): Promise<StoreStatus> {
  await delay();
  return getDummyState().storeStatus;
}

export async function updateStoreStatusService(
  updates: Partial<StoreStatus>,
  actorName: string,
  actionDesc: string
): Promise<StoreStatus> {
  await delay();
  const state = getDummyState();
  const newStatus: StoreStatus = {
    ...state.storeStatus,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const newLog: StatusLogEntry = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName,
    action: actionDesc,
    note: updates.statusNote || updates.overrideReason,
  };

  saveDummyState({
    ...state,
    storeStatus: newStatus,
    statusLogs: [newLog, ...state.statusLogs],
  });

  return newStatus;
}

export async function getStoreHoursService(): Promise<StoreHour[]> {
  await delay();
  return getDummyState().hours;
}

export async function updateStoreHoursService(hours: StoreHour[]): Promise<StoreHour[]> {
  await delay();
  const state = getDummyState();
  saveDummyState({ ...state, hours });
  return hours;
}

export async function getStatusLogsService(): Promise<StatusLogEntry[]> {
  await delay();
  return getDummyState().statusLogs;
}

