import { StoreStatus, StoreHour, StoreClosure, StatusLogEntry } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";
import { supabase } from "@/src/supabaseClient";

function applyScheduledClosure(status: StoreStatus): StoreStatus {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const closure = (getDummyState().scheduledClosures ?? []).find(
    (item) => item.date === dateKey
  );
  if (!closure || status.manualOverride === "force_open") return status;

  return {
    ...status,
    isOpen: false,
    statusNote: `Warung tutup terjadwal (${closure.reason}).`,
    nextOpenText: "Buka kembali mengikuti jadwal operasional berikutnya.",
  };
}

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
      return applyScheduledClosure(getDummyState().storeStatus);
    }

    if (!data) {
      return applyScheduledClosure(getDummyState().storeStatus);
    }

    return applyScheduledClosure({
      isOpen: Boolean(data.is_open),
      manualOverride: data.manual_override || "none",
      statusNote: data.status_note || undefined,
      nextOpenText: data.next_open_text || undefined,
      updatedAt: data.updated_at || new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to fetch store status from Supabase:", err);
    return applyScheduledClosure(getDummyState().storeStatus);
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

export async function getStoreClosuresService(): Promise<StoreClosure[]> {
  return getDummyState().scheduledClosures ?? [];
}

export async function updateStoreClosuresService(
  closures: StoreClosure[]
): Promise<StoreClosure[]> {
  const state = getDummyState();
  saveDummyState({ ...state, scheduledClosures: closures });
  return closures;
}

export async function getStatusLogsService(): Promise<StatusLogEntry[]> {
  return getDummyState().statusLogs;
}
