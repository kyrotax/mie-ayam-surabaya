import { StoreStatus, StoreHour, StatusLogEntry } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";
import { supabase } from "@/src/supabaseClient";

export async function getStoreStatusService(): Promise<StoreStatus> {
  try {
    const { data, error } = await supabase
      .from("store_status")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Supabase getStoreStatusService error:", error.message);
      return getDummyState().storeStatus;
    }

    if (!data) {
      return getDummyState().storeStatus;
    }

    return {
      isOpen: Boolean(data.is_open),
      manualOverride: data.manual_override || "none",
      statusNote: data.status_note || undefined,
      nextOpenText: data.next_open_text || undefined,
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Failed to fetch store status from Supabase:", err);
    return getDummyState().storeStatus;
  }
}

export async function updateStoreStatusService(
  updates: Partial<StoreStatus>,
  actorName: string,
  actionDesc: string
): Promise<StoreStatus> {
  const state = getDummyState();
  const newStatus: StoreStatus = {
    ...state.storeStatus,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("store_status").upsert({
      id: 1,
      user_id: user?.id,
      is_open: newStatus.isOpen,
      manual_override: newStatus.manualOverride,
      status_note: newStatus.statusNote,
      next_open_text: newStatus.nextOpenText,
      updated_at: newStatus.updatedAt,
    });
  } catch {
    // Graceful fallback to local state if offline or table not ready
  }

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
  return getDummyState().hours;
}

export async function updateStoreHoursService(hours: StoreHour[]): Promise<StoreHour[]> {
  const state = getDummyState();
  saveDummyState({ ...state, hours });
  return hours;
}

export async function getStatusLogsService(): Promise<StatusLogEntry[]> {
  return getDummyState().statusLogs;
}
